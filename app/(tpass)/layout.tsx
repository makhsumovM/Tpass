'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { StickyHeader } from '@/components/layout/StickyHeader'
import { TabBar } from '@/components/layout/TabBar'
import { BottomActions } from '@/components/layout/BottomActions'
import { PremiumModal } from '@/components/track/PremiumModal'
import { XpToast } from '@/components/layout/XpToast'
import { useTPassStore } from '@/store/tpassStore'

export default function TPassLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const theme = useTPassStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  return (
    <div className="flex flex-col min-h-screen bg-tcell-bg">
      {/* Sticky top: XP header + tabs */}
      <StickyHeader />
      <TabBar />

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
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
    </div>
  )
}
