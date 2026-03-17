'use client'

import { useMemo } from 'react'
import { Timer } from 'lucide-react'
import { useTPassStore } from '@/store/tpassStore'
import { XpProgressBar } from './XpProgressBar'

function useCountdown(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now()
  if (diff <= 0) return 'Сезон завершён'

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  return `${days}д ${hours}ч`
}

export function TrackHeader() {
  const { seasonName, seasonEndDate, currentLevel, currentXp, xpPerLevel } = useTPassStore()
  const countdown = useCountdown(seasonEndDate)

  return (
    <div className="bg-tcell-bg border-b border-white/8 px-4 py-3 space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold tracking-wide text-white">{seasonName}</h1>
        <div className="flex items-center gap-1.5 text-xs text-tcell-muted">
          <Timer size={13} />
          <span>осталось {countdown}</span>
        </div>
      </div>
      <XpProgressBar current={currentXp} max={xpPerLevel} level={currentLevel} />
    </div>
  )
}
