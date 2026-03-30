import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

function getModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview',
    systemInstruction: 'You are a helpful personal coach. Always respond with ONLY valid JSON, no markdown, no explanations.',
    generationConfig: { temperature: 1.1 },
  })
}

function buildSuggestPrompt(questions: string, preferredWeeks?: number): string {
  const durationHint = preferredWeeks
    ? `The user prefers a plan of approximately ${preferredWeeks} week(s). Set durationWeeks in each suggestion accordingly (stay close to this number).`
    : 'Set durationWeeks between 4 and 12 based on what makes sense for the activity.'

  return `You are a creative personal coach. A user answered 5 lifestyle questions. Based on their EXACT combination of answers, suggest 3 activities that will genuinely excite them.

User's profile (question → answer):
${questions}

STRICT RULES — violating any rule = bad response:
1. All 3 suggestions MUST be from completely different life domains (e.g. sport, creative art, social, wellness, craft — never two from the same domain)
2. NEVER suggest: chess, programming, coding, HTML, CSS, JavaScript, or any IT-related activity UNLESS the user explicitly said they want IT
3. Each suggestion must directly reflect the user's specific answers — explain the connection
4. Vary the goalType across suggestions (don't use the same goalType twice)
5. Be creative and specific — not "занятие спортом" but "бокс для начинающих" or "утренний бег в парке"
6. If user answered "Удиви меня! ✨" for the last question, give at least one truly unexpected suggestion they wouldn't think of themselves
7. ${durationHint}

Return ONLY this JSON (no markdown, no extra text):
{
  "intro": "1 warm sentence in Russian that shows you understood their profile (mention 1-2 specific things from their answers)",
  "suggestions": [
    {
      "emoji": "single relevant emoji",
      "title": "specific activity name in Russian (3-6 words)",
      "description": "why this fits THEIR specific answers, 1-2 sentences in Russian",
      "goalType": "fitness" | "habit" | "meeting" | "self-improvement",
      "durationWeeks": <number>
    }
  ]
}

Generate exactly 3 suggestions in the array.`
}

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const { phase } = body

    if (phase === 'suggest') {
      const { questions, answers } = body
      if (!answers) {
        return new Response(JSON.stringify({ error: 'answers required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const questionsText = questions ?? answers
      const preferredWeeks = typeof body.preferredWeeks === 'number' ? body.preferredWeeks : undefined
      const model = getModel()
      const result = await model.generateContentStream(buildSuggestPrompt(questionsText, preferredWeeks))

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
    }

    return new Response(JSON.stringify({ error: 'unknown phase' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: 'api_error', message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
