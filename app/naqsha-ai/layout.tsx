'use client'

import { useEffect } from 'react'
import { useTPassStore } from '@/store/tpassStore'
import { PremiumModal } from '@/components/track/PremiumModal'

export default function NaqshaAiLayout({ children }: { children: React.ReactNode }) {
  const theme = useTPassStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-tcell-bg">
      {children}
      <PremiumModal />
    </div>
  )
}
