'use client'

import { motion } from 'motion/react'
import { Crown, Sparkles, Check, Zap } from 'lucide-react'
import { useTPassStore } from '@/store/tpassStore'

const PERKS = [
  'Эксклюзивные награды на каждом уровне',
  'Премиум квесты с двойным XP',
  'Специальная тема Наврўза',
]

export function PremiumBanner() {
  const { isPremium, openPremiumModal, setPremium } = useTPassStore()

  if (isPremium) {
    return (
      <div className="mx-4 my-3 rounded-2xl border border-yellow-400/25 bg-linear-to-r from-tcell-accent/15 to-yellow-400/8 p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-tcell-accent/40 to-yellow-400/20 flex items-center justify-center shrink-0">
          <Crown size={17} className="text-yellow-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-tcell-fg">Tcell Pass активен ✓</p>
          <p className="text-xs text-tcell-muted">Все награды и квесты разблокированы</p>
        </div>
        <button onClick={() => setPremium(false)} className="text-[10px] text-tcell-fg3 hover:text-tcell-fg2 transition-colors">
          Откл.
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mx-4 my-3 overflow-hidden rounded-2xl cursor-pointer"
      onClick={openPremiumModal}
    >
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-linear-to-br from-[#3D2065] via-[#2A1550] to-[#1A0D35]" />
      <div className="absolute inset-0 bg-linear-to-r from-tcell-accent/25 via-transparent to-yellow-400/15" />

      {/* Shimmer */}
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/6 to-transparent -skew-x-12"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      />

      {/* Border glow */}
      <div className="absolute inset-0 rounded-2xl border border-yellow-400/20 shadow-[0_0_20px_rgba(212,160,23,0.15)]" />

      {/* Sparkle */}
      <motion.div
        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-3 right-4 opacity-50"
      >
        <Sparkles size={15} className="text-yellow-400" />
      </motion.div>

      <div className="relative p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-yellow-400/30 to-tcell-accent/30 flex items-center justify-center">
            <Zap size={15} className="text-yellow-400" fill="currentColor" />
          </div>
          <div>
            <p className="text-sm font-black text-white tracking-wide">TCELL PASS</p>
            <p className="text-[10px] text-yellow-400/70 font-medium">Разблокируй весь Наврўз</p>
          </div>
          <div className="ml-auto bg-yellow-400/15 border border-yellow-400/30 rounded-full px-2.5 py-0.5">
            <span className="text-[10px] font-black text-yellow-400">19 с/мес</span>
          </div>
        </div>

        <div className="space-y-1.5 mb-3">
          {PERKS.map((perk) => (
            <div key={perk} className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400/20 flex items-center justify-center shrink-0">
                <Check size={8} className="text-yellow-400" />
              </div>
              <span className="text-xs text-white/70">{perk}</span>
            </div>
          ))}
        </div>

        <motion.div
          whileTap={{ scale: 0.97 }}
          className="relative overflow-hidden rounded-xl py-2.5 text-center font-black text-sm text-white"
        >
          <div className="absolute inset-0 bg-linear-to-r from-tcell-accent via-[#9B4FD4] to-yellow-500" />
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1 }}
          />
          <span className="relative flex items-center justify-center gap-2">
            <Crown size={14} />
            ПОДКЛЮЧИТЬ TCELL PASS
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}
