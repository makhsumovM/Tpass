'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/track',  label: 'Дорожка' },
  { href: '/quests', label: 'Квесты'  },
]

export function TabBar() {
  const pathname = usePathname()

  return (
    <div className="relative flex border-b border-tcell-surface2 bg-tcell-bg">
      {tabs.map(({ href, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'relative flex-1 py-3 text-center text-sm font-semibold transition-colors',
              active ? 'text-tcell-accent-light' : 'text-tcell-muted'
            )}
          >
            {label}
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
