'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Lock, Check, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTPassStore } from '@/store/tpassStore'
import { RewardIcon, iconBgMap } from './RewardIcon'
import type { Reward, RewardStatus } from '@/types/tpass'

interface RewardCardProps {
  reward: Reward
  levelRequired: number
}

export function RewardCard({ reward, levelRequired }: RewardCardProps) {
  const { currentLevel, claimedRewards, isPremium, claimReward } = useTPassStore()

  const isPrem          = reward.track === 'premium'
  const isLevelLocked   = currentLevel < levelRequired
  const isPremiumLocked = isPrem && !isPremium
  const isLocked        = isLevelLocked || isPremiumLocked
  const isClaimed       = claimedRewards.includes(reward.id)
  const isClaimable     = !isLocked && !isClaimed
  const status: RewardStatus = isClaimed ? 'claimed' : isLocked ? 'locked' : 'claimable'

  return (
    <motion.button
      disabled={!isClaimable}
      onClick={() => isClaimable && claimReward(reward.id)}
      whileTap={isClaimable ? { scale: 0.93 } : {}}
      className={cn(
        'relative flex flex-col items-center gap-2 rounded-2xl p-3 w-full',
        'border transition-all duration-300 select-none overflow-hidden',
        // Базовый фон
        isPrem
          ? 'bg-linear-to-b from-[#1f1530] to-[#140e22] border-amber-400/35 light:from-amber-50 light:to-white light:border-amber-200'
          : 'bg-tcell-card border-tcell-surface2 light:border-black/[0.08]',
        // Тень только на claimable (ниже), базовая — лёгкая
        'shadow-sm light:shadow-[0_1px_4px_rgba(0,0,0,0.06)]',
        // Состояния
        status === 'claimable' && isPrem  && 'border-amber-400/80 shadow-[0_0_22px_rgba(251,191,36,0.4)] light:shadow-[0_4px_18px_rgba(251,191,36,0.25)]',
        status === 'claimable' && !isPrem && 'border-tcell-accent/70 shadow-[0_0_18px_rgba(139,111,187,0.35)] light:shadow-[0_4px_18px_rgba(139,111,187,0.2)]',
        status === 'claimed'   && 'opacity-50 saturate-50',
        isPremiumLocked        && 'opacity-60 cursor-default',
        isLevelLocked          && 'cursor-default',
      )}
    >
      {/* Top shine — CR карточка ощущается как физический предмет */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute top-0 inset-x-0 h-6 bg-linear-to-b from-white/[0.07] to-transparent pointer-events-none" />

      {/* Shimmer для claimable premium */}
      {status === 'claimable' && isPrem && (
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-amber-200/15 to-transparent -skew-x-12"
          animate={{ x: ['-130%', '230%'] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2 }}
        />
      )}

      {/* Crown badge для premium */}
      {isPrem && (
        <div className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400/50">
          <Crown size={8} className="text-amber-400" />
        </div>
      )}

      {/* Иконка — тип-специфичный фон */}
      <div className={cn(
        'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
        status === 'claimed'
          ? 'bg-green-500/20 ring-1 ring-green-500/30'
          : isPremiumLocked
          ? 'bg-white/8 ring-1 ring-white/10'
          : isPrem
          ? 'bg-amber-400/15 ring-1 ring-amber-400/30 light:bg-amber-100'
          : iconBgMap[reward.type],
      )}>
        <AnimatePresence mode="wait">
          {status === 'claimed' ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              <Check size={22} className="text-green-400" strokeWidth={2.5} />
            </motion.div>
          ) : isPremiumLocked ? (
            <motion.div key="lock">
              <Lock size={16} className="text-tcell-muted" />
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 320 }}
            >
              <RewardIcon type={reward.type} size={22} isPrem={isPrem} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Текст */}
      <div className="text-center leading-tight w-full">
        <p className={cn(
          'text-xs font-black truncate',
          isPrem ? 'text-amber-400' : 'text-tcell-fg',
        )}>
          {reward.label}
        </p>
        <p className="text-[9px] text-tcell-muted mt-0.5 leading-tight truncate">
          {reward.sublabel}
        </p>
      </div>

      {/* Кнопка "Забрать" — CR-стиль: большая, яркая, chunky */}
      {status === 'claimable' && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'w-full rounded-xl py-1.5 text-xs font-bold text-white text-center uppercase tracking-wide',
            isPrem
              ? 'bg-linear-to-r from-amber-500 to-amber-400 shadow-[0_3px_12px_rgba(251,191,36,0.5)]'
              : 'bg-linear-to-r from-tcell-accent to-tcell-accent-light shadow-[0_3px_12px_rgba(139,111,187,0.45)]',
          )}
        >
          Забрать
        </motion.div>
      )}
    </motion.button>
  )
}
