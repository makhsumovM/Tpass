import { Crown, Shield } from 'lucide-react'
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
      {/* Section header — CR-стиль */}
      <div className={`mx-4 flex items-center gap-2 rounded-xl px-3 py-2 ${
        isPrem
          ? 'bg-amber-400/8 border border-amber-400/20 light:bg-amber-50 light:border-amber-200'
          : 'bg-blue-500/8 border border-blue-500/15 light:bg-blue-50 light:border-blue-200'
      }`}>
        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
          isPrem ? 'bg-amber-400/20' : 'bg-blue-500/20'
        }`}>
          {isPrem
            ? <Crown size={11} className="text-amber-400" />
            : <Shield size={11} className="text-blue-400 light:text-blue-500" />
          }
        </div>
        <span className={`text-[11px] font-black uppercase tracking-widest ${
          isPrem ? 'text-amber-400 light:text-amber-600' : 'text-blue-400 light:text-blue-600'
        }`}>
          {isPrem ? 'Tcell Pass' : 'Бесплатные'}
        </span>
        <div className={`flex-1 h-px ${
          isPrem ? 'bg-amber-400/20' : 'bg-blue-500/15'
        }`} />
        <span className={`text-[10px] font-bold ${
          isPrem ? 'text-amber-400/60' : 'text-blue-400/60 light:text-blue-500/70'
        }`}>
          {quests.length} {quests.length === 1 ? 'квест' : 'квеста'}
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
