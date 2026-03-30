import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'

const SYSTEM_PROMPT = `You are a helpful personal planning assistant. Create realistic, practical schedules for users based on their goals.`

function buildUserPrompt(
  goalText: string,
  goalType: string,
  currentDate: string,
  requestedWeeks: number,
  requestedDays: number | undefined,
  auto: boolean,
  activePlanContext?: string | null,
): string {
  const planNote = activePlanContext ? `\nUser context: ${activePlanContext}` : ''

  const durationRule = auto
    ? `- Choose the most appropriate duration (1–12 weeks) for this goal. Set durationWeeks accordingly.`
    : requestedDays
      ? `- Generate tasks for EXACTLY ${requestedDays} days starting from ${currentDate}. Use durationWeeks: 1 in the JSON.`
      : `- Generate tasks for EXACTLY ${requestedWeeks} week(s). Set durationWeeks: ${requestedWeeks} in the JSON.`

  const durationHint = auto ? '<number 1-12>' : requestedDays ? 1 : requestedWeeks

  return `Create a personal schedule for this goal: "${goalText}"
Goal type: ${goalType}
Start date: ${currentDate}${planNote}

Respond with ONLY a JSON object (no markdown, no explanation) in this exact format:
{
  "summary": "brief 1-2 sentence description of the plan",
  "durationWeeks": ${durationHint},
  "goalType": "${goalType}",
  "weeks": [
    {
      "weekLabel": "Неделя 1 (1–7 апр)",
      "tasks": [
        {
          "title": "task name",
          "description": "short description",
          "date": "YYYY-MM-DD",
          "time": "HH:MM",
          "durationMinutes": <number>
        }
      ]
    }
  ]
}

Rules:
- ${durationRule}
- Max 2-3 tasks per day, be realistic
- Morning (07:00-09:00) for fitness, evening (19:00-21:00) for habits
- Dates start from ${currentDate}
- Use the same language as the user goal (Russian/Tajik/English)
- Week labels in Russian like "Неделя 1 (1–7 апр)"
- Return ONLY the JSON, nothing else`
}

export async function POST(req: NextRequest) {
  try {
    const { goalText, goalType, currentDate, activePlanContext, requestedWeeks, requestedDays, auto } = await req.json()

    if (!goalText || typeof goalText !== 'string') {
      return new Response(JSON.stringify({ error: 'invalid_request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: { temperature: 0.7 },
    })

    const today = currentDate ?? new Date().toISOString().split('T')[0]
    const isAuto = auto === true
    const weeks = typeof requestedWeeks === 'number' ? requestedWeeks : 1
    const days = typeof requestedDays === 'number' ? requestedDays : undefined
    const prompt = buildUserPrompt(goalText, goalType ?? 'fitness', today, weeks, days, isAuto, activePlanContext)

    const result = await model.generateContentStream(prompt)

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) controller.enqueue(encoder.encode(text))
          }
          controller.close()
        } catch (e) {
          controller.error(e)
        }
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: 'api_error', message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
