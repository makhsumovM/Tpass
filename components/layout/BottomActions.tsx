'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Zap, RotateCcw } from 'lucide-react'
import { useTPassStore } from '@/store/tpassStore'

export function BottomActions() {
  const { isPremium, openPremiumModal, resetProgress } = useTPassStore()
  const [confirming, setConfirming] = useState(false)

  function handleResetClick() {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
      return
    }
    resetProgress()
    setConfirming(false)
  }

  return (
    <div className="sticky bottom-0 z-50">
      <div className="absolute inset-0 bg-tcell-bg/95 backdrop-blur-xl light:border-t light:border-tcell-surface2" />
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-tcell-surface2 to-transparent" />

      <div className="relative px-4 pt-3 pb-5 flex flex-col gap-2">
        {/* Premium CTA — только для не-премиум */}
        {!isPremium && (
          <motion.button
            onClick={openPremiumModal}
            whileTap={{ scale: 0.97 }}
            className="relative w-full overflow-hidden rounded-2xl py-3.5 font-black text-sm text-white shadow-lg shadow-amber-500/25"
          >
            <div className="absolute inset-0 bg-linear-to-r from-amber-500 via-orange-400 to-amber-400" />
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent -skew-x-12"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
            />
            <span className="relative flex items-center justify-center gap-2">
              <Zap size={15} fill="currentColor" />
              Premium — 19 с/мох
            </span>
          </motion.button>
        )}

        {/* Сброс прогресса — для демо */}
        <button
          onClick={handleResetClick}
          className="flex items-center justify-center gap-1.5 py-1.5 touch-manipulation"
        >
          <RotateCcw size={12} className={confirming ? 'text-red-400' : 'text-tcell-fg3'} />
          <AnimatePresence mode="wait">
            {confirming ? (
              <motion.span
                key="confirm"
                className="text-xs font-semibold text-red-400"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                Нажми ещё раз для сброса
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                className="text-xs text-tcell-fg3"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                Сбросить прогресс
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}
