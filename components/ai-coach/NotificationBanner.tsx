'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Bell, X, Smartphone } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import { useAiCoachStore } from '@/store/aiCoachStore'

export function NotificationBanner() {
  const { permission, requestPermission, isSupported } = useNotifications()
  const { notificationPermission } = useAiCoachStore()

  const showIosHint = notificationPermission === 'unsupported'
  const showPermissionRequest = isSupported && permission === 'default'

  return (
    <AnimatePresence>
      {showIosHint && (
        <motion.div
          key="ios-hint"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden mb-3"
        >
          <div className="flex items-start gap-3 bg-amber-400/10 border border-amber-400/25 rounded-2xl px-3 py-2.5">
            <Smartphone size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300/90 leading-relaxed">
              Для уведомлений добавь приложение на рабочий стол: Safari → «Поделиться» → «На экран Домой»
            </p>
          </div>
        </motion.div>
      )}

      {showPermissionRequest && (
        <motion.div
          key="perm-request"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden mb-3"
        >
          <div className="flex items-center gap-3 bg-tcell-accent/10 border border-tcell-accent/25 rounded-2xl px-3 py-2.5">
            <Bell size={14} className="text-tcell-accent-light shrink-0" />
            <p className="text-xs text-tcell-fg/80 flex-1">Разреши уведомления чтобы получать напоминания</p>
            <button
              onClick={requestPermission}
              className="text-xs font-bold text-tcell-accent-light shrink-0 bg-tcell-accent/20 px-2.5 py-1 rounded-full"
            >
              Разрешить
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
