'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useTPassStore } from '@/store/tpassStore'
import type { QuestCategory } from '@/types/tpass'

const TABS: {
  value: QuestCategory
  label: string
  activeGradient: string
  activeShadow: string
  dot: string
}[] = [
  {
    value: 'daily',
    label: 'Ежедневные',
    activeGradient: 'from-amber-500 to-orange-500',
    activeShadow:   'shadow-[0_3px_12px_rgba(245,158,11,0.4)]',
    dot:            'bg-amber-400',
  },
  {
    value: 'weekly',
    label: 'Недельные',
    activeGradient: 'from-blue-600 to-blue-500',
    activeShadow:   'shadow-[0_3px_12px_rgba(59,130,246,0.4)]',
    dot:            'bg-blue-400',
  },
  {
    value: 'season',
    label: 'Сезонные',
    activeGradient: 'from-tcell-accent to-violet-600',
    activeShadow:   'shadow-[0_3px_12px_rgba(139,111,187,0.4)]',
    dot:            'bg-violet-400',
  },
]

export function QuestTabFilter() {
  const { questCategory, setQuestCategory } = useTPassStore()

  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none">
      {TABS.map(({ value, label, activeGradient, activeShadow, dot }) => {
        const active = questCategory === value
        return (
          <motion.button
            key={value}
            onClick={() => setQuestCategory(value)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'relative shrink-0 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide transition-all overflow-hidden',
              active
                ? `bg-linear-to-r ${activeGradient} text-white ${activeShadow}`
                : 'bg-tcell-surface2 text-tcell-muted light:bg-black/[0.06] light:text-gray-500',
            )}
          >
            {/* Top shine on active */}
            {active && (
              <div className="absolute top-0 inset-x-2 h-px bg-white/50 rounded-full" />
            )}

            <span className="relative flex items-center gap-1.5">
              {/* Color dot on inactive */}
              {!active && (
                <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
              )}
              {label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
