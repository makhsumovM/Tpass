'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Bot, Zap, Bell, Mic, CalendarDays } from 'lucide-react'
import { useTPassStore } from '@/store/tpassStore'

const FEATURES = [
  { icon: Mic,          text: 'Голосовой и текстовый ввод цели' },
  { icon: CalendarDays, text: 'Расписание на недели и месяцы' },
  { icon: Bell,         text: 'Уведомления в нужное время' },
]

export function AiCoachGate({ children }: { children: React.ReactNode }) {
  const { isPremium, openPremiumModal, setPremium } = useTPassStore()

  return (
    <div className="relative">
      <div className={isPremium ? undefined : 'pointer-events-none select-none'}>
        {children}
      </div>

      <AnimatePresence>
        {!isPremium && (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 py-10"
            style={{ minHeight: '100dvh' }}
          >
            {/* Blur backdrop */}
            <div className="absolute inset-0 backdrop-blur-md bg-[#0D0D0F]/85" />

            <div className="relative flex flex-col items-center text-center gap-5 w-full max-w-xs">
              {/* Bot icon with glow ring */}
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full bg-tcell-accent/30"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
                <div className="relative w-20 h-20 rounded-full flex items-center justify-center bg-linear-to-br from-tcell-accent/40 to-[#9B4FD4]/40 border border-tcell-accent/30">
                  <Bot size={36} className="text-tcell-accent-light" />
                </div>
              </div>

              {/* Title */}
              <div>
                <p className="text-xl font-black text-white mb-1">AI Коуч</p>
                <p className="text-sm text-white/50">Доступно для Premium-пользователей</p>
              </div>

              {/* Features */}
              <div className="w-full space-y-3">
                {FEATURES.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-tcell-accent/20 shrink-0">
                      <Icon size={15} className="text-tcell-accent-light" />
                    </div>
                    <span className="text-sm text-white/80 text-left">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                onClick={openPremiumModal}
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
                  Активировать Premium
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
