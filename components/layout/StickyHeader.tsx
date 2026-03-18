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
      {/* Layered background */}
      <div className="absolute inset-0 bg-tcell-bg" />
      <div className="absolute inset-0 bg-linear-to-b from-tcell-accent/14 via-tcell-accent/4 to-transparent" />

      {/* Top shine */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
      {/* Bottom accent line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-tcell-accent/60 to-transparent" />

      <div className="relative px-4 pt-3 pb-4 space-y-3">
        {/* ── Row 1: Season info ── */}
        <div className="flex items-center justify-between">
          {/* Season name + date range */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-black text-tcell-fg tracking-wide truncate">
              {seasonName}
            </span>
            <span className="shrink-0 text-[10px] font-medium text-tcell-fg3 bg-tcell-surface rounded-full px-2 py-0.5 border border-tcell-surface2">
              Март — Апрель
            </span>
          </div>

          {/* Timer + theme toggle */}
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <div className="flex items-center gap-1.5 bg-tcell-surface border border-tcell-surface2 rounded-full px-2.5 py-1">
              <Timer size={10} className="text-tcell-accent-light" />
              <span className="text-[11px] font-bold text-tcell-fg2 tabular-nums">{countdown}</span>
            </div>
            <button
              onClick={toggleTheme}
              className="w-7 h-7 rounded-full bg-tcell-surface border border-tcell-surface2 flex items-center justify-center text-tcell-muted hover:text-tcell-accent-light transition-colors"
            >
              {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
            </button>
          </div>
        </div>

        {/* ── Row 2: Level + XP bar + Next level ── */}
        <div className="flex items-center gap-3">
          {/* Current level badge */}
          <div className="relative shrink-0">
            <div className="w-13 h-13 rounded-2xl bg-linear-to-br from-tcell-accent-light via-tcell-accent to-[#4A2080] flex flex-col items-center justify-center shadow-[0_4px_16px_rgba(139,111,187,0.45)] border border-tcell-accent-light/30 overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={currentLevel}
                  initial={{ y: 16, opacity: 0, scale: 0.7 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -16, opacity: 0, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className="relative text-lg font-black text-white leading-none select-none"
                >
                  {currentLevel}
                </motion.span>
              </AnimatePresence>
              <span className="relative text-[7px] font-black text-white/55 uppercase tracking-widest mt-0.5">
                УР.
              </span>
            </div>
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl border border-tcell-accent-light/35"
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>

          {/* XP bar + numbers */}
          <div className="flex-1 space-y-1.5">
            {/* Numbers row */}
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[10px] font-bold text-tcell-muted uppercase tracking-wider">
                Опыт
              </span>
              <span className="text-[11px] font-black text-tcell-fg tabular-nums">
                {currentXp}
                <span className="text-tcell-muted font-medium"> / {xpPerLevel} XP</span>
              </span>
            </div>

            {/* Bar */}
            <div className="relative h-4 bg-tcell-surface2 rounded-full overflow-hidden light:bg-black/[0.08]">
              {/* Top shine on bar track */}
              <div className="absolute top-0 inset-x-0 h-px bg-white/12 z-10" />

              {/* Fill */}
              <motion.div
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, #8B6FBB 0%, #A98FE0 60%, #C4A8F0 100%)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              >
                {/* Top shine on fill */}
                <div className="absolute top-0 inset-x-0 h-px bg-white/50" />
                <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-b from-white/15 to-transparent" />
              </motion.div>
            </div>
          </div>

          {/* Next level badge */}
          <div className="shrink-0">
            <div className="w-10 h-10 rounded-xl bg-tcell-surface border border-tcell-surface2 flex flex-col items-center justify-center light:bg-black/[0.04]">
              <span className="text-sm font-black text-tcell-muted leading-none">{nextLevel}</span>
              <span className="text-[7px] font-black text-tcell-muted/50 uppercase tracking-widest mt-0.5">
                НСТ.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
