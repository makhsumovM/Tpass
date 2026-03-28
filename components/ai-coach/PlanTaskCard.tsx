'use client'

import { motion } from 'motion/react'
import { useState } from 'react'
import { Bell, BellOff, Check, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAiCoachStore } from '@/store/aiCoachStore'
import { useTPassStore } from '@/store/tpassStore'
import { useNotifications } from '@/hooks/useNotifications'
import type { ScheduledTask } from '@/types/aiCoach'

const XP_PER_TASK = 15

interface PlanTaskCardProps {
  planId: string
  task: ScheduledTask
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function PlanTaskCard({ planId, task }: PlanTaskCardProps) {
  const { toggleTaskNotification, markTaskCompleted, updateTaskTime } = useAiCoachStore()
  const { addXp } = useTPassStore()
  const [editingTime, setEditingTime] = useState(false)
  const [timeValue, setTimeValue] = useState(task.time)
  const { scheduleNotification, cancelNotification, requestPermission, permission } =
    useNotifications()

  const handleNotificationToggle = async () => {
    if (!task.notificationEnabled) {
      // Request permission if needed
      if (permission === 'default' || permission === 'unknown') {
        await requestPermission()
      }
      scheduleNotification(task)
    } else {
      cancelNotification(task.id)
    }
    toggleTaskNotification(planId, task.id)
  }

  const handleComplete = () => {
    if (!task.completed) {
      markTaskCompleted(planId, task.id)
      addXp(XP_PER_TASK, task.title)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl border p-4 space-y-2 transition-colors',
        task.completed
          ? 'bg-white/3 border-white/5 opacity-60'
          : 'bg-tcell-surface border-tcell-surface2',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Time + title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {editingTime ? (
              <input
                type="time"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                onBlur={() => { updateTaskTime(planId, task.id, timeValue); setEditingTime(false) }}
                onKeyDown={(e) => { if (e.key === 'Enter') { updateTaskTime(planId, task.id, timeValue); setEditingTime(false) } }}
                autoFocus
                className="text-xs font-bold text-tcell-accent-light bg-tcell-accent/15 rounded-full px-2 py-0.5 w-20 outline-none border border-tcell-accent/40"
              />
            ) : (
              <button
                onClick={() => !task.completed && setEditingTime(true)}
                title="Изменить время"
                className="text-xs font-bold text-tcell-accent-light bg-tcell-accent/15 rounded-full px-2 py-0.5"
              >
                {task.time}
              </button>
            )}
            <div className="flex items-center gap-1 text-xs text-tcell-muted">
              <Clock size={10} />
              <span>{task.durationMinutes} мин</span>
            </div>
          </div>
          <p className={cn('text-sm font-semibold leading-snug', task.completed ? 'line-through text-tcell-muted' : 'text-tcell-fg')}>
            {task.title}
          </p>
          <p className="text-xs text-tcell-muted mt-0.5">{task.description}</p>
          <p className="text-[11px] text-tcell-muted/60 mt-1">{formatDate(task.date)}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          {/* Complete button */}
          <motion.button
            onClick={handleComplete}
            whileTap={{ scale: 0.85 }}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center border transition-colors',
              task.completed
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-white/5 border-white/10 text-tcell-muted',
            )}
          >
            <Check size={14} strokeWidth={2.5} />
          </motion.button>

          {/* Notification toggle */}
          <motion.button
            onClick={handleNotificationToggle}
            whileTap={{ scale: 0.85 }}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center border transition-colors',
              task.notificationEnabled
                ? 'bg-tcell-accent/20 border-tcell-accent/40 text-tcell-accent-light'
                : 'bg-white/5 border-white/10 text-tcell-muted',
            )}
          >
            {task.notificationEnabled ? <Bell size={13} /> : <BellOff size={13} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
