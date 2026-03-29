'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Zap, Gift, Trophy, ChevronRight, Star } from 'lucide-react'
import { useTPassStore } from '@/store/tpassStore'

const steps = [
  {
    icon: <Zap className="w-5 h-5" />,
    color: 'from-[#FBBF24] to-[#F59E0B]',
    bg: 'bg-[#FBBF24]/10',
    label: 'Выполняй квесты',
    desc: 'Ежедневные и сезонные задания за XP',
  },
  {
    icon: <Trophy className="w-5 h-5" />,
    color: 'from-[#8B6FBB] to-[#6B4FA0]',
    bg: 'bg-[#8B6FBB]/10',
    label: 'Расти в уровнях',
    desc: 'Каждые 100 XP = новый уровень',
  },
  {
    icon: <Gift className="w-5 h-5" />,
    color: 'from-[#34D399] to-[#059669]',
    bg: 'bg-[#34D399]/10',
    label: 'Получай награды',
    desc: 'Интернет, минуты, кешбэк и бонусы',
  },
]

export function OnboardingScreen() {
  const [current, setCurrent] = useState(0)
  const completeOnboarding = useTPassStore((s) => s.completeOnboarding)
  const isPremium = useTPassStore((s) => s.isPremium)

  const isLast = current === 1

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col bg-tcell-bg"
      style={{ height: '100dvh' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22 }}
    >
      {/* Safe-area top + dots */}
      <div
        className="flex justify-center gap-2 pt-3 pb-2 shrink-0"
        style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top))' }}
      >
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 rounded-full bg-tcell-accent"
            animate={{ width: i === current ? 24 : 8, opacity: i === current ? 1 : 0.3 }}
            transition={{ duration: 0.22 }}
          />
        ))}
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center px-5 py-4">
        <AnimatePresence mode="wait">
          {current === 0 ? (
            <motion.div
              key="slide-0"
              className="flex flex-col items-center w-full"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {/* Logo visual */}
              <div className="relative flex items-center justify-center w-32 h-32 mb-6 shrink-0">
                <div className="absolute inset-0 rounded-full bg-tcell-accent/20 animate-pulse" />
                <div className="absolute inset-3 rounded-full bg-tcell-accent/15 animate-pulse [animation-delay:300ms]" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-tcell-accent to-[#6B4FA0] flex items-center justify-center shadow-[0_0_32px_rgba(139,111,187,0.5)]">
                  <span className="text-3xl font-black text-white tracking-tight">T</span>
                </div>
                {/* Floating chips */}
                <motion.div
                  className="absolute -top-1 right-0 bg-tcell-gold text-black text-[11px] font-bold px-2 py-0.5 rounded-full shadow-lg"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  +50 XP
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 left-0 bg-tcell-accent text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-lg"
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  Ур. 5
                </motion.div>
              </div>

              {/* Badge */}
              <span className="text-[11px] font-semibold text-tcell-accent-light bg-tcell-accent/15 px-3 py-1 rounded-full mb-3 shrink-0">
                🌸 Наврўз 2026
              </span>

              {/* Title */}
              <h1 className="text-[28px] font-black text-center leading-[1.15] mb-3 text-tcell-fg">
                Добро пожаловать{'\n'}в Tpass
              </h1>

              {/* Subtitle */}
              <p className="text-sm text-center text-tcell-fg2 max-w-[260px] leading-relaxed">
                Battle Pass от Tcell — твоя программа лояльности нового поколения
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="slide-1"
              className="flex flex-col items-center w-full"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {/* Badge */}
              <span className="text-[11px] font-semibold text-tcell-accent-light bg-tcell-accent/15 px-3 py-1 rounded-full mb-3 shrink-0">
                3 простых шага
              </span>

              {/* Title */}
              <h1 className="text-[28px] font-black text-center leading-[1.15] mb-5 text-tcell-fg">
                Как это{'\n'}работает?
              </h1>

              {/* Steps */}
              <div className="w-full space-y-2.5">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    className={`flex items-center gap-3.5 ${step.bg} rounded-2xl px-4 py-3`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.18 }}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                      {step.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-tcell-fg leading-tight">{step.label}</p>
                      <p className="text-xs text-tcell-fg2 mt-0.5 leading-tight">{step.desc}</p>
                    </div>
                    <span className="ml-auto text-xs font-black text-tcell-accent/40 shrink-0">{i + 1}</span>
                  </motion.div>
                ))}
              </div>

              {/* Premium hint */}
              {!isPremium && (
                <motion.div
                  className="mt-3 w-full flex items-center gap-2 bg-gradient-to-r from-tcell-accent/20 to-tcell-gold/10 rounded-2xl px-4 py-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.32 }}
                >
                  <Star className="w-4 h-4 text-tcell-gold shrink-0" />
                  <p className="text-xs text-tcell-fg2 leading-tight">
                    С <span className="text-tcell-accent-light font-bold">Premium</span> — двойные награды и AI Coach
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA — safe-area aware */}
      <div
        className="px-5 pb-8 pt-3 flex flex-col gap-2.5 shrink-0"
        style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
      >
        <motion.button
          className="w-full h-14 bg-gradient-to-r from-tcell-accent to-[#6B4FA0] text-white font-bold text-[15px] rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(139,111,187,0.35)] active:opacity-90 touch-manipulation"
          whileTap={{ scale: 0.97 }}
          onClick={() => isLast ? completeOnboarding() : setCurrent(1)}
        >
          {isLast ? 'Начать играть' : 'Далее'}
          <ChevronRight className="w-5 h-5" />
        </motion.button>

        {!isLast && (
          <button
            className="text-sm text-tcell-fg3 text-center py-2 touch-manipulation"
            onClick={completeOnboarding}
          >
            Пропустить
          </button>
        )}
      </div>
    </motion.div>
  )
}
