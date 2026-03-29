'use client'

import { AnimatePresence, motion } from 'motion/react'
import { X, Zap, Check, Star, Sparkles, CalendarDays, Bell, Mic } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTPassStore } from '@/store/tpassStore'

const TPASS_FREE_PERKS = ['Стандартный XP', '2 задания / день', 'Базовый трек', 'Основные награды']
const TPASS_PREM_PERKS = ['XP ×2 всегда', '+2 задания / день', 'Каждые 2 уровня кусок', 'Золотые награды']

const NAQSHA_FEATURES = [
  { icon: Mic,          text: 'Голосовой и текстовый ввод цели' },
  { icon: CalendarDays, text: 'AI расписание на недели вперёд' },
  { icon: Bell,         text: 'Уведомления за 5 мин до задачи' },
]

export function PremiumModal() {
  const { premiumModalOpen, closePremiumModal, setPremium } = useTPassStore()
  const pathname = usePathname()
  const isNaqsha = pathname.startsWith('/naqsha-ai')

  return (
    <AnimatePresence>
      {premiumModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePremiumModal}
            className="fixed inset-0 z-[100] bg-black/80"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={isNaqsha ? 'Naqsha AI Premium' : 'Tcell Premium Pass'}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed bottom-0 inset-x-0 z-[101] mx-auto max-w-[430px] overflow-hidden rounded-t-3xl"
          >
            {/* Background */}
            <div className={`absolute inset-0 ${isNaqsha ? 'bg-[#0D0A1F]' : 'bg-[#110820]'}`} />
            <div className={`absolute inset-0 bg-linear-to-b ${isNaqsha ? 'from-[#1A0A3A]/90 via-[#0D0A1F] to-[#0D0A1F]' : 'from-[#2A1550]/80 via-[#110820] to-[#110820]'}`} />

            {/* Top accent line */}
            <div className={`absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent ${isNaqsha ? 'via-violet-400/70' : 'via-amber-400/60'} to-transparent`} />

            {/* Naqsha AI: subtle particle glow */}
            {isNaqsha && (
              <>
                <motion.div
                  className="absolute top-6 right-8 w-24 h-24 rounded-full bg-violet-500/10 blur-2xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="absolute top-10 left-6 w-16 h-16 rounded-full bg-purple-400/10 blur-xl"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                />
              </>
            )}

            <div className="relative p-5">
              {/* Drag handle */}
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

              {/* Close */}
              <button
                onClick={closePremiumModal}
                aria-label="Закрыть"
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/8 flex items-center justify-center"
              >
                <X size={15} className="text-white/60" />
              </button>

              {isNaqsha ? (
                /* ── NAQSHA AI VARIANT ── */
                <>
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center bg-linear-to-br from-violet-500/30 to-purple-700/30 border border-violet-400/25">
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-violet-400/10"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <Sparkles size={22} className="relative text-violet-300" />
                    </div>
                    <div>
                      <p className="text-base font-black text-white">Naqsha AI Premium</p>
                      <p className="text-xs text-white/50">Полный доступ к AI-планировщику</p>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-3 mb-6">
                    {NAQSHA_FEATURES.map(({ icon: Icon, text }) => (
                      <motion.div
                        key={text}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 bg-white/5 border border-violet-400/10 rounded-2xl px-4 py-3"
                      >
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-violet-500/20 shrink-0">
                          <Icon size={15} className="text-violet-300" />
                        </div>
                        <span className="text-sm text-white/80">{text}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="text-center mb-5">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-black text-white">19</span>
                      <span className="text-xl font-black text-white">с.</span>
                      <span className="text-sm text-white/40 ml-1">/ мес</span>
                    </div>
                    <p className="text-xs text-white/30 mt-0.5">Отменить можно в любое время</p>
                  </div>

                  {/* CTA */}
                  <motion.button
                    onClick={() => setPremium(true)}
                    whileTap={{ scale: 0.97 }}
                    className="relative w-full overflow-hidden rounded-2xl py-4 font-black text-sm tracking-wide text-white shadow-xl shadow-violet-900/40"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-violet-600 via-purple-500 to-violet-400" />
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1 }}
                    />
                    <span className="relative flex items-center justify-center gap-2">
                      <Sparkles size={16} />
                      Активировать Naqsha AI
                    </span>
                  </motion.button>
                </>
              ) : (
                /* ── TPASS VARIANT ── */
                <>
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-linear-to-br from-amber-400/30 to-tcell-accent/30 border border-amber-400/25">
                      <Zap size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-base font-black text-white">Tcell Premium Pass</p>
                      <p className="text-xs text-white/50">Каждый месяц — XP ×2 + редкие квесты</p>
                    </div>
                  </div>

                  {/* Free vs Premium comparison */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {/* Free */}
                    <div className="rounded-2xl border border-white/8 bg-white/4 p-3 space-y-2">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">FREE</p>
                      {TPASS_FREE_PERKS.map((p) => (
                        <div key={p} className="flex items-start gap-2">
                          <Check size={11} className="text-white/30 mt-0.5 shrink-0" />
                          <span className="text-[11px] text-white/50 leading-tight">{p}</span>
                        </div>
                      ))}
                    </div>

                    {/* Premium */}
                    <div className="relative rounded-2xl border border-amber-400/30 bg-amber-400/5 p-3 space-y-2 overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-linear-to-r from-transparent via-amber-400/8 to-transparent -skew-x-12"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                      />
                      <div className="relative flex items-center gap-1.5 mb-0.5">
                        <Zap size={9} className="text-amber-400" />
                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Premium</p>
                      </div>
                      {TPASS_PREM_PERKS.map((p) => (
                        <div key={p} className="relative flex items-start gap-2">
                          <Star size={11} fill="currentColor" className="text-amber-400 mt-0.5 shrink-0" />
                          <span className="text-[11px] text-white/90 leading-tight font-medium">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-black text-white">19</span>
                      <span className="text-xl font-black text-white">с.</span>
                      <span className="text-sm text-white/40 ml-1">/ мес</span>
                    </div>
                    <p className="text-xs text-white/30 mt-0.5">Отменить можно в любое время</p>
                  </div>

                  {/* CTA */}
                  <motion.button
                    onClick={() => setPremium(true)}
                    whileTap={{ scale: 0.97 }}
                    className="relative w-full overflow-hidden rounded-2xl py-4 font-black text-sm tracking-wide text-white shadow-xl"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-tcell-accent via-[#9B4FD4] to-amber-500" />
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.8 }}
                    />
                    <span className="relative flex items-center justify-center gap-2">
                      <Zap size={16} fill="currentColor" />
                      Premium фаъол кун
                    </span>
                  </motion.button>
                </>
              )}

              {/* Later */}
              <button
                onClick={closePremiumModal}
                className="w-full py-3 text-sm text-white/35 hover:text-white/60 transition-colors"
              >
                Баъдтар
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
