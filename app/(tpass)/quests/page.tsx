'use client'

import { useMemo } from 'react'
import { useTPassStore } from '@/store/tpassStore'
import { QuestTabFilter } from '@/components/quests/QuestTabFilter'
import { QuestSection } from '@/components/quests/QuestSection'

export default function QuestsPage() {
  const { quests, questCategory } = useTPassStore()

  const filtered = useMemo(() => quests.filter((q) => q.category === questCategory), [quests, questCategory])
  const freeQuests    = useMemo(() => filtered.filter((q) => q.track === 'free'), [filtered])
  const premiumQuests = useMemo(() => filtered.filter((q) => q.track === 'premium'), [filtered])

  return (
    <div>
      {/* Header */}
      <div className="bg-tcell-bg border-b border-tcell-surface2">
        <div className="px-4 pt-4 pb-1">
          <h1 className="text-base font-bold text-tcell-fg">Квесты</h1>
        </div>
        <QuestTabFilter />
      </div>

      {/* Quest sections */}
      <div className="py-3 space-y-4">
        <QuestSection track="free"    quests={freeQuests}    />
        <QuestSection track="premium" quests={premiumQuests} />
      </div>
    </div>
  )
}
