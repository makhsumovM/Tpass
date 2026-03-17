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

  const freeOpacity = isPassed ? 8 : isCurrent ? 14 : 4;
  const premOpacity = isPassed ? 8 : isCurrent ? 14 : 4;

  return (
    <div
      className={cn(
        'relative flex items-stretch min-h-22 transition-colors duration-200',
        isCurrent && 'bg-tcell-accent/3',
      )}
    >
      {/* Левый акцентный бордер для текущего уровня */}
      {isCurrent && (
        <div className="absolute left-0 top-2 bottom-2 w-0.75 rounded-r-full bg-tcell-accent" />
      )}

      {/* LEFT — Ройгон */}
      <div
        className="flex flex-1 items-center justify-center px-3 py-3"
        style={{
          backgroundColor: `color-mix(in oklab, var(--tcell-col-free) ${freeOpacity}%, transparent)`,
        }}
      >
        <RewardCard reward={freeReward} levelRequired={level} />
      </div>

      {/* CENTER — Круглый индикатор уровня */}
      <div className="relative shrink-0 w-14 flex items-center justify-center z-10">
        {/* Подложка — перекрывает линию за кругом */}
        <div className="absolute w-11 h-11 rounded-full bg-tcell-bg" />

        <div
          className={cn(
            'relative w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 select-none',
            isCurrent
              ? 'bg-tcell-accent text-white scale-110 shadow-[0_0_18px_rgba(123,94,167,0.6)]'
              : isPassed
                ? 'bg-tcell-accent/15 text-tcell-accent-light ring-1 ring-tcell-accent/40'
                : 'bg-tcell-surface2 text-tcell-muted ring-1 ring-tcell-surface2',
          )}
        >
          {level}

          {/* Пульсирующее кольцо для текущего уровня */}
          {isCurrent && (
            <motion.div
              className="absolute inset-0 rounded-full ring-2 ring-tcell-accent-light/60"
              animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </div>
      </div>

      {/* RIGHT — Premium */}
      <div
        className="flex flex-1 items-center justify-center px-3 py-3"
        style={{
          backgroundColor: `color-mix(in oklab, var(--tcell-col-prem) ${premOpacity}%, transparent)`,
        }}
      >
        <RewardCard reward={premiumReward} levelRequired={level} />
      </div>

      {/* Разделительная линия */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-tcell-surface2" />
    </div>
  );
}
