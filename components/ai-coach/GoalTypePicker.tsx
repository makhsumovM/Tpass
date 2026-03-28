'use client'

import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAiCoachStore } from '@/store/aiCoachStore'
import type { GoalType } from '@/types/aiCoach'

const GOAL_TYPES: { id: GoalType | 'discovery'; label: string; emoji?: string; special?: boolean }[] = [
  { id: 'discovery',        label: 'Помоги найти',  special: true },
  { id: 'fitness',          label: 'Фитнес',   emoji: '🏋️' },
  { id: 'habit',            label: 'Привычки', emoji: '🧠' },
  { id: 'meeting',          label: 'Встречи',  emoji: '📅' },
  { id: 'self-improvement', label: 'Развитие', emoji: '✨' },
]

export function GoalTypePicker() {
  const { selectedGoalType, setGoalType, clearConversation, discoveryPhase } = useAiCoachStore()

  const handleSelect = (id: GoalType | 'discovery') => {
    // Reset conversation when switching modes
    if (id !== selectedGoalType) {
      clearConversation()
    }
    setGoalType(id)
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
      {GOAL_TYPES.map(({ id, label, emoji, special }) => {
        const active = selectedGoalType === id
        return (
          <motion.button
            key={id}
            onClick={() => handleSelect(id)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'relative shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border overflow-hidden',
              special && active
                ? 'border-amber-400/50 text-amber-300'
                : special
                ? 'border-amber-400/30 text-amber-400/80'
                : active
                ? 'bg-tcell-accent/20 border-tcell-accent/50 text-tcell-accent-light'
                : 'bg-tcell-surface border-tcell-surface2 text-tcell-muted',
            )}
          >
            {/* Gold shimmer for discovery chip */}
            {special && (
              <>
                <div className="absolute inset-0 bg-linear-to-r from-amber-400/10 via-amber-300/5 to-transparent" />
                {active && (
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-amber-400/20 to-transparent -skew-x-12"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                )}
              </>
            )}
            <span className="relative flex items-center gap-1">
              {special ? (
                <Sparkles size={11} className="text-amber-400" />
              ) : (
                <span>{emoji}</span>
              )}
              {label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
