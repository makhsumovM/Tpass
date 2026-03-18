'use client'

import { motion } from 'motion/react'
import { Crown, Shield } from 'lucide-react'
import { useTPassStore } from '@/store/tpassStore'
import { TrackLevel } from '@/components/track/TrackLevel'

export default function TrackPage() {
  const { levels, currentLevel } = useTPassStore()

  const currentIdx  = levels.findIndex((l) => l.level === currentLevel)
  const totalLevels = levels.length
  const fillPct     = totalLevels > 0 ? ((currentIdx + 0.5) / totalLevels) * 100 : 0

  return (
    <div>
      {/* Column headers — CR-стиль: цвет + иконка + bold */}
      <div className="flex items-center border-b-2 border-tcell-surface2 light:border-black/[0.06]">
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-950/25 light:bg-blue-50">
          <Shield size={10} className="text-blue-400 light:text-blue-500" />
          <span className="text-[11px] font-black uppercase tracking-widest text-blue-400 light:text-blue-600">
            Ройгон
          </span>
        </div>
        <div className="w-14 shrink-0" />
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-amber-950/25 light:bg-amber-50">
          <Crown size={10} className="text-amber-400" />
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 light:text-amber-600">
            Premium
          </span>
        </div>
      </div>

      {/* Levels with continuous progress spine */}
      <div className="relative">

        {/* Background spine — full height */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1.5 rounded-full bg-tcell-surface2 z-0" />

        {/* Filled spine — animated */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-1.5 rounded-full z-[1] overflow-hidden"
          initial={{ height: '0%' }}
          animate={{ height: `${fillPct}%` }}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
          style={{
            background: 'linear-gradient(180deg, #C4A8F0 0%, #A98FE0 40%, #8B6FBB 100%)',
            boxShadow: '0 0 14px rgba(169,143,224,0.85), 0 0 4px rgba(196,168,240,0.9)',
          }}
        >
          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-x-0 h-10 bg-linear-to-b from-white/50 to-transparent rounded-full"
            animate={{ y: ['-100%', '400%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1.2 }}
          />
        </motion.div>

        {/* Glowing tip */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-[2] -translate-y-1/2"
          initial={{ top: '0%', opacity: 0 }}
          animate={{ top: `${fillPct}%`, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 w-5 h-5 -translate-x-1 -translate-y-1 rounded-full bg-tcell-accent-light/30"
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
          {/* Core dot */}
          <div className="w-3 h-3 rounded-full bg-tcell-accent-light shadow-[0_0_12px_rgba(196,168,240,1),0_0_4px_white]" />
        </motion.div>

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
