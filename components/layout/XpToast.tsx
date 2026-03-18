'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ChevronUp } from 'lucide-react'
import { useTPassStore } from '@/store/tpassStore'
import Link from 'next/link'

export function XpToast() {
  const { xpToast, clearXpToast, xpPerLevel } = useTPassStore()

  useEffect(() => {
    if (!xpToast) return
    const t = setTimeout(clearXpToast, 4000)
    return () => clearTimeout(t)
  }, [xpToast, clearXpToast])

  return (
    <AnimatePresence>
      {xpToast && (
        <motion.div
          key="xp-toast"
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed inset-x-4 bottom-28 z-60 mx-auto max-w-[400px] overflow-hidden rounded-3xl shadow-2xl"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-[#0F0820]/97 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-linear-to-b from-tcell-accent/20 to-transparent" />
          <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-tcell-accent/60 to-transparent" />

          {/* Auto-close countdown bar */}
          <motion.div
            key={xpToast.questTitle}
            className="absolute bottom-0 inset-x-0 h-0.5 bg-tcell-accent/15"
          >
            <motion.div
              className="h-full bg-tcell-accent-light/70 rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 4, ease: 'linear' }}
            />
          </motion.div>

          <div className="relative px-5 py-5 text-center">
            {/* Confetti emoji */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, delay: 0.1 }}
              className="text-4xl mb-3"
            >
              🎉
            </motion.div>

            {/* Level-up badge */}
            <AnimatePresence>
              {xpToast.toLevel > xpToast.fromLevel && (
                <motion.div
                  initial={{ scale: 0, y: 10, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 22, delay: 0.1 }}
                  className="inline-flex items-center gap-1.5 bg-tcell-accent/25 border border-tcell-accent-light/40 rounded-full px-3 py-1 mb-3"
                >
                  <ChevronUp size={13} className="text-tcell-accent-light" strokeWidth={2.5} />
                  <span className="text-xs font-black text-tcell-accent-light tracking-wide uppercase">
                    Уровень {xpToast.fromLevel} → {xpToast.toLevel}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* XP amount */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-black text-white mb-0.5"
            >
              +{xpToast.amount} XP гирифтед!
            </motion.p>

            {/* Quest title */}
            <p className="text-sm text-white/50 mb-4">
              Вазифа «{xpToast.questTitle}» иҷро шуд ✓
            </p>

            {/* XP bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-white/40 mb-1.5">
                <span>{xpToast.fromXp} XP</span>
                <span>{xpToast.toXp} XP</span>
              </div>
              <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-linear-to-r from-tcell-accent to-tcell-accent-light"
                  initial={{ width: `${(xpToast.fromXp / xpPerLevel) * 100}%` }}
                  animate={{ width: `${(xpToast.toXp / xpPerLevel) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/track"
              onClick={clearXpToast}
              className="inline-flex items-center gap-2 w-full justify-center bg-tcell-accent rounded-2xl py-3 text-sm font-bold text-white"
            >
              Чоизаҳоро бубин
              <ArrowRight size={15} />
            </Link>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
