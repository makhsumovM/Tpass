'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bell } from 'lucide-react'
import { useAiCoachStore } from '@/store/aiCoachStore'

export function ReminderToast() {
  const { reminderToast, setReminderToast } = useAiCoachStore()

  useEffect(() => {
    if (!reminderToast) return
    const t = setTimeout(() => setReminderToast(null), 6000)
    return () => clearTimeout(t)
  }, [reminderToast, setReminderToast])

  return (
    <AnimatePresence>
      {reminderToast && (
        <motion.div
          key={reminderToast.taskId}
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed inset-x-4 bottom-28 z-60 mx-auto max-w-[400px] overflow-hidden rounded-3xl shadow-2xl"
          onClick={() => setReminderToast(null)}
        >
          <div className="absolute inset-0 bg-[#0F0820]/97 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-linear-to-b from-tcell-accent/15 to-transparent" />
          <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-tcell-accent/50 to-transparent" />

          {/* Auto-close bar */}
          <motion.div className="absolute bottom-0 inset-x-0 h-0.5 bg-tcell-accent/15">
            <motion.div
              className="h-full bg-tcell-accent-light/70 rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 6, ease: 'linear' }}
            />
          </motion.div>

          <div className="relative px-5 py-4 flex items-center gap-4">
            <motion.div
              className="w-11 h-11 rounded-full flex items-center justify-center bg-tcell-accent/25 border border-tcell-accent/40 shrink-0"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, repeat: 2 }}
            >
              <Bell size={20} className="text-tcell-accent-light" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-snug">{reminderToast.taskTitle}</p>
              <p className="text-xs text-white/50 mt-0.5">
                {reminderToast.taskTime} · через {reminderToast.minutesUntil} мин
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
