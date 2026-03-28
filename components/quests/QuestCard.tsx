'use client'

import { motion, AnimatePresence } from 'motion/react'
import { icons, Lock, CheckCircle2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTPassStore } from '@/store/tpassStore'
import type { Quest } from '@/types/tpass'

interface QuestCardProps {
  quest: Quest
}

function DynamicIcon({ name, size = 18, className }: { name: string; size?: number; className?: string }) {
  const Icon = icons[name as keyof typeof icons]
  if (!Icon) return null
  return <Icon size={size} className={className} />
}

export function QuestCard({ quest }: QuestCardProps) {
  const { questProgress, isPremium, incrementQuestProgress } = useTPassStore()

  const progress    = questProgress[quest.id] ?? 0
  const isCompleted = progress >= quest.progressTotal
  const isLocked    = quest.track === 'premium' && !isPremium
  const isPrem      = quest.track === 'premium'
  const pct         = Math.min((progress / quest.progressTotal) * 100, 100)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: isLocked ? 0.55 : 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative rounded-2xl overflow-hidden border transition-all duration-200',
        isCompleted
          ? 'bg-tcell-card border-green-500/20'
          : isPrem
          ? 'bg-tcell-card border-amber-400/25'
          : 'bg-tcell-card border-tcell-surface2',
      )}
    >
      {/* Left accent bar */}
      <div className={cn(
        'absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full',
        isCompleted ? 'bg-green-400/60' : isPrem ? 'bg-amber-400/60' : 'bg-tcell-accent/60',
      )} />

      <div className="px-4 py-3.5 pl-5">
        {/* Top row: icon + title + XP */}
        <div className="flex items-start gap-3">

          {/* Icon container — тип-специфичный */}
          <div className={cn(
            'shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center relative mt-0.5',
            'ring-1',
            isCompleted
              ? 'bg-green-500/20 ring-green-500/30'
              : isPrem
              ? 'bg-amber-400/15 ring-amber-400/30 light:bg-amber-100 light:ring-amber-200'
              : 'bg-tcell-accent/15 ring-tcell-accent/25 light:bg-violet-50 light:ring-violet-200',
          )}>
            <AnimatePresence mode="wait">
              {isCompleted ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                >
                  <CheckCircle2 size={22} className="text-green-400" strokeWidth={2} />
                </motion.div>
              ) : (
                <motion.div key="icon" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                  <DynamicIcon
                    name={quest.icon}
                    size={20}
                    className={
                      isLocked
                        ? 'text-tcell-muted'
                        : isPrem
                        ? 'text-amber-400'
                        : 'text-tcell-accent-light'
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50">
                <Lock size={12} className="text-tcell-muted" />
              </div>
            )}
          </div>

          {/* Title + description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className={cn(
                'text-sm font-bold leading-snug',
                isCompleted ? 'text-tcell-fg2' : 'text-tcell-fg',
              )}>
                {quest.title}
              </p>

              {/* XP badge — CR chip */}
              <div className={cn(
                'shrink-0 flex items-center gap-0.5 rounded-full px-2 py-0.5 mt-0.5 border',
                isCompleted
                  ? 'bg-green-400/12 border-green-400/25 text-green-400'
                  : isPrem
                  ? 'bg-amber-400/12 border-amber-400/25 text-amber-400'
                  : 'bg-tcell-accent/12 border-tcell-accent/25 text-tcell-accent-light',
              )}>
                <span className="text-[11px] font-black">+{quest.xpReward}</span>
                <span className="text-[9px] font-bold opacity-80">XP</span>
              </div>
            </div>
            <p className="text-xs text-tcell-muted mt-0.5 leading-relaxed">
              {quest.description}
            </p>
          </div>
        </div>

        {/* Bottom: progress / status */}
        <div className="mt-3 pl-15">
          {isLocked ? (
            <p className="text-xs text-tcell-muted">Только с Tcell Pass</p>
          ) : isCompleted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 bg-green-500/12 border border-green-500/25 rounded-full px-2.5 py-0.5"
            >
              <CheckCircle2 size={11} className="text-green-400" strokeWidth={2.5} />
              <span className="text-[11px] font-semibold text-green-400">Выполнено</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Progress bar — thicker */}
              <div className="flex-1 h-2 bg-tcell-surface2 rounded-full overflow-hidden light:bg-black/[0.07]">
                <motion.div
                  className={cn(
                    'h-full rounded-full',
                    isPrem
                      ? 'bg-linear-to-r from-amber-500 to-amber-300'
                      : 'bg-linear-to-r from-tcell-accent to-tcell-accent-light',
                  )}
                  initial={{ width: '0%' }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />
              </div>

              {/* Counter */}
              <span className="text-[11px] font-medium text-tcell-muted tabular-nums whitespace-nowrap">
                {progress}<span className="text-tcell-fg3">/{quest.progressTotal}</span>
              </span>

              {/* Demo tap button */}
              <motion.button
                onClick={() => incrementQuestProgress(quest.id)}
                whileTap={{ scale: 0.82 }}
                whileHover={{ scale: 1.12 }}
                className={cn(
                  'shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors',
                          isPrem
                    ? 'bg-amber-400/15 border-amber-400/40 text-amber-400 hover:bg-amber-400/25'
                    : 'bg-tcell-accent/15 border-tcell-accent/40 text-tcell-accent-light hover:bg-tcell-accent/25',
                )}
              >
                <Plus size={13} strokeWidth={2.5} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
