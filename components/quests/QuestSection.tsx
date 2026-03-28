import { QuestCard } from './QuestCard'
import type { Quest, QuestTrack } from '@/types/tpass'

interface QuestSectionProps {
  track: QuestTrack
  quests: Quest[]
}

export function QuestSection({ track, quests }: QuestSectionProps) {
  if (quests.length === 0) return null

  const isPrem = track === 'premium'

  return (
    <div className="space-y-2.5">
      {/* Section header */}
      <div className="mx-4 flex items-center gap-2.5">
        <span className={`text-xs font-semibold ${isPrem ? 'text-amber-400' : 'text-tcell-muted'}`}>
          {isPrem ? 'Tcell Pass' : 'Бесплатные'}
        </span>
        <div className="flex-1 h-px bg-tcell-surface2" />
        <span className="text-[11px] text-tcell-fg3">
          {quests.length}
        </span>
      </div>

      <div className="px-4 space-y-2.5">
        {quests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  )
}
