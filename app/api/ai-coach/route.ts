import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const SYSTEM_PROMPT = `You are a helpful personal planning assistant. Create realistic, practical schedules for users based on their goals.`

function buildUserPrompt(goalText: string, goalType: string, currentDate: string, activePlanContext?: string | null): string {
  const planNote = activePlanContext ? `\nUser context: ${activePlanContext}` : ''
  return `Create a personal schedule for this goal: "${goalText}"
Goal type: ${goalType}
Start date: ${currentDate}${planNote}

Respond with ONLY a JSON object (no markdown, no explanation) in this exact format:
{
  "summary": "brief 1-2 sentence description of the plan",
  "durationWeeks": <number 1-12>,
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
- Max 2-3 tasks per day, be realistic
- Morning (07:00-09:00) for fitness, evening (19:00-21:00) for habits
- Dates start from ${currentDate}
- Use the same language as the user goal (Russian/Tajik/English)
- Week labels in Russian like "Неделя 1 (1–7 апр)"
- Return ONLY the JSON, nothing else`
}

const TaskSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  durationMinutes: z.number().int().positive(),
})

const WeekSchema = z.object({
  weekLabel: z.string().min(1),
  tasks: z.array(TaskSchema).min(1).max(21),
})

const ScheduleSchema = z.object({
  summary: z.string().min(1),
  durationWeeks: z.number().int().min(1).max(12),
  goalType: z.enum(['fitness', 'habit', 'meeting', 'self-improvement']),
  weeks: z.array(WeekSchema).min(1).max(12),
})

function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured')

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.7,
    },
  })

  const result = await model.generateContent(prompt)

  // Check if blocked by safety filters
  const candidate = result.response.candidates?.[0]
  if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
    throw new Error(`Model stopped: ${candidate.finishReason}`)
  }

  return result.response.text()
}

export async function POST(req: NextRequest) {
  try {
    const { goalText, goalType, currentDate, activePlanContext } = await req.json()

    if (!goalText || typeof goalText !== 'string') {
      return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
    }

    const today = currentDate ?? new Date().toISOString().split('T')[0]
    const userPrompt = buildUserPrompt(goalText, goalType ?? 'fitness', today, activePlanContext)

    let rawText = ''
    let parsed: unknown
    let lastError: unknown

    // Try up to 2 times
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        rawText = await callGemini(userPrompt)
        rawText = stripMarkdownFences(rawText)
        parsed = JSON.parse(rawText)
        lastError = null
        break
      } catch (e) {
        lastError = e
        // Small delay before retry
        if (attempt === 0) await new Promise((r) => setTimeout(r, 800))
      }
    }

    if (lastError || !parsed) {
      const preview = rawText ? rawText.slice(0, 200) : '(empty)'
      throw new Error(`Failed to parse AI response. Raw: ${preview}`)
    }

    const validated = ScheduleSchema.parse(parsed)
    return NextResponse.json({ plan: validated })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'

    if (message.includes('JSON') || message.includes('ZodError') || message.includes('parse')) {
      return NextResponse.json({ error: 'invalid_plan', message }, { status: 422 })
    }

    return NextResponse.json({ error: 'api_error', message }, { status: 502 })
  }
}
