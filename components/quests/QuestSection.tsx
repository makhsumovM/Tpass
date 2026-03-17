import { Crown } from 'lucide-react'
import { QuestCard } from './QuestCard'
import type { Quest, QuestTrack } from '@/types/tpass'

interface QuestSectionProps {
  track: QuestTrack
  quests: Quest[]
}

export function QuestSection({ track, quests }: QuestSectionProps) {
  if (quests.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-4">
        <div className="flex-1 h-px bg-tcell-surface2" />
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {track === 'premium' ? (
            <>
              <Crown size={12} className="text-tcell-accent-light" />
              <span className="text-tcell-accent-light">Tcell Pass</span>
            </>
          ) : (
            <span className="text-tcell-muted">Бесплатные</span>
          )}
        </div>
        <div className="flex-1 h-px bg-tcell-surface2" />
      </div>
      <div className="px-4 space-y-2">
        {quests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  )
}
