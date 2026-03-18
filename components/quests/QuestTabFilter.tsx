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
              'shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all',
              active
                ? 'bg-linear-to-r from-tcell-accent to-tcell-accent-light text-white shadow-[0_3px_12px_rgba(139,111,187,0.35)]'
                : 'bg-tcell-surface2 text-tcell-muted light:bg-black/[0.06] light:text-gray-500',
            )}
          >
            {label}
          </motion.button>
        )
      })}
    </div>
  )
}
