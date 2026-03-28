// AI Coach Service Worker — background notifications
const CACHE_NAME = 'tpass-v1'

/** @type {Map<string, {taskId: string, title: string, body: string, scheduledAt: number}>} */
const pendingNotifications = new Map()

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

// Client posts messages to schedule/cancel notifications
self.addEventListener('message', (event) => {
  const { type, taskId, title, body, scheduledAt } = event.data ?? {}

  if (type === 'SCHEDULE_NOTIFICATION' && taskId) {
    pendingNotifications.set(taskId, { taskId, title, body, scheduledAt })
  }

  if (type === 'CANCEL_NOTIFICATION' && taskId) {
    pendingNotifications.delete(taskId)
  }
})

// Poll every 60 seconds for due notifications
setInterval(() => {
  const now = Date.now()
  pendingNotifications.forEach((notif, id) => {
    if (now >= notif.scheduledAt) {
      self.registration.showNotification(notif.title, {
        body: notif.body,
        icon: '/icon-192.png',
        badge: '/icon-72.png',
        tag: id,
        data: { taskId: id },
        requireInteraction: false,
      })
      pendingNotifications.delete(id)
    }
  })
}, 60_000)

// Click on notification — open app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes('/ai-coach'))
      if (existing) return existing.focus()
      return self.clients.openWindow('/ai-coach')
    }),
  )
})
