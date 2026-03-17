'use client'

import { motion, AnimatePresence } from 'motion/react'
import { icons, Lock, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTPassStore } from '@/store/tpassStore'
import type { Quest } from '@/types/tpass'

interface QuestCardProps {
  quest: Quest
}

function DynamicIcon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  const Icon = icons[name as keyof typeof icons]
  if (!Icon) return null
  return <Icon size={size} className={className} />
}

export function QuestCard({ quest }: QuestCardProps) {
  const { questProgress, isPremium, incrementQuestProgress } = useTPassStore()

  const progress = questProgress[quest.id] ?? 0
  const isCompleted = progress >= quest.progressTotal
  const isLocked = quest.track === 'premium' && !isPremium
  const pct = Math.min((progress / quest.progressTotal) * 100, 100)

  return (
    <motion.div
      layout
      className={cn(
        'flex items-center gap-3 rounded-xl p-3 border transition-all',
        'bg-tcell-card border-tcell-surface2 light:shadow-sm',
        isLocked && 'opacity-50',
        isCompleted && 'border-green-500/20 bg-green-500/5',
      )}
    >
      {/* Icon */}
      <div className={cn(
        'shrink-0 w-10 h-10 rounded-xl flex items-center justify-center relative',
        isCompleted ? 'bg-green-500/20' : quest.track === 'premium' ? 'bg-tcell-accent/20' : 'bg-tcell-surface2',
      )}>
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
              <Check size={20} className="text-green-400" />
            </motion.div>
          ) : (
            <motion.div key="icon">
              <DynamicIcon name={quest.icon} size={20} className={quest.track === 'premium' ? 'text-tcell-accent-light' : 'text-tcell-fg'} />
            </motion.div>
          )}
        </AnimatePresence>
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60">
            <Lock size={12} className="text-tcell-muted" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-sm font-medium text-tcell-fg truncate">{quest.title}</p>
          <span className="shrink-0 text-xs font-bold text-tcell-accent-light bg-tcell-accent/20 rounded-full px-2 py-0.5">
            +{quest.xpReward} XP
          </span>
        </div>

        {isLocked ? (
          <p className="text-xs text-tcell-muted">Только с Tcell Pass</p>
        ) : isCompleted ? (
          <p className="text-xs text-green-400 font-medium">Выполнено ✓</p>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-tcell-surface2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-tcell-accent to-tcell-accent-light rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[10px] text-tcell-muted whitespace-nowrap">
                {progress}/{quest.progressTotal}
              </span>
            </div>
            {/* Demo button */}
            <button
              onClick={() => incrementQuestProgress(quest.id)}
              className="mt-1.5 text-[10px] text-tcell-accent hover:text-tcell-accent-light transition-colors"
            >
              + прогресс (демо)
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
