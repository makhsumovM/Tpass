'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Mic, MicOff } from 'lucide-react'
import { cn } from '@/lib/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecognition = any

function getSpeechRecognitionCtor(): (new () => AnyRecognition) | undefined {
  if (typeof window === 'undefined') return undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

export function VoiceInputButton({ onTranscript, disabled }: VoiceInputButtonProps) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<AnyRecognition | null>(null)

  useEffect(() => {
    setSupported(!!getSpeechRecognitionCtor())
  }, [])

  const toggle = () => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) return

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    const recognition = new Ctor()
    recognition.lang = 'ru-RU'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => {
      const transcript = event.results[0]?.[0]?.transcript
      if (transcript) onTranscript(transcript)
    }

    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  if (!supported) return null

  return (
    <motion.button
      onClick={toggle}
      disabled={disabled}
      whileTap={{ scale: 0.9 }}
      className={cn(
        'relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors',
        listening
          ? 'bg-red-500/20 text-red-400'
          : 'bg-tcell-surface text-tcell-muted hover:text-tcell-accent-light',
        disabled && 'opacity-40 pointer-events-none',
      )}
    >
      <AnimatePresence mode="wait">
        {listening ? (
          <motion.div
            key="on"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500/30"
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <MicOff size={18} />
          </motion.div>
        ) : (
          <motion.div key="off" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Mic size={18} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
