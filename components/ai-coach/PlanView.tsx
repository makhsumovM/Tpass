'use client'

import { motion } from 'motion/react'
import { Target, Plus } from 'lucide-react'
import { useAiCoachStore, getCompletedCount, getTotalCount } from '@/store/aiCoachStore'
import { PlanTaskCard } from './PlanTaskCard'
import type { GoalType } from '@/types/aiCoach'

const GOAL_EMOJI: Record<GoalType, string> = {
  fitness: '🏋️',
  habit: '🧠',
  meeting: '📅',
  'self-improvement': '✨',
}

export function PlanView() {
  const { activePlan, setActiveTab, clearConversation } = useAiCoachStore()

  if (!activePlan) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-tcell-surface flex items-center justify-center">
          <Target size={28} className="text-tcell-muted" />
        </div>
        <div>
          <p className="text-base font-semibold text-tcell-fg mb-1">Нет активного плана</p>
          <p className="text-sm text-tcell-muted">Перейди в чат и расскажи о своей цели</p>
        </div>
        <motion.button
          onClick={() => setActiveTab('chat')}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-tcell-accent/80 text-white px-5 py-2.5 rounded-full text-sm font-semibold"
        >
          <Plus size={15} />
          Создать план
        </motion.button>
      </div>
    )
  }

  const completed = getCompletedCount(activePlan)
  const total = getTotalCount(activePlan)
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="px-4 pb-6 space-y-4">
      {/* Plan header */}
      <div className="rounded-2xl border border-tcell-surface2 bg-tcell-surface p-4 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{GOAL_EMOJI[activePlan.goalType]}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-tcell-fg leading-snug">{activePlan.goalText}</p>
            <p className="text-xs text-tcell-muted mt-0.5">{activePlan.summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-tcell-muted">
          <span>{activePlan.durationWeeks} нед.</span>
          <span className="text-tcell-surface2">·</span>
          <span>{total} задач</span>
          <span className="text-tcell-surface2">·</span>
          <span className="text-emerald-400">{completed} выполнено</span>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-tcell-muted mb-1">
            <span>Прогресс</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-tcell-accent to-tcell-accent-light"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* New plan button */}
        <button
          onClick={() => { clearConversation(); setActiveTab('chat') }}
          className="text-xs text-tcell-muted underline underline-offset-2"
        >
          + Новая цель
        </button>
      </div>

      {/* Weeks */}
      {activePlan.weeks.map((week) => (
        <div key={week.weekLabel} className="space-y-2">
          <p className="text-xs font-bold text-tcell-muted uppercase tracking-wider px-1">
            {week.weekLabel}
          </p>
          {week.tasks.map((task) => (
            <PlanTaskCard key={task.id} planId={activePlan.id} task={task} />
          ))}
        </div>
      ))}
    </div>
  )
}
