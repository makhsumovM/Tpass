'use client'

import { useMemo } from 'react'
import { useTPassStore } from '@/store/tpassStore'
import { QuestTabFilter } from '@/components/quests/QuestTabFilter'
import { QuestSection } from '@/components/quests/QuestSection'

export default function QuestsPage() {
  const { quests, questCategory, questProgress } = useTPassStore()

  const filtered      = useMemo(() => quests.filter((q) => q.category === questCategory), [quests, questCategory])
  const freeQuests    = useMemo(() => filtered.filter((q) => q.track === 'free'),    [filtered])
  const premiumQuests = useMemo(() => filtered.filter((q) => q.track === 'premium'), [filtered])

  const completedCount = useMemo(() =>
    filtered.filter((q) => (questProgress[q.id] ?? 0) >= q.progressTotal).length,
    [filtered, questProgress]
  )
  const totalCount = filtered.length

  return (
    <div>
      {/* Header */}
      <div className="bg-tcell-bg border-b border-tcell-surface2 light:border-black/[0.06]">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div>
            <h1 className="text-base font-black text-tcell-fg tracking-wide">Квесты</h1>
            <p className="text-[11px] text-tcell-muted mt-0.5">
              Выполнено{' '}
              <span className="font-bold text-tcell-fg2">{completedCount}/{totalCount}</span>
            </p>
          </div>

          {/* Mini progress ring */}
          <div className="relative w-10 h-10">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3"
                className="text-tcell-surface2" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${totalCount > 0 ? (completedCount / totalCount) * 87.96 : 0} 87.96`}
                className="text-tcell-accent-light transition-all duration-700" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-tcell-fg">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </span>
          </div>
        </div>
        <QuestTabFilter />
      </div>

      {/* Quest sections */}
      <div className="py-3 space-y-4 pb-6">
        <QuestSection track="free"    quests={freeQuests}    />
        <QuestSection track="premium" quests={premiumQuests} />
      </div>
    </div>
  )
}
