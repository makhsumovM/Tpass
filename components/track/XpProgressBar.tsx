'use client'

import { motion } from 'motion/react'

interface XpProgressBarProps {
  current: number
  max: number
  level: number
}

export function XpProgressBar({ current, max, level }: XpProgressBarProps) {
  const pct = Math.min((current / max) * 100, 100)

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-tcell-muted whitespace-nowrap">Ур. {level}</span>
      <div className="relative flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-tcell-accent to-tcell-accent-light"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs text-tcell-muted whitespace-nowrap">{current}/{max}</span>
    </div>
  )
}
