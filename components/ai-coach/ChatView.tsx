'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Send, Bot, Sparkles, PenLine, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAiCoachStore } from '@/store/aiCoachStore'
import { useTPassStore } from '@/store/tpassStore'
import { VoiceInputButton } from './VoiceInputButton'
import { DiscoveryWizard } from './DiscoveryWizard'
import type { CoachPlan, GeminiScheduleResponse, ScheduledTask, WeekGroup } from '@/types/aiCoach'

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildPlanFromResponse(
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

function countTasks(plan: CoachPlan) {
  return plan.weeks.reduce((acc, w) => acc + w.tasks.length, 0)
}

// ── Component ────────────────────────────────────────────────────────────────

const EXAMPLE_GOALS = [
  'Хочу похудеть за 3 месяца',
  'Звонить маме каждый день',
  'Учить английский по 20 минут',
]

export function ChatView() {
  const {
    messages,
    isLoading,
    selectedGoalType,
    savedPlans,
    activePlan,
    onboarded,
    addMessage,
    setLoading,
    setError,
    setActivePlan,
    setActiveTab,
    markTaskCompleted,
    clearConversation,
    setGoalType,
    setOnboarded,
  } = useAiCoachStore()
  const { addXp } = useTPassStore()

  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isDiscovery = selectedGoalType === 'discovery'

  const todayTasks = useMemo(() => {
    const ymd = new Date().toISOString().split('T')[0]
    const result: { planId: string; task: ScheduledTask }[] = []
    for (const plan of savedPlans) {
      for (const week of plan.weeks) {
        for (const task of week.tasks) {
          if (task.date === ymd) result.push({ planId: plan.id, task })
        }
      }
    }
    return result.sort((a, b) => a.task.time.localeCompare(b.task.time))
  }, [savedPlans])

  // Welcome message for normal mode
  useEffect(() => {
    if (!isDiscovery && messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: 'Привет! 👋 Я твой AI-планировщик. Расскажи о своей цели — голосом или текстом.\n\nНапример: «Хочу похудеть за 3 месяца» или «Хочу каждый день звонить маме».',
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDiscovery])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    setInput('')
    setError(null)
    addMessage({ role: 'user', content: trimmed })
    setLoading(true)

    setOnboarded()

    try {
      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalText: trimmed,
          goalType: selectedGoalType,
          currentDate: new Date().toISOString().split('T')[0],
          activePlanContext: activePlan
            ? `User has an active plan: "${activePlan.goalText}" (${activePlan.durationWeeks} weeks, ${activePlan.goalType})`
            : null,
        }),
      })
      if (!res.ok) throw new Error('Ошибка сервера. Попробуй ещё раз.')
      const data = await res.json()
      const plan = buildPlanFromResponse(trimmed, selectedGoalType as CoachPlan['goalType'], data.plan)

      setActivePlan(plan)
      addMessage({
        role: 'assistant',
        content: `✅ Готово! Я составил план: ${plan.summary}\n\n${plan.durationWeeks} ${weeksLabel(plan.durationWeeks)} · ${countTasks(plan)} задач.\n\nПереключись на вкладку «Мой план» 👇`,
      })
      setActiveTab('goals')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Что-то пошло не так'
      setError(msg)
      addMessage({ role: 'assistant', content: `❌ ${msg}` })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  // ── Today widget ──────────────────────────────────────────────────────────
  const TodayWidget = () => {
    if (todayTasks.length === 0) return null
    const done = todayTasks.filter(({ task }) => task.completed).length
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mt-3 mb-1 rounded-2xl border border-tcell-surface2 bg-tcell-surface overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-2.5">
          <p className="text-xs font-semibold text-tcell-fg">Сегодня</p>
          <span className="text-[11px] text-tcell-muted">{done}/{todayTasks.length} выполнено</span>
        </div>
        <div className="h-px bg-tcell-surface2" />
        <div className="divide-y divide-tcell-surface2">
          {todayTasks.slice(0, 4).map(({ planId, task }) => (
            <button
              key={task.id}
              onClick={() => {
                if (!task.completed) {
                  markTaskCompleted(planId, task.id)
                  addXp(15, task.title)
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
            >
              {task.completed
                ? <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                : <Circle size={15} className="text-tcell-muted/50 shrink-0" />
              }
              <span className={cn('flex-1 text-xs leading-snug truncate', task.completed ? 'line-through text-tcell-muted' : 'text-tcell-fg')}>
                {task.title}
              </span>
              <span className="text-[11px] text-tcell-muted tabular-nums shrink-0">{task.time}</span>
            </button>
          ))}
          {todayTasks.length > 4 && (
            <p className="px-4 py-2 text-[11px] text-tcell-muted text-center">
              + ещё {todayTasks.length - 4}
            </p>
          )}
        </div>
      </motion.div>
    )
  }

  // ── Mode selector ─────────────────────────────────────────────────────────
  const ModePicker = () => (
    <div className="px-4 pt-3 pb-2 flex gap-3">
      <motion.button
        onClick={() => {
          if (!isDiscovery) { clearConversation(); setGoalType('discovery') }
        }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'relative flex-1 overflow-hidden flex flex-col items-start gap-1.5 rounded-2xl border px-4 py-3 text-left transition-colors',
          isDiscovery
            ? 'border-amber-400/50 bg-amber-400/8'
            : 'border-tcell-surface2 bg-tcell-surface',
        )}
      >
        {isDiscovery && (
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-amber-400/10 to-transparent -skew-x-12"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
          />
        )}
        <span className="relative flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
          <Sparkles size={12} />
          Помоги найти
        </span>
        <p className="relative text-[11px] text-tcell-muted leading-snug">AI задаст вопросы и подберёт цель</p>
      </motion.button>

      <motion.button
        onClick={() => {
          if (isDiscovery) { clearConversation(); setGoalType('fitness') }
        }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'flex-1 flex flex-col items-start gap-1.5 rounded-2xl border px-4 py-3 text-left transition-colors',
          !isDiscovery
            ? 'border-tcell-accent/50 bg-tcell-accent/8'
            : 'border-tcell-surface2 bg-tcell-surface',
        )}
      >
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-tcell-accent-light">
          <PenLine size={12} />
          Своя цель
        </span>
        <p className="text-[11px] text-tcell-muted leading-snug">Опиши цель голосом или текстом</p>
      </motion.button>
    </div>
  )

  // ── Onboarding (first time, no messages, normal mode) ────────────────────
  if (!onboarded && messages.length === 0 && !isDiscovery) {
    return (
      <div className="flex flex-col px-4 pt-5 pb-4 gap-5">
        <div>
          <p className="text-base font-bold text-tcell-fg">Твой AI-планировщик</p>
          <p className="text-sm text-tcell-muted mt-1 leading-relaxed">
            Опиши любую цель — получишь готовое расписание на недели вперёд с напоминаниями.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-tcell-muted font-medium">Попробуй, например:</p>
          {EXAMPLE_GOALS.map((goal) => (
            <motion.button
              key={goal}
              whileTap={{ scale: 0.98 }}
              onClick={() => send(goal)}
              className="w-full text-left px-4 py-3 rounded-2xl border border-tcell-surface2 bg-tcell-surface text-sm text-tcell-fg hover:border-tcell-accent/40 transition-colors"
            >
              {goal}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setOnboarded()}
          className="text-xs text-tcell-muted underline underline-offset-2 text-center"
        >
          Написать свою цель →
        </motion.button>
      </div>
    )
  }

  // ── Discovery mode → show wizard ─────────────────────────────────────────
  if (isDiscovery) {
    return (
      <div className="flex flex-col" style={{ minHeight: 'calc(100dvh - 220px)' }}>
        <TodayWidget />
        <ModePicker />
        <DiscoveryWizard />
      </div>
    )
  }

  // ── Normal chat mode ──────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      <TodayWidget />
      <ModePicker />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-tcell-accent/20 border border-tcell-accent/30 shrink-0 mt-0.5">
                  <Bot size={15} className="text-tcell-accent-light" />
                </div>
              )}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-tcell-accent/80 text-white rounded-tr-sm'
                    : 'bg-tcell-surface text-tcell-fg rounded-tl-sm'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* Loading dots */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-tcell-accent/20 border border-tcell-accent/30 shrink-0">
                <Bot size={15} className="text-tcell-accent-light" />
              </div>
              <div className="bg-tcell-surface rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                {[0, 0.15, 0.3].map((delay, i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-tcell-accent/60"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 pb-4 pt-2 flex items-end gap-2">
        <VoiceInputButton
          disabled={isLoading}
          onTranscript={(text) => setInput((prev) => prev ? `${prev} ${text}` : text)}
        />
        <div className="flex-1 flex items-end gap-2 bg-tcell-surface border border-tcell-surface2 rounded-2xl px-3 py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введи свою цель…"
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-tcell-fg placeholder:text-tcell-muted resize-none outline-none max-h-24 leading-5"
            style={{ height: 'auto' }}
            onInput={(e) => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = `${el.scrollHeight}px`
            }}
          />
        </div>
        <motion.button
          onClick={() => send(input)}
          disabled={!input.trim() || isLoading}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-tcell-accent disabled:opacity-40 shrink-0"
        >
          <Send size={17} className="text-white" />
        </motion.button>
      </div>
    </div>
  )
}
