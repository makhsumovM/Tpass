'use client'

import { motion } from 'motion/react'
import { Zap } from 'lucide-react'
import { useTPassStore } from '@/store/tpassStore'

export function BottomActions() {
  const { isPremium, openPremiumModal } = useTPassStore()

  if (isPremium) return null

  return (
    <div className="sticky bottom-0 z-50">
      <div className="absolute inset-0 bg-tcell-bg/95 backdrop-blur-xl light:border-t light:border-tcell-surface2" />
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-tcell-surface2 to-transparent" />

      <div className="relative px-4 py-3 pb-5">
        {/* Premium CTA — full width */}
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
      </div>
    </div>
  )
}
