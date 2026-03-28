'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useTPassStore } from '@/store/tpassStore'
import type { QuestCategory } from '@/types/tpass'

const TABS: { value: QuestCategory; label: string }[] = [
  { value: 'daily',  label: 'Ежедневные' },
  { value: 'weekly', label: 'Недельные' },
  { value: 'season', label: 'Сезонные' },
]

export function QuestTabFilter() {
  const { questCategory, setQuestCategory } = useTPassStore()

  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none">
      {TABS.map(({ value, label }) => {
        const active = questCategory === value
        return (
          <motion.button
            key={value}
            onClick={() => setQuestCategory(value)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-colors',
              active
                ? 'bg-tcell-accent/20 text-tcell-accent-light border border-tcell-accent/30'
                : 'bg-tcell-surface2 text-tcell-muted border border-transparent',
            )}
          >
            {label}
          </motion.button>
        )
      })}
    </div>
  )
}
