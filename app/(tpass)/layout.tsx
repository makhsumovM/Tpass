'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { StickyHeader } from '@/components/layout/StickyHeader'
import { TabBar } from '@/components/layout/TabBar'
import { BottomActions } from '@/components/layout/BottomActions'
import { PremiumModal } from '@/components/track/PremiumModal'
import { XpToast } from '@/components/layout/XpToast'
import { ReminderToast } from '@/components/ai-coach/ReminderToast'
import { OnboardingScreen } from '@/components/layout/OnboardingScreen'
import { useTPassStore } from '@/store/tpassStore'
import { useAiCoachStore } from '@/store/aiCoachStore'

export default function TPassLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const theme = useTPassStore((s) => s.theme)
  const onboarded = useTPassStore((s) => s.onboarded)
  const { activePlan, setReminderToast } = useAiCoachStore()

  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  // In-app reminder: check every minute for tasks due in ~5 min
  useEffect(() => {
    if (!activePlan) return

    const check = () => {
      const now = Date.now()
      const fiveMin = 5 * 60 * 1000

      for (const week of activePlan.weeks) {
        for (const task of week.tasks) {
          if (!task.notificationEnabled || task.completed) continue

          const [h, m] = task.time.split(':').map(Number)
          const taskDate = new Date(task.date + 'T00:00:00')
          taskDate.setHours(h, m, 0, 0)
          const diff = taskDate.getTime() - now

          if (diff > 0 && diff <= fiveMin) {
            const minutesUntil = Math.round(diff / 60000)
            setReminderToast({ taskId: task.id, taskTitle: task.title, taskTime: task.time, minutesUntil })
            return
          }
        }
      }
    }

    check()
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [activePlan, setReminderToast])

  return (
    <div className="flex flex-col min-h-screen bg-tcell-bg">
      {/* Sticky top: XP header + tabs */}
      <div className="sticky top-0 z-50 bg-tcell-bg">
        <StickyHeader />
        <TabBar />
      </div>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Fixed bottom buttons */}
      <BottomActions />

      {/* Global overlays */}
      <PremiumModal />
      <XpToast />
      <ReminderToast />

      {/* Onboarding — shown once on first launch */}
      <AnimatePresence>
        {!onboarded && <OnboardingScreen />}
      </AnimatePresence>
    </div>
  )
}
