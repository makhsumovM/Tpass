'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Bot, Flame, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAiCoachStore } from '@/store/aiCoachStore'
import { PlanSummaryCard } from './PlanSummaryCard'
import { PlanView } from './PlanView'
import type { CoachPlan, GoalType } from '@/types/aiCoach'

const FILTERS: { id: GoalType | 'all'; label: string; emoji: string }[] = [
  { id: 'all',             label: 'Все',      emoji: '📋' },
  { id: 'fitness',         label: 'Фитнес',   emoji: '🏋️' },
  { id: 'habit',           label: 'Привычки', emoji: '🧠' },
  { id: 'meeting',         label: 'Встречи',  emoji: '📅' },
  { id: 'self-improvement',label: 'Развитие', emoji: '✨' },
]

function computeStreak(savedPlans: CoachPlan[]): number {
  const dates = new Set<string>()
  for (const plan of savedPlans)
    for (const week of plan.weeks)
      for (const task of week.tasks)
        if (task.completed) dates.add(task.date)

  let streak = 0
  const d = new Date()
  while (true) {
    const ymd = d.toISOString().split('T')[0]
    if (dates.has(ymd)) { streak++; d.setDate(d.getDate() - 1) }
    else break
  }
  return streak
}

const DAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

export function GoalsView() {
  const { savedPlans, activePlan, clearConversation, setActiveTab, setGoalType, setActivePlan } = useAiCoachStore()
  const [activeFilter, setActiveFilter] = useState<GoalType | 'all'>('all')
  const [viewingPlan, setViewingPlan] = useState<CoachPlan | null>(null)

  const streak = useMemo(() => computeStreak(savedPlans), [savedPlans])

  const weekStats = useMemo(() => {
    const today = new Date()
    const dow = today.getDay() === 0 ? 6 : today.getDay() - 1
    const monday = new Date(today)
    monday.setDate(today.getDate() - dow)
    const weekDays: string[] = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return d.toISOString().split('T')[0]
    })
    let total = 0, done = 0
    const dayDone: Record<string, number> = {}
    for (const plan of savedPlans)
      for (const week of plan.weeks)
        for (const task of week.tasks)
          if (weekDays.includes(task.date)) {
            total++
            if (task.completed) { done++; dayDone[task.date] = (dayDone[task.date] ?? 0) + 1 }
          }
    const best = Object.entries(dayDone).sort((a, b) => b[1] - a[1])[0]
    const bestDay = best ? DAY_NAMES[new Date(best[0]).getDay()] : null
    return { total, done, bestDay }
  }, [savedPlans])

  const handleNewGoal = () => {
    clearConversation()
    setGoalType('fitness')
    setActiveTab('chat')
  }

  const handleOpenPlan = (plan: CoachPlan) => {
    setActivePlan(plan)
    setViewingPlan(plan)
  }

  // ── Plan detail view ───────────────────────────────────────────────────────
  if (viewingPlan) {
    return (
      <div className="flex flex-col">
        {/* Back header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-tcell-surface2">
          <motion.button
            onClick={() => setViewingPlan(null)}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 text-sm text-tcell-muted"
          >
            <ArrowLeft size={16} />
            Мои цели
          </motion.button>
        </div>
        <PlanView />
      </div>
    )
  }

  const filtered = activeFilter === 'all'
    ? savedPlans
    : savedPlans.filter((p) => p.goalType === activeFilter)

  if (savedPlans.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center gap-4 px-6 py-16"
      >
        <div className="w-16 h-16 rounded-full bg-tcell-surface flex items-center justify-center">
          <Bot size={28} className="text-tcell-muted" />
        </div>
        <div>
          <p className="text-base font-semibold text-tcell-fg mb-1">Целей пока нет</p>
          <p className="text-sm text-tcell-muted">AI поможет составить первый план!</p>
        </div>
        <motion.button
          onClick={handleNewGoal}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-tcell-accent/80 text-white px-5 py-2.5 rounded-full text-sm font-semibold"
        >
          <Plus size={15} />
          Создать цель
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="pb-6 space-y-3">
      {/* Streak + weekly stats row */}
      {(streak > 0 || weekStats.total > 0) && (
        <div className="px-4 flex gap-3">
          {streak > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-2.5 flex-1"
            >
              <Flame size={16} className="text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-400">{streak} {streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'} подряд</p>
                <p className="text-[10px] text-tcell-muted">Не останавливайся!</p>
              </div>
            </motion.div>
          )}
          {weekStats.total > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 }}
              className="flex items-center gap-2 bg-tcell-surface border border-tcell-surface2 rounded-2xl px-4 py-2.5 flex-1"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-tcell-accent/15 shrink-0">
                <span className="text-xs font-bold text-tcell-accent-light">{weekStats.done}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-tcell-fg">из {weekStats.total} за неделю</p>
                {weekStats.bestDay && (
                  <p className="text-[10px] text-tcell-muted truncate">Лучший день — {weekStats.bestDay}</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Filter chips */}
      <div className="px-4 flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
        {FILTERS.map(({ id, label, emoji }) => {
          const active = activeFilter === id
          const count = id === 'all' ? savedPlans.length : savedPlans.filter((p) => p.goalType === id).length
          if (count === 0 && id !== 'all') return null
          return (
            <motion.button
              key={id}
              onClick={() => setActiveFilter(id)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                active
                  ? 'bg-tcell-accent/20 border-tcell-accent/50 text-tcell-accent-light'
                  : 'bg-tcell-surface border-tcell-surface2 text-tcell-muted',
              )}
            >
              <span>{emoji}</span>
              {label}
              <span className={cn(
                'ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                active ? 'bg-tcell-accent/30 text-tcell-accent-light' : 'bg-white/8 text-tcell-muted',
              )}>
                {count}
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="px-4 space-y-3">
        {/* New goal button */}
        <motion.button
          onClick={handleNewGoal}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-tcell-accent/30 text-tcell-accent-light rounded-2xl py-3 text-sm font-semibold"
        >
          <Plus size={15} />
          Новая цель
        </motion.button>

        {/* Plans list */}
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.p
              key="empty-filter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-tcell-muted py-8"
            >
              Нет целей в этой категории
            </motion.p>
          ) : (
            filtered.map((plan) => (
              <PlanSummaryCard
                key={plan.id}
                plan={plan}
                isActive={activePlan?.id === plan.id}
                onOpen={() => handleOpenPlan(plan)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
