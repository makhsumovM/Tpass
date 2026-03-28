'use client'

import { useCallback, useEffect } from 'react'
import { useAiCoachStore } from '@/store/aiCoachStore'
import type { ScheduledTask } from '@/types/aiCoach'

function isIosNonPwa(): boolean {
  if (typeof window === 'undefined') return false
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isStandalone = 'standalone' in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true
  return isIos && !isStandalone
}

async function getSW(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null
  try {
    return await navigator.serviceWorker.ready
  } catch {
    return null
  }
}

export function useNotifications() {
  const { notificationPermission, setNotificationPermission } = useAiCoachStore()

  // Sync real browser permission on mount
  useEffect(() => {
    if (isIosNonPwa()) {
      setNotificationPermission('unsupported')
      return
    }
    if (!('Notification' in window)) {
      setNotificationPermission('unsupported')
      return
    }
    setNotificationPermission(Notification.permission)
  }, [setNotificationPermission])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) return false
    if (isIosNonPwa()) return false

    const result = await Notification.requestPermission()
    setNotificationPermission(result)
    return result === 'granted'
  }, [setNotificationPermission])

  const scheduleNotification = useCallback(async (task: ScheduledTask) => {
    if (notificationPermission !== 'granted') return

    const sw = await getSW()
    if (!sw) return

    // Parse task date + time → epoch ms
    const [h, m] = task.time.split(':').map(Number)
    const taskDate = new Date(task.date + 'T00:00:00')
    taskDate.setHours(h, m, 0, 0)
    const scheduledAt = taskDate.getTime()

    if (scheduledAt <= Date.now()) return // Already passed

    sw.active?.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      taskId: task.id,
      title: `⏰ ${task.title}`,
      body: `${task.time} · ${task.durationMinutes} мин`,
      scheduledAt,
    })
  }, [notificationPermission])

  const cancelNotification = useCallback(async (taskId: string) => {
    const sw = await getSW()
    sw?.active?.postMessage({ type: 'CANCEL_NOTIFICATION', taskId })
  }, [])

  return {
    permission: notificationPermission,
    requestPermission,
    scheduleNotification,
    cancelNotification,
    isSupported: notificationPermission !== 'unsupported',
  }
}
