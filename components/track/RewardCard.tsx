'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Lock, Check, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTPassStore } from '@/store/tpassStore'
import { RewardIcon } from './RewardIcon'
import type { Reward, RewardStatus } from '@/types/tpass'

interface RewardCardProps {
  reward: Reward
  levelRequired: number
}

export function RewardCard({ reward, levelRequired }: RewardCardProps) {
  const { currentLevel, claimedRewards, isPremium, claimReward } = useTPassStore()

  const isLocked    = currentLevel < levelRequired || (reward.track === 'premium' && !isPremium)
  const isClaimed   = claimedRewards.includes(reward.id)
  const isClaimable = !isLocked && !isClaimed
  const status: RewardStatus = isClaimed ? 'claimed' : isLocked ? 'locked' : 'claimable'
  const isPrem = reward.track === 'premium'

  return (
    <motion.button
      disabled={!isClaimable}
      onClick={() => isClaimable && claimReward(reward.id)}
      whileTap={isClaimable ? { scale: 0.93 } : {}}
      className={cn(
        'relative flex flex-col items-center gap-1.5 rounded-2xl p-2.5 w-full max-w-32.5',
        'border-2 transition-all duration-300 select-none overflow-hidden',
        // Базовый фон
        isPrem
          ? 'bg-linear-to-b from-yellow-400/10 via-amber-300/5 to-transparent border-yellow-400/30'
          : 'bg-tcell-card border-tcell-surface2',
        // Состояния
        status === 'claimable' && isPrem  && 'border-yellow-400/70 shadow-[0_0_18px_rgba(251,191,36,0.3)]',
        status === 'claimable' && !isPrem && 'border-tcell-accent/60 shadow-[0_0_14px_rgba(123,94,167,0.25)]',
        status === 'claimed'   && 'opacity-40',
        status === 'locked'    && 'opacity-35 cursor-default',
      )}
    >
      {/* Золотой shimmer для claimable premium */}
      {status === 'claimable' && isPrem && (
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-yellow-200/20 to-transparent -skew-x-12"
          animate={{ x: ['-130%', '230%'] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.8 }}
        />
      )}

      {/* Корона для премиума */}
      {isPrem && (
        <div className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-yellow-400/20 border border-yellow-400/50">
          <Crown size={8} className="text-yellow-400" />
        </div>
      )}

      {/* Иконка */}
      <div className={cn(
        'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
        isPrem
          ? 'bg-yellow-400/15 ring-1 ring-yellow-400/20'
          : status === 'claimed'
          ? 'bg-green-500/15'
          : 'bg-tcell-surface2',
      )}>
        <AnimatePresence mode="wait">
          {status === 'claimed' ? (
            <motion.div key="check"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              <Check size={20} className="text-green-400" strokeWidth={2.5} />
            </motion.div>
          ) : status === 'locked' ? (
            <motion.div key="lock">
              <Lock size={15} className="text-tcell-muted" />
            </motion.div>
          ) : (
            <motion.div key="icon"
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 320 }}
            >
              <RewardIcon type={reward.type} size={20} isPrem={isPrem} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Текст */}
      <div className="text-center leading-tight w-full">
        <p className={cn(
          'text-xs font-bold truncate',
          isPrem ? 'text-yellow-500' : 'text-tcell-fg',
        )}>
          {reward.label}
        </p>
        <p className="text-[9px] text-tcell-muted mt-0.5 leading-tight truncate">
          {reward.sublabel}
        </p>
      </div>

      {/* Кнопка "Забрать" */}
      {status === 'claimable' && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'w-full rounded-lg py-1 text-[9px] font-black text-white text-center uppercase tracking-wider',
            isPrem
              ? 'bg-linear-to-r from-yellow-400 to-amber-400 shadow-[0_2px_8px_rgba(251,191,36,0.4)]'
              : 'bg-tcell-accent shadow-[0_2px_8px_rgba(123,94,167,0.35)]',
          )}
        >
          Забрать
        </motion.div>
      )}
    </motion.button>
  )
}
