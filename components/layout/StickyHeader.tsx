'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Timer, Sun, Moon } from 'lucide-react';
import { useTPassStore } from '@/store/tpassStore';

function useCountdown(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return 'Завершён';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return `${days}д ${hours}ч`;
}

export function StickyHeader() {
  const { seasonName, seasonEndDate, currentLevel, currentXp, xpPerLevel, theme, toggleTheme } =
    useTPassStore();
  const countdown = useCountdown(seasonEndDate);
  const pct = Math.min((currentXp / xpPerLevel) * 100, 100);
  const nextLevel = currentLevel + 1;

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-tcell-bg" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-tcell-surface2" />

      <div className="relative px-4 pt-2 pb-2.5 space-y-2">
        {/* ── Row 1: Season info ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-bold text-tcell-fg truncate">
              {seasonName}
            </span>
            <span className="shrink-0 text-[11px] text-tcell-fg3 tabular-nums">
              Март — Апрель
            </span>
          </div>

          {/* Timer + theme toggle */}
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <div className="flex items-center gap-1 text-tcell-muted">
              <Timer size={10} />
              <span className="text-[11px] tabular-nums">{countdown}</span>
            </div>
            <button
              onClick={toggleTheme}
              className="w-7 h-7 rounded-full bg-tcell-surface border border-tcell-surface2 flex items-center justify-center text-tcell-muted transition-colors"
            >
              {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
            </button>
          </div>
        </div>

        {/* ── Row 2: Level + XP bar + Next level ── */}
        <div className="flex items-center gap-3">
          {/* Current level badge */}
          <div className="shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-tcell-accent flex items-center justify-center border border-tcell-accent-light/20 overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={currentLevel}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="text-base font-black text-white leading-none select-none"
                >
                  {currentLevel}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* XP bar + numbers */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[11px] text-tcell-muted">Уровень {currentLevel}</span>
              <span className="text-[11px] text-tcell-fg2 tabular-nums">
                {currentXp} / {xpPerLevel} XP
              </span>
            </div>

            {/* Bar */}
            <div className="h-1.5 bg-tcell-surface2 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-tcell-accent"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              />
            </div>
          </div>

          {/* Next level */}
          <div className="shrink-0 w-9 h-9 rounded-xl bg-tcell-surface border border-tcell-surface2 flex items-center justify-center">
            <span className="text-sm font-bold text-tcell-muted leading-none">{nextLevel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
