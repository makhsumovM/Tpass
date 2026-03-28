import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

function getModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview',
    systemInstruction: 'You are a helpful personal coach. Always respond with ONLY valid JSON, no markdown, no explanations.',
    generationConfig: { temperature: 1.1 },
  })
}

// ── Generate suggestions based on answers ─────────────────────────────────
const SuggestionItemSchema = z.object({
  emoji: z.string(),
  title: z.string(),
  description: z.string().max(250),
  goalType: z.enum(['fitness', 'habit', 'meeting', 'self-improvement']),
  durationWeeks: z.number().int().min(2).max(12),
})

const SuggestionsSchema = z.object({
  intro: z.string(),
  suggestions: z.array(SuggestionItemSchema).min(2).max(4),
})

async function getSuggestions(
  questions: string,
  answers: string,
): Promise<z.infer<typeof SuggestionsSchema>> {
  const model = getModel()
  const prompt = `You are a creative personal coach. A user answered 5 lifestyle questions. Based on their EXACT combination of answers, suggest 3 activities that will genuinely excite them.

User's profile (question → answer):
${questions}

STRICT RULES — violating any rule = bad response:
1. All 3 suggestions MUST be from completely different life domains (e.g. sport, creative art, social, wellness, craft — never two from the same domain)
2. NEVER suggest: chess, programming, coding, HTML, CSS, JavaScript, or any IT-related activity UNLESS the user explicitly said they want IT
3. Each suggestion must directly reflect the user's specific answers — explain the connection
4. Vary the goalType across suggestions (don't use the same goalType twice)
5. Be creative and specific — not "занятие спортом" but "бокс для начинающих" or "утренний бег в парке"
6. If user answered "Удиви меня! ✨" for the last question, give at least one truly unexpected suggestion they wouldn't think of themselves

Return ONLY this JSON (no markdown, no extra text):
{
  "intro": "1 warm sentence in Russian that shows you understood their profile (mention 1-2 specific things from their answers)",
  "suggestions": [
    {
      "emoji": "single relevant emoji",
      "title": "specific activity name in Russian (3-6 words)",
      "description": "why this fits THEIR specific answers, 1-2 sentences in Russian",
      "goalType": "fitness" | "habit" | "meeting" | "self-improvement",
      "durationWeeks": <4-12>
    }
  ]
}

Generate exactly 3 suggestions in the array.`

  const result = await model.generateContent(prompt)
  const raw = stripFences(result.response.text())
  return SuggestionsSchema.parse(JSON.parse(raw))
}

function stripFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
}

// ── Route handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const { phase } = body

    if (phase === 'suggest') {
      const { questions, answers } = body
      if (!answers) return NextResponse.json({ error: 'answers required' }, { status: 400 })
      const data = await getSuggestions(questions ?? '', answers)
      // Attach stable IDs
      const withIds = {
        ...data,
        suggestions: data.suggestions.map((s) => ({ ...s, id: crypto.randomUUID() })),
      }
      return NextResponse.json(withIds)
    }

    return NextResponse.json({ error: 'unknown phase' }, { status: 400 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: 'api_error', message }, { status: 502 })
  }
}
