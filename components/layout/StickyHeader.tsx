'use client'

import { motion } from 'motion/react'
import { Timer, Star, Sun, Moon } from 'lucide-react'
import { useTPassStore } from '@/store/tpassStore'

function useCountdown(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now()
  if (diff <= 0) return 'Завершён'
  const days  = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  return `${days}д ${hours}ч`
}

export function StickyHeader() {
  const { seasonName, seasonEndDate, currentLevel, currentXp, xpPerLevel, theme, toggleTheme } = useTPassStore()
  const countdown = useCountdown(seasonEndDate)
  const pct = Math.min((currentXp / xpPerLevel) * 100, 100)
  const nextLevel = currentLevel + 1

  return (
    <div className="sticky top-0 z-50 overflow-hidden">
      {/* Background with glow */}
      <div className="absolute inset-0 bg-tcell-bg" />
      <div className="absolute inset-0 bg-linear-to-b from-tcell-accent/12 via-transparent to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-tcell-accent/50 to-transparent" />

      <div className="relative px-4 pt-4 pb-3 space-y-3">

        {/* Top row: season + timer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-tcell-accent/30 flex items-center justify-center">
              <Star size={13} fill="currentColor" className="text-tcell-accent-light" />
            </div>
            <span className="text-sm font-black tracking-wide text-tcell-fg">{seasonName}</span>
            <span className="text-[10px] text-tcell-fg3 font-medium">Март — Апрель</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-tcell-surface rounded-full px-2.5 py-1">
              <Timer size={11} className="text-tcell-muted" />
              <span className="text-[11px] font-medium text-tcell-muted">{countdown}</span>
            </div>
            <button
              onClick={toggleTheme}
              className="w-7 h-7 rounded-full bg-tcell-surface flex items-center justify-center text-tcell-muted hover:text-tcell-accent transition-colors"
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        </div>

        {/* Level + XP bar row */}
        <div className="flex items-center gap-3">

          {/* Current level badge */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-tcell-accent to-[#4A2080] flex items-center justify-center shadow-lg shadow-tcell-accent/30 border border-tcell-accent-light/30">
              <span className="text-base font-black text-white leading-none select-none">{currentLevel}</span>
            </div>
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl border border-tcell-accent-light/40"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>

          {/* XP bar */}
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-semibold text-tcell-muted">Опыт</span>
              <span className="text-[11px] font-bold text-tcell-fg tabular-nums">
                {currentXp} <span className="text-tcell-muted font-normal">/ {xpPerLevel} XP</span>
              </span>
            </div>
            <div className="relative h-3 bg-tcell-surface2 rounded-full overflow-hidden">
              {/* Track shimmer bg */}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/3 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              {/* Fill */}
              <motion.div
                className="h-full rounded-full relative overflow-hidden"
                style={{ background: 'linear-gradient(90deg, #7B5EA7, #9B7FD4, #C4A8F0)' }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              >
                {/* Fill shimmer */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                />
              </motion.div>
            </div>
          </div>

          {/* Next level badge */}
          <div className="shrink-0 w-9 h-9 rounded-xl bg-tcell-surface border border-tcell-surface2 flex items-center justify-center">
            <span className="text-xs font-bold text-tcell-muted">{nextLevel}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
