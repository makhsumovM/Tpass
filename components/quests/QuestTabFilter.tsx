'use client'

import { cn } from '@/lib/utils'
import { useTPassStore } from '@/store/tpassStore'
import type { QuestCategory } from '@/types/tpass'

const TABS: { value: QuestCategory; label: string }[] = [
  { value: 'daily',  label: 'Ежедневные' },
  { value: 'weekly', label: 'Недельные'  },
  { value: 'season', label: 'Сезонные'   },
]

export function QuestTabFilter() {
  const { questCategory, setQuestCategory } = useTPassStore()

  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto">
      {TABS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setQuestCategory(value)}
          className={cn(
            'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all',
            questCategory === value
              ? 'bg-tcell-accent text-white'
              : 'bg-tcell-surface2 text-tcell-muted hover:bg-tcell-surface'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
