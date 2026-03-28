'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useAiCoachStore } from '@/store/aiCoachStore'

const TABS = [
  { id: 'chat'     as const, label: 'Чат' },
  { id: 'goals'    as const, label: 'Мои цели' },
  { id: 'calendar' as const, label: 'Календарь' },
]

export function AiCoachTabs() {
  const { activeTab, setActiveTab } = useAiCoachStore()

  return (
    <div className="flex border-b border-tcell-surface2">
      {TABS.map(({ id, label }) => {
        const active = activeTab === id
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'relative flex-1 py-2.5 text-sm font-semibold transition-colors',
              active ? 'text-tcell-fg' : 'text-tcell-muted',
            )}
          >
            {active && (
              <motion.div
                layoutId="ai-tab-underline"
                className="absolute bottom-0 inset-x-6 h-0.5 rounded-full bg-tcell-accent"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
