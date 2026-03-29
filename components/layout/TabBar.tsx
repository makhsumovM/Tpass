'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { useTPassStore } from '@/store/tpassStore'

const tabs = [
  { href: '/track',  label: 'Дорожка', premiumOnly: false },
  { href: '/quests', label: 'Квесты',  premiumOnly: false },
]

export function TabBar() {
  const pathname = usePathname()
  const { questProgress, quests, isPremium } = useTPassStore()

  const activeQuestCount = quests.filter((q) => {
    const isLocked    = q.track === 'premium' && !isPremium
    const progress    = questProgress[q.id] ?? 0
    const isCompleted = progress >= q.progressTotal
    return !isLocked && !isCompleted
  }).length

  return (
    <div className="relative flex border-b border-tcell-surface2">
      {tabs.map(({ href, label }) => {
        const active  = pathname.startsWith(href)
        const isQuest = href === '/quests'

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors',
              active ? 'text-tcell-accent-light' : 'text-tcell-muted',
            )}
          >
            {label}

            {/* Active quests badge */}
            <AnimatePresence>
              {isQuest && activeQuestCount > 0 && (
                <motion.span
                  key={activeQuestCount}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className={cn(
                    'min-w-4.5 h-4.5 px-1 rounded-full text-[10px] font-black flex items-center justify-center',
                    active
                      ? 'bg-tcell-accent text-white'
                      : 'bg-tcell-surface2 text-tcell-muted',
                  )}
                >
                  {activeQuestCount}
                </motion.span>
              )}
            </AnimatePresence>

            {active && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 inset-x-6 h-0.5 rounded-full bg-tcell-accent"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </Link>
        )
      })}
    </div>
  )
}
