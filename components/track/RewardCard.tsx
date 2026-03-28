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
      whileTap={isClaimable ? { scale: 0.95 } : {}}
      className={cn(
        'relative flex flex-col items-center gap-2 rounded-2xl p-3 w-full',
        'border transition-all duration-200 select-none overflow-hidden',
        isPrem
          ? 'bg-tcell-card border-amber-400/25 light:border-amber-200'
          : 'bg-tcell-card border-tcell-surface2 light:border-black/[0.08]',
        status === 'claimable' && isPrem  && 'border-amber-400/60',
        status === 'claimable' && !isPrem && 'border-tcell-accent/50',
        status === 'claimed'   && 'opacity-40',
        isPremiumLocked        && 'opacity-50 cursor-default',
        isLevelLocked          && 'cursor-default',
      )}
    >
      {/* Crown badge для premium */}
      {isPrem && (
        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 flex items-center justify-center">
          <Crown size={9} className="text-amber-400/70" />
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
            'w-full rounded-xl py-1.5 text-xs font-semibold text-white text-center',
            isPrem ? 'bg-amber-500' : 'bg-tcell-accent',
          )}
        >
          Забрать
        </motion.div>
      )}
    </motion.button>
  )
}
