'use client'

import { motion } from 'motion/react'
import { Trash2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAiCoachStore, getCompletedCount, getTotalCount } from '@/store/aiCoachStore'
import type { CoachPlan, GoalType } from '@/types/aiCoach'

const GOAL_EMOJI: Record<GoalType, string> = {
  fitness: '🏋️',
  habit: '🧠',
  meeting: '📅',
  'self-improvement': '✨',
}

function formatCreatedAt(ts: number) {
  return new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface PlanSummaryCardProps {
  plan: CoachPlan
  isActive: boolean
  onOpen: () => void
}

export function PlanSummaryCard({ plan, isActive, onOpen }: PlanSummaryCardProps) {
  const { deletePlan } = useAiCoachStore()

  const completed = getCompletedCount(plan)
  const total = getTotalCount(plan)
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0
  const isDone = completed === total && total > 0

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deletePlan(plan.id)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'rounded-2xl border p-4 space-y-3',
        isActive
          ? 'border-amber-400/30 bg-amber-400/5'
          : isDone
          ? 'border-emerald-500/25 bg-emerald-500/5'
          : 'border-tcell-surface2 bg-tcell-surface',
      )}
    >
      {/* Status badge */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-[11px] font-semibold px-2 py-0.5 rounded-full',
            isActive
              ? 'bg-amber-400/15 text-amber-400'
              : isDone
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-tcell-accent/15 text-tcell-accent-light',
          )}
        >
          {isActive ? 'Активный' : isDone ? 'Завершён' : 'В процессе'}
        </span>
        <span className="text-[11px] text-tcell-muted">{formatCreatedAt(plan.createdAt)}</span>
      </div>

      {/* Goal */}
      <div className="flex items-start gap-3">
        <span className="text-xl">{GOAL_EMOJI[plan.goalType]}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-tcell-fg leading-snug">{plan.goalText}</p>
          <p className="text-xs text-tcell-muted mt-0.5">{plan.summary}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 text-xs text-tcell-muted">
        <span>{plan.durationWeeks} нед.</span>
        <span>·</span>
        <span>{completed}/{total} задач</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className={cn(
            'h-full rounded-full',
            isDone
              ? 'bg-emerald-500'
              : isActive
              ? 'bg-linear-to-r from-amber-400 to-amber-300'
              : 'bg-linear-to-r from-tcell-accent to-tcell-accent-light',
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <motion.button
          onClick={onOpen}
          whileTap={{ scale: 0.97 }}
          className="flex-1 flex items-center justify-center gap-2 bg-tcell-accent/15 hover:bg-tcell-accent/25 text-tcell-accent-light rounded-xl py-2 text-xs font-semibold transition-colors"
        >
          Открыть
          <ArrowRight size={13} />
        </motion.button>
        <motion.button
          onClick={handleDelete}
          whileTap={{ scale: 0.9 }}
          className="w-9 h-9 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
        >
          <Trash2 size={14} />
        </motion.button>
      </div>
    </motion.div>
  )
}
