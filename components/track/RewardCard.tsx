'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Lock, Check, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTPassStore } from '@/store/tpassStore'
import { RewardIcon, iconBgMap } from './RewardIcon'
import type { Reward, RewardStatus } from '@/types/tpass'

// 8 particles at different angles
const PARTICLES = [
  { angle: 0,   color: '#FBBF24' },
  { angle: 45,  color: '#A98FE0' },
  { angle: 90,  color: '#34D399' },
  { angle: 135, color: '#FBBF24' },
  { angle: 180, color: '#8B6FBB' },
  { angle: 225, color: '#34D399' },
  { angle: 270, color: '#FBBF24' },
  { angle: 315, color: '#A98FE0' },
]

interface RewardCardProps {
  reward: Reward
  levelRequired: number
}

export function RewardCard({ reward, levelRequired }: RewardCardProps) {
  const { currentLevel, claimedRewards, isPremium, claimReward } = useTPassStore()
  const [burst, setBurst] = useState(false)

  const isPrem          = reward.track === 'premium'
  const isLevelLocked   = currentLevel < levelRequired
  const isPremiumLocked = isPrem && !isPremium
  const isLocked        = isLevelLocked || isPremiumLocked
  const isClaimed       = claimedRewards.includes(reward.id)
  const isClaimable     = !isLocked && !isClaimed
  const status: RewardStatus = isClaimed ? 'claimed' : isLocked ? 'locked' : 'claimable'

  function handleClaim() {
    if (!isClaimable) return
    claimReward(reward.id)
    setBurst(true)
    setTimeout(() => setBurst(false), 700)
  }

  return (
    <motion.button
      disabled={!isClaimable}
      onClick={handleClaim}
      whileTap={isClaimable ? { scale: 0.95 } : {}}
      className={cn(
        'relative flex flex-col items-center gap-2 rounded-2xl p-3 w-full',
        'border transition-all duration-200 select-none',
        // overflow-visible during burst so particles escape the card
        burst ? 'overflow-visible' : 'overflow-hidden',
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
      {/* Sparkle burst particles */}
      <AnimatePresence>
        {burst && PARTICLES.map((p, i) => {
          const rad = (p.angle * Math.PI) / 180
          const tx = Math.cos(rad) * 38
          const ty = Math.sin(rad) * 38
          return (
            <motion.span
              key={i}
              className="absolute rounded-full pointer-events-none z-10"
              style={{
                width: 6,
                height: 6,
                backgroundColor: p.color,
                top: '50%',
                left: '50%',
                marginTop: -3,
                marginLeft: -3,
              }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ x: tx, y: ty, scale: 0, opacity: 0 }}
              exit={{}}
              transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.02 }}
            />
          )
        })}
      </AnimatePresence>

      {/* Flash overlay on claim */}
      <AnimatePresence>
        {burst && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none z-10"
            style={{ backgroundColor: isPrem ? '#FBBF2440' : '#8B6FBB40' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.35 }}
          />
        )}
      </AnimatePresence>

      {/* Crown badge для premium */}
      {isPrem && (
        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 flex items-center justify-center">
          <Crown size={9} className="text-amber-400/70" />
        </div>
      )}

      {/* Иконка */}
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

      {/* Кнопка "Забрать" */}
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
