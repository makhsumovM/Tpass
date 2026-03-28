'use client'

import { motion } from 'motion/react'
import { Check, Zap } from 'lucide-react'
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
      <div className="mx-4 my-3 rounded-2xl border border-amber-400/25 bg-linear-to-r from-tcell-accent/15 to-amber-400/8 p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-tcell-accent/40 to-amber-400/20 flex items-center justify-center shrink-0">
          <Crown size={17} className="text-amber-400" />
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
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 my-3 rounded-2xl border border-amber-400/20 bg-tcell-card overflow-hidden cursor-pointer"
      onClick={openPremiumModal}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center">
              <Zap size={15} className="text-amber-400" fill="currentColor" />
            </div>
            <div>
              <p className="text-sm font-bold text-tcell-fg">Tcell Pass</p>
              <p className="text-[11px] text-tcell-muted">Разблокируй весь Наврўз</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2.5 py-0.5">
            19 с/мес
          </span>
        </div>

        <div className="space-y-1.5 mb-3">
          {PERKS.map((perk) => (
            <div key={perk} className="flex items-center gap-2">
              <Check size={11} className="text-amber-400/70 shrink-0" />
              <span className="text-xs text-tcell-fg2">{perk}</span>
            </div>
          ))}
        </div>

        <motion.div
          whileTap={{ scale: 0.98 }}
          className="rounded-xl py-2.5 text-center font-semibold text-sm text-white bg-tcell-accent"
        >
          Подключить Tcell Pass
        </motion.div>
      </div>
    </motion.div>
  )
}
