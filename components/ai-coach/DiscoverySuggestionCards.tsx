'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import type { DiscoverySuggestion, GoalType } from '@/types/aiCoach'

const GOAL_COLORS: Record<GoalType, { bg: string; border: string; badge: string }> = {
  fitness:          { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-400' },
  habit:            { bg: 'bg-tcell-accent/10', border: 'border-tcell-accent/30', badge: 'bg-tcell-accent/20 text-tcell-accent-light' },
  meeting:          { bg: 'bg-amber-400/10', border: 'border-amber-400/30', badge: 'bg-amber-400/20 text-amber-400' },
  'self-improvement': { bg: 'bg-sky-500/10', border: 'border-sky-500/30', badge: 'bg-sky-500/20 text-sky-400' },
}

const GOAL_LABELS: Record<GoalType, string> = {
  fitness: 'Физическое',
  habit: 'Привычка',
  meeting: 'Встречи',
  'self-improvement': 'Развитие',
}

const WEEKS_LABEL = (n: number) => `${n} ${n === 1 ? 'неделя' : n <= 4 ? 'недели' : 'недель'}`

interface DiscoverySuggestionCardsProps {
  suggestions: DiscoverySuggestion[]
  onSelect: (suggestion: DiscoverySuggestion) => void
}

export function DiscoverySuggestionCards({ suggestions, onSelect }: DiscoverySuggestionCardsProps) {
  return (
    <div className="space-y-2 w-full">
      {suggestions.map((s, i) => {
        const colors = GOAL_COLORS[s.goalType]
        return (
          <motion.button
            key={s.id}
            onClick={() => onSelect(s)}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 400, damping: 30 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-left rounded-2xl border p-4 flex items-start gap-3 transition-colors hover:brightness-110 ${colors.bg} ${colors.border}`}
          >
            {/* Emoji */}
            <span className="text-2xl shrink-0 mt-0.5">{s.emoji}</span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-bold text-tcell-fg">{s.title}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                  {GOAL_LABELS[s.goalType]}
                </span>
                <span className="text-[10px] text-tcell-muted">{WEEKS_LABEL(s.durationWeeks)}</span>
              </div>
              <p className="text-xs text-tcell-muted leading-relaxed">{s.description}</p>
            </div>

            {/* Arrow */}
            <ArrowRight size={16} className="text-tcell-muted shrink-0 mt-1" />
          </motion.button>
        )
      })}
    </div>
  )
}
