'use client'

import { motion } from 'motion/react'
import { Crown } from 'lucide-react'
import { useTPassStore } from '@/store/tpassStore'
import { TrackLevel } from '@/components/track/TrackLevel'

export default function TrackPage() {
  const { levels, currentLevel } = useTPassStore()

  const currentIdx  = levels.findIndex((l) => l.level === currentLevel)
  const totalLevels = levels.length
  const fillPct     = totalLevels > 0 ? ((currentIdx + 0.5) / totalLevels) * 100 : 0

  return (
    <div>
      {/* Column headers */}
      <div className="flex items-center border-b border-tcell-surface2">
        <div
          className="flex-1 text-center text-[10px] font-bold uppercase tracking-widest text-tcell-fg3 py-2"
          style={{ backgroundColor: 'color-mix(in oklab, var(--tcell-col-free) 50%, transparent)' }}
        >
          Ройгон
        </div>
        <div className="w-14 shrink-0" />
        <div
          className="flex-1 flex items-center justify-center gap-1 py-2"
          style={{ backgroundColor: 'color-mix(in oklab, var(--tcell-col-prem) 50%, transparent)' }}
        >
          <Crown size={9} className="text-yellow-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400/70">Premium</span>
        </div>
      </div>

      {/* Levels with continuous progress line */}
      <div className="relative">
        {/* Background line — full height, grey */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 rounded-full bg-tcell-surface2 z-0" />

        {/* Filled accent line — animated from top */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-1 rounded-full z-1 overflow-hidden"
          initial={{ height: '0%' }}
          animate={{ height: `${fillPct}%` }}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
          style={{
            background: 'linear-gradient(180deg, #9B7FD4 0%, #7B5EA7 60%, #5A3E8A 100%)',
            boxShadow: '0 0 8px rgba(123, 94, 167, 0.6)',
          }}
        >
          {/* Shimmer sweep inside the line */}
          <motion.div
            className="absolute inset-x-0 h-8 bg-linear-to-b from-white/40 to-transparent rounded-full"
            animate={{ y: ['-100%', '400%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1.2 }}
          />
        </motion.div>

        {/* Glowing tip at current position */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-2 w-3 h-3 -translate-y-1/2 rounded-full bg-tcell-accent-light shadow-[0_0_10px_rgba(155,127,212,0.9)]"
          initial={{ top: '0%', opacity: 0 }}
          animate={{ top: `${fillPct}%`, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
        />

        {levels.map((levelData, i) => (
          <TrackLevel
            key={levelData.level}
            levelData={levelData}
            isCurrent={levelData.level === currentLevel}
            isPassed={levelData.level < currentLevel}
            isFirst={i === 0}
            isLast={i === levels.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
