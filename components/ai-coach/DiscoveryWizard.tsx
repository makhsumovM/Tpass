'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useAiCoachStore } from '@/store/aiCoachStore'
import { VoiceInputButton } from './VoiceInputButton'
import { DiscoverySuggestionCards } from './DiscoverySuggestionCards'
import type { CoachPlan, DiscoveryQuestion, DiscoverySuggestion, GeminiScheduleResponse, ScheduledTask, WeekGroup } from '@/types/aiCoach'

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildPlan(
  goalText: string,
  goalType: CoachPlan['goalType'],
  resp: GeminiScheduleResponse,
): CoachPlan {
  return {
    id: crypto.randomUUID(),
    goalText,
    goalType,
    createdAt: Date.now(),
    durationWeeks: resp.durationWeeks,
    summary: resp.summary,
    weeks: resp.weeks.map((w): WeekGroup => ({
      weekLabel: w.weekLabel,
      tasks: w.tasks.map((t): ScheduledTask => ({
        id: crypto.randomUUID(),
        title: t.title,
        description: t.description,
        date: t.date,
        time: t.time,
        durationMinutes: t.durationMinutes,
        notificationEnabled: false,
        completed: false,
      })),
    })),
  }
}

function weeksLabel(n: number) {
  if (n === 1) return 'неделя'
  if (n >= 2 && n <= 4) return 'недели'
  return 'недель'
}

// ── Screens ───────────────────────────────────────────────────────────────────

function LoadingScreen({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6 py-16">
      <div className="flex gap-1.5">
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-tcell-accent/60"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay }}
          />
        ))}
      </div>
      <p className="text-sm text-tcell-muted text-center">{label}</p>
    </div>
  )
}

function PlanCreatingScreen({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="flex flex-col flex-1 px-4 py-5 gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-tcell-surface border border-tcell-surface2 flex items-center justify-center text-2xl shrink-0">
          {emoji}
        </div>
        <div>
          <p className="text-sm font-semibold text-tcell-fg leading-snug">{title}</p>
          <div className="flex items-center gap-1 mt-1">
            {[0, 0.15, 0.3].map((delay, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-tcell-accent/60"
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay }}
              />
            ))}
            <span className="text-xs text-tcell-muted ml-1.5">Составляю план…</span>
          </div>
        </div>
      </div>

      {/* Week label skeleton */}
      <div className="h-3.5 w-32 rounded-md bg-tcell-surface animate-pulse" />

      {/* Task card skeletons */}
      {[1, 0.85, 0.7].map((w, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}
          className="rounded-2xl border border-tcell-surface2 bg-tcell-surface p-4 space-y-2.5"
        >
          <div className="flex items-center gap-2">
            <div className="h-5 w-14 rounded-full bg-tcell-accent/15 animate-pulse" />
            <div className="h-4 w-10 rounded bg-white/5 animate-pulse" />
          </div>
          <div className="h-4 rounded-md bg-white/8 animate-pulse" style={{ width: `${w * 100}%` }} />
          <div className="h-3 w-2/3 rounded-md bg-white/5 animate-pulse" />
        </motion.div>
      ))}
    </div>
  )
}

// ── Hardcoded rich questions ──────────────────────────────────────────────────

const DISCOVERY_QUESTIONS: DiscoveryQuestion[] = [
  {
    text: 'Как тебе нравится проводить свободное время?',
    options: ['В движении 🏃', 'Создавать что-то 🎨', 'Узнавать новое 📚', 'Соревноваться 🎮', 'Общаться 👥'],
  },
  {
    text: 'Сколько времени готов уделять?',
    options: ['15–20 мин/день', '30–45 мин/день', '1–2 часа/день', 'По выходным'],
  },
  {
    text: 'Чего хочешь добиться?',
    options: ['Улучшить форму 💪', 'Снять стресс 🧘', 'Освоить навык 🛠', 'Найти друзей 👥', 'Развить творчество 🎨', 'Стать продуктивнее 🧠'],
  },
  {
    text: 'Где тебе комфортнее?',
    options: ['Дома 🏠', 'На улице 🌳', 'В зале 🏋️', 'Везде ок'],
  },
  {
    text: 'Что хотел попробовать, но не решался?',
    options: ['Музыка 🎵', 'Единоборства ⚔️', 'Рисование 🎨', 'Готовка 🍳', 'Танцы/йога 💃', 'Удиви меня! ✨'],
  },
]

// ── Main component ────────────────────────────────────────────────────────────

export function DiscoveryWizard() {
  const {
    discoveryPhase,
    discoveryQuestions,
    discoveryCurrentIndex,
    discoveryAnswersArray,
    discoveryAnswers,
    isLoading,
    setLoading,
    setDiscoveryPhase,
    setDiscoveryQuestions,
    advanceDiscovery,
    setActivePlan,
    setActiveTab,
    setGoalType,
    addMessage,
    resetDiscovery,
  } = useAiCoachStore()

  const [answer, setAnswer] = useState('')
  const [suggestions, setSuggestions] = useState<DiscoverySuggestion[]>([])
  const [suggestionIntro, setSuggestionIntro] = useState('')
  const [direction, setDirection] = useState<1 | -1>(1)
  const [planLoading, setPlanLoading] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<DiscoverySuggestion | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fetchingRef = useRef(false)

  // Focus input when question changes
  useEffect(() => {
    setAnswer('')
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [discoveryCurrentIndex])

  // When phase becomes 'suggesting', fetch suggestions (guard prevents double-fire in StrictMode)
  useEffect(() => {
    if (discoveryPhase === 'suggesting' && suggestions.length === 0 && !fetchingRef.current) {
      fetchSuggestions()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discoveryPhase])

  // ── Load questions on mount (use hardcoded, no API call needed) ───────────
  useEffect(() => {
    if (discoveryPhase === 'idle' && discoveryQuestions.length === 0) {
      setDiscoveryQuestions(DISCOVERY_QUESTIONS)
      setDiscoveryPhase('questioning')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadQuestions = () => {
    setDiscoveryQuestions(DISCOVERY_QUESTIONS)
    setDiscoveryPhase('questioning')
  }

  const fetchSuggestions = async () => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)
    try {
      const questionsText = discoveryAnswersArray
        .map((a, i) => `${i + 1}. ${a.question}: ${a.answer}`)
        .join('\n')
      const res = await fetch('/api/ai-discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: 'suggest',
          questions: questionsText,
          answers: discoveryAnswers,
        }),
      })
      if (!res.ok) throw new Error(`Ошибка сервера ${res.status}`)
      const data = await res.json()
      setSuggestionIntro(data.intro ?? 'Вот что подходит тебе:')
      setSuggestions(data.suggestions ?? [])
    } catch {
      setSuggestionIntro('Вот что я могу тебе предложить:')
      setSuggestions([])
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  const handleNext = () => {
    const trimmed = answer.trim()
    if (!trimmed) return
    setDirection(1)
    advanceDiscovery(trimmed)
  }

  const handleBack = () => {
    if (discoveryCurrentIndex === 0) return
    setDirection(-1)
    // Go back: remove last answer and decrease index
    useAiCoachStore.setState((s) => ({
      discoveryCurrentIndex: s.discoveryCurrentIndex - 1,
      discoveryAnswersArray: s.discoveryAnswersArray.slice(0, -1),
      discoveryPhase: 'questioning',
    }))
  }

  const handleSelectSuggestion = async (suggestion: DiscoverySuggestion) => {
    // Set local state only — do NOT call setGoalType yet,
    // otherwise selectedGoalType changes from 'discovery' → X,
    // ChatView unmounts DiscoveryWizard and PlanCreatingScreen never shows.
    setSelectedSuggestion(suggestion)
    setPlanLoading(true)

    try {
      const goalText = `${suggestion.title}: ${suggestion.description}`
      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalText,
          goalType: suggestion.goalType,
          currentDate: new Date().toISOString().split('T')[0],
        }),
      })
      if (!res.ok) throw new Error('Ошибка сервера')
      const data = await res.json()
      const plan = buildPlan(goalText, suggestion.goalType, data.plan as GeminiScheduleResponse)

      // Only now update store & navigate — component will unmount right after
      setGoalType(suggestion.goalType)
      setActivePlan(plan)
      addMessage({
        role: 'assistant',
        content: `✅ Отлично! Твой план «${suggestion.title}» готов.\n\n${plan.durationWeeks} ${weeksLabel(plan.durationWeeks)} · ${plan.weeks.reduce((a, w) => a + w.tasks.length, 0)} задач.`,
      })
      setActiveTab('goals')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ошибка'
      addMessage({ role: 'assistant', content: `❌ ${msg}` })
      setDiscoveryPhase('suggesting')
      setSelectedSuggestion(null)
      setPlanLoading(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const total = (discoveryQuestions ?? []).length
  const current = Math.min(discoveryCurrentIndex, total - 1)
  const questionObj = discoveryQuestions[current]
  const questionText = questionObj?.text ?? ''
  const questionOptions = questionObj?.options ?? []

  // Plan being created — beautiful screen with selected suggestion
  if (planLoading && selectedSuggestion) {
    return <PlanCreatingScreen emoji={selectedSuggestion.emoji} title={selectedSuggestion.title} />
  }

  // Loading suggestions
  if (discoveryPhase === 'suggesting' && isLoading) {
    return <LoadingScreen label="Подбираю варианты под твои ответы…" />
  }

  // Fallback loading
  if (isLoading && discoveryPhase === 'idle') {
    return <LoadingScreen label="Загрузка…" />
  }

  // Suggestion cards
  if (discoveryPhase === 'suggesting' && suggestions.length > 0) {
    return (
      <div className="flex flex-col flex-1 px-4 pb-6 gap-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-0.5"
        >
          <p className="text-xs font-semibold text-tcell-muted uppercase tracking-wider">Подобрано для тебя</p>
          <p className="text-sm text-tcell-fg leading-snug">{suggestionIntro}</p>
        </motion.div>

        <DiscoverySuggestionCards
          suggestions={suggestions}
          onSelect={handleSelectSuggestion}
        />

        <button
          onClick={() => { resetDiscovery(); loadQuestions() }}
          className="text-xs text-tcell-muted underline underline-offset-2 text-center mt-2"
        >
          Пройти заново
        </button>
      </div>
    )
  }

  // Stepper (questioning phase)
  if (discoveryPhase !== 'questioning' || total === 0) {
    return <LoadingScreen label="Загрузка…" />
  }

  const progress = total > 0 ? ((current) / total) * 100 : 0

  return (
    <div className="flex flex-col flex-1 px-4 pb-6">
      {/* Progress bar + step label */}
      <div className="pt-2 pb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-tcell-muted">Вопрос {current + 1} из {total}</span>
          <span className="text-xs text-tcell-muted">{Math.round(progress)}%</span>
        </div>
        {/* Bar */}
        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-tcell-accent to-amber-400"
            animate={{ width: `${((current + 1) / total) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {(discoveryQuestions ?? []).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === current ? 20 : 6,
                backgroundColor: i < current ? 'rgba(169,143,224,0.7)' : i === current ? 'rgba(169,143,224,1)' : 'rgba(255,255,255,0.15)',
              }}
              className="h-1.5 rounded-full"
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 40 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -40 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="text-center space-y-2"
          >
            <p className="text-xl font-bold text-tcell-fg leading-snug">{questionText}</p>
            {discoveryAnswersArray[current] && (
              <p className="text-xs text-tcell-muted">
                Выбрано: <span className="text-tcell-fg">{discoveryAnswersArray[current].answer}</span>
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Answer section */}
      <div className="mt-4 space-y-2">
        {/* Vertical option list */}
        {questionOptions.map((opt) => {
          const selected = answer === opt
          return (
            <motion.button
              key={opt}
              onClick={() => {
                setAnswer(opt)
                setTimeout(() => {
                  useAiCoachStore.getState().advanceDiscovery(opt)
                  setAnswer('')
                }, 200)
              }}
              whileTap={{ scale: 0.985 }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-colors text-left ${
                selected
                  ? 'bg-tcell-accent/12 border-tcell-accent/40 text-tcell-fg'
                  : 'bg-tcell-surface border-tcell-surface2 text-tcell-fg'
              }`}
            >
              <span>{opt}</span>
              <AnimatePresence>
                {selected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="w-5 h-5 rounded-full bg-tcell-accent flex items-center justify-center shrink-0"
                  >
                    <Check size={11} className="text-white" strokeWidth={2.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-tcell-surface2" />
          <span className="text-[11px] text-tcell-fg3">или напиши сам</span>
          <div className="flex-1 h-px bg-tcell-surface2" />
        </div>

        {/* Text input */}
        <div className="flex items-end gap-2 bg-tcell-surface border border-tcell-surface2 rounded-xl px-3 py-2">
          <VoiceInputButton
            disabled={false}
            onTranscript={(t) => setAnswer((p) => p ? `${p} ${t}` : t)}
          />
          <textarea
            ref={inputRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleNext() }
            }}
            placeholder="Свой вариант…"
            rows={1}
            className="flex-1 bg-transparent text-sm text-tcell-fg placeholder:text-tcell-muted resize-none outline-none max-h-20 leading-5 py-1"
            style={{ height: 'auto' }}
            onInput={(e) => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = `${el.scrollHeight}px`
            }}
          />
          {answer.trim() && (
            <motion.button
              onClick={handleNext}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 rounded-full bg-tcell-accent flex items-center justify-center shrink-0"
            >
              <ArrowRight size={13} className="text-white" />
            </motion.button>
          )}
        </div>

        {/* Back button */}
        {current > 0 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs text-tcell-muted py-1"
          >
            <ArrowLeft size={13} />
            Назад
          </button>
        )}
      </div>
    </div>
  )
}
