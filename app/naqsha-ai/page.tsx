'use client'

import { Sparkles, Sun, Moon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { AiCoachGate } from '@/components/ai-coach/AiCoachGate'
import { AiCoachTabs } from '@/components/ai-coach/AiCoachTabs'
import { CalendarView } from '@/components/ai-coach/CalendarView'
import { ChatView } from '@/components/ai-coach/ChatView'
import { GoalsView } from '@/components/ai-coach/GoalsView'
import { NotificationBanner } from '@/components/ai-coach/NotificationBanner'
import { useAiCoachStore } from '@/store/aiCoachStore'
import { useTPassStore } from '@/store/tpassStore'

export default function NaqshaAiPage() {
  const { activeTab } = useAiCoachStore()
  const { theme, toggleTheme } = useTPassStore()

  return (
    <AiCoachGate>
      <div className="flex flex-col" style={{ minHeight: '100dvh' }}>
        {/* Page header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-tcell-accent/15 border border-tcell-accent/20">
                <Sparkles size={17} className="text-tcell-accent-light" />
              </div>
              <div>
                <p className="text-sm font-bold text-tcell-fg">Naqsha AI</p>
                <p className="text-[11px] text-tcell-muted">Персональный планировщик</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full bg-tcell-surface border border-tcell-surface2 flex items-center justify-center text-tcell-muted transition-colors"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>

          <NotificationBanner />
          <AiCoachTabs />
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                className="h-full flex flex-col"
              >
                <ChatView />
              </motion.div>
            ) : activeTab === 'goals' ? (
              <motion.div
                key="goals"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
              >
                <GoalsView />
              </motion.div>
            ) : (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
              >
                <CalendarView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AiCoachGate>
  )
}
