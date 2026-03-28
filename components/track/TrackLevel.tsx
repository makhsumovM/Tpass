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
            'relative flex items-center justify-center font-bold transition-all duration-200 select-none rounded-full',
            isCurrent
              ? 'w-10 h-10 text-sm bg-tcell-accent text-white'
              : isPassed
              ? 'w-9 h-9 text-xs bg-tcell-accent/15 text-tcell-accent-light'
              : 'w-8 h-8 text-[11px] bg-tcell-surface2 text-tcell-muted',
          )}
        >
          {level}

          {isCurrent && (
            <motion.div
              className="absolute inset-0 rounded-full ring-1 ring-tcell-accent-light/40"
              animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
            />
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

