'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { RewardCard } from './RewardCard';
import type { LevelData } from '@/types/tpass';

interface TrackLevelProps {
  levelData: LevelData;
  isCurrent: boolean;
  isPassed: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export function TrackLevel({ levelData, isCurrent, isPassed }: TrackLevelProps) {
  const { level, freeReward, premiumReward } = levelData;

  return (
    <div
      className={cn(
        'relative flex items-stretch transition-colors duration-200',
        isCurrent ? 'min-h-28 bg-tcell-accent/5' : 'min-h-24',
      )}
    >
      {/* Left accent bar — только для текущего */}
      {isCurrent && (
        <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full bg-tcell-accent" />
      )}

      {/* LEFT — Ройгон */}
      <div className="flex flex-1 items-center justify-center px-3 py-3">
        <RewardCard reward={freeReward} levelRequired={level} />
      </div>

      {/* CENTER — Level badge */}
      <div className="relative shrink-0 w-14 flex items-center justify-center z-10">
        {/* Маскирующий диск — скрывает линию прогресса */}
        <div className="absolute w-12 h-12 rounded-full bg-tcell-bg" />

        <div
          className={cn(
            'relative flex items-center justify-center font-black transition-all duration-300 select-none rounded-full',
            isCurrent
              ? 'w-11 h-11 text-sm bg-linear-to-br from-tcell-accent-light to-tcell-accent text-white scale-110 shadow-[0_0_22px_rgba(139,111,187,0.7),0_0_8px_rgba(169,143,224,0.5)]'
              : isPassed
              ? 'w-9 h-9 text-xs bg-tcell-accent/20 text-tcell-accent-light ring-1 ring-tcell-accent/50'
              : 'w-8 h-8 text-[11px] bg-tcell-surface2 text-tcell-muted ring-1 ring-tcell-surface2 light:ring-black/10 light:text-gray-400',
          )}
        >
          {level}

          {/* Пульсирующее кольцо текущего уровня */}
          {isCurrent && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full ring-2 ring-tcell-accent-light/50"
                animate={{ scale: [1, 1.7, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute inset-0 rounded-full ring-1 ring-tcell-accent/30"
                animate={{ scale: [1, 2.2, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
              />
            </>
          )}

        </div>
      </div>

      {/* RIGHT — Premium */}
      <div className="flex flex-1 items-center justify-center px-3 py-3">
        <RewardCard reward={premiumReward} levelRequired={level} />
      </div>

      {/* Row divider */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-tcell-surface2 light:bg-black/5" />
    </div>
  );
}

