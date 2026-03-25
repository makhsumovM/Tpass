'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  TrendingDown,
  Gamepad2,
  Crown,
  BarChart3,
  Repeat2,
  DollarSign,
  Target,
  ArrowRight,
  BrainCircuit,
} from 'lucide-react'
/* ─── Brand SVG icons (Simple Icons paths, inline — no extra dep) ─── */
function IconSpotify({ size = 32, color = '#1DB954' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  )
}
function IconDuolingo({ size = 32, color = '#58CC02' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M11.07 0C7.05.006 3.1 2.03 1.14 5.65-.85 9.38-.17 13.95 2.28 17.2l.8 6.19c.07.53.66.82 1.13.56l5.4-2.96c.53.1 1.07.17 1.62.19h.1c6.57 0 12.2-5.21 12.54-11.88C23.25 3.62 17.7-.01 11.07 0zm.3 18.93c-.42 0-.84-.03-1.25-.09l-3.15 1.73-.46-3.58C4.67 15.5 3.12 12.83 3.12 9.9c0-4.36 3.55-8.35 7.97-8.78h.28c4.77 0 8.53 3.73 8.53 8.41 0 4.52-3.57 8.78-8.53 9.4z"/>
    </svg>
  )
}
function IconNike({ size = 32, color = '#ffffff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M21.08 1.501c.43-.43 1.26-.22 1.34.44.15 1.18-.44 2.3-1.18 3.17-3.34 4.04-6.7 8.06-10.04 12.1-.95 1.15-2.13 2.22-3.61 2.57-1.73.41-3.53-.23-4.97-1.16-1.16-.75-2.38-2.01-2.13-3.48.19-1.09 1.2-1.83 2.19-2.22 1.42-.56 3-.59 4.5-.36 1.27.19 2.51.58 3.73 1.02L21.08 1.5z"/>
    </svg>
  )
}
function IconEpicGames({ size = 32, color = '#818cf8' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M3 0v18l3 3h9l3-3V0H3zm9 15.75H7.5v-2.25H12v-2.25H7.5V9H12V6.75H6v10.5h6V15.75zm1.5-9H18V4.5h-4.5V0H3v1.5h10.5V6.75z"/>
    </svg>
  )
}

/* ─── Shared primitives ─────────────────────────────────────────────── */

const PURPLE  = '#A98FE0'
const PURPLE2 = '#8B6FBB'
const GOLD    = '#FBBF24'
const GREEN   = '#34d399'
const RED     = '#f87171'

function GlowOrb({ size = 500, color = PURPLE, opacity = 0.15 }: { size?: number; color?: string; opacity?: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}

function Tag({ children, color = PURPLE }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-widest"
      style={{ background: `${color}18`, border: `1px solid ${color}35`, color }}
    >
      {children}
    </span>
  )
}

function StatPill({
  value,
  label,
  color = PURPLE,
}: {
  value: string
  label: string
  color?: string
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl px-8 py-5 min-w-[140px]"
      style={{ background: `${color}10`, border: `1px solid ${color}30` }}
    >
      <span className="text-5xl font-black leading-none" style={{ color }}>
        {value}
      </span>
      <span className="mt-1.5 text-xs text-white/40 font-medium text-center leading-tight">{label}</span>
    </div>
  )
}

/* ─── Slides ─────────────────────────────────────────────────────────── */

/* 0 — Origin story */
function SlideOrigin() {
  const steps = [
    {
      emoji: '📲',
      text: 'Изучили кейс — первым делом скачали Tcell как обычные пользователи',
    },
    {
      emoji: '👀',
      text: 'Зашли. Увидели баланс. Покрутили вниз. Не знали что делать дальше.',
    },
    {
      emoji: '🤔',
      text: 'Не было желания кликать в другие вкладки, изучать услуги, исследовать.',
    },
    {
      emoji: '💡',
      text: 'Первый вопрос: почему люди не хотят исследовать? Зачем им вообще возвращаться?',
    },
  ]

  return (
    <div className="relative flex flex-col justify-center h-full px-14 overflow-hidden">
      <GlowOrb size={500} opacity={0.1} />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-10"
      >
        <Tag>История идеи</Tag>
        <h2 className="mt-3 text-5xl font-black text-white leading-tight">
          Рождение идеи —
          <br />
          <span
            style={{
              background: `linear-gradient(120deg, ${PURPLE} 0%, #C4A8F0 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            личный опыт.
          </span>
        </h2>
        <p className="mt-2 text-white/35 text-base max-w-xl">
          Хочу начать с того, как у нас зародилась эта идея.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Vertical line */}
        <div
          className="absolute left-3 top-2 bottom-2 w-px"
          style={{ background: `linear-gradient(180deg, ${PURPLE}60 0%, transparent 100%)` }}
        />

        <div className="space-y-5">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
              className="flex items-start gap-4 relative"
            >
              {/* Dot on timeline */}
              <div
                className="absolute -left-8 mt-1 w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  background: i === 3 ? PURPLE : 'rgba(255,255,255,0.2)',
                  boxShadow: i === 3 ? `0 0 10px ${PURPLE}80` : 'none',
                }}
              />

              <span className="text-2xl shrink-0">{s.emoji}</span>
              <p
                className="text-base leading-snug"
                style={{ color: i === 3 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)' }}
              >
                {i === 3 ? <strong>{s.text}</strong> : s.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-8 rounded-2xl px-6 py-4"
        style={{ background: `${PURPLE}10`, border: `1px solid ${PURPLE}25` }}
      >
        <p className="text-white/60 text-sm italic leading-relaxed">
          &ldquo;Если я не хочу исследовать приложение —
          зачем обычному пользователю вообще возвращаться?
          <span style={{ color: PURPLE }}> Вот с этого всё и началось.&rdquo;</span>
        </p>
        <p className="mt-3 text-white/30 text-sm">
          Ответ на этот вопрос — на следующем слайде. →
        </p>
      </motion.div>
    </div>
  )
}

/* 1 — Hook */
function SlideHook() {
  const barriers = [
    {
      icon: '💸',
      title: 'Страх случайного списания',
      desc: 'Нажмёшь не туда — подключится платная услуга. Проще не трогать.',
    },
    {
      icon: '🗺️',
      title: 'Нет навигации по ценности',
      desc: 'Приложение не объясняет, что здесь вообще можно делать кроме оплаты.',
    },
    {
      icon: '🎯',
      title: 'Нет причины исследовать',
      desc: 'Изучил — и что? Никакой награды, никакого прогресса, никакого смысла.',
    },
  ]

  return (
    <div className="relative flex flex-col justify-center h-full px-14 overflow-hidden">
      <GlowOrb size={500} color={RED} opacity={0.08} />

      <div className="absolute top-8 left-10 text-white/10 text-sm font-black uppercase tracking-[0.3em]">
        Tcell
      </div>

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-8"
      >
        <Tag color={RED}>Хук</Tag>
        <h1 className="mt-3 text-5xl font-black text-white leading-tight max-w-2xl">
          Почему люди не хотят
          <br />
          <span
            style={{
              background: `linear-gradient(120deg, #f87171 0%, #fb923c 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            исследовать приложение?
          </span>
        </h1>
        <p className="mt-2 text-white/35 text-base max-w-xl">
          Причин много — но мы выделили 3 основных.
        </p>
      </motion.div>

      <div className="flex flex-col gap-3">
        {barriers.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
            className="flex items-start gap-4 rounded-2xl p-5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${RED}20`,
            }}
          >
            <span className="text-2xl shrink-0 mt-0.5">{b.icon}</span>
            <div>
              <p className="text-white font-black text-base leading-snug">{b.title}</p>
              <p className="text-white/40 text-sm mt-1 leading-relaxed">{b.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bridge to next slide */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6 text-white/25 text-sm"
      >
        И это напрямую бьёт по метрикам Tcell. →
      </motion.p>
    </div>
  )
}

/* 2 — Problem */
function SlideProblem() {
  return (
    <div className="relative flex flex-col justify-center h-full px-14 overflow-hidden">
      <GlowOrb size={500} color={RED} opacity={0.07} />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <Tag color={RED}>Сравнение метрик</Tag>
        <h2 className="mt-3 text-5xl font-black text-white leading-tight">
          Сравнили телеком
          <br />
          <span style={{ color: RED }}>с другими платформами.</span>
        </h2>
      </motion.div>

      {/* DAU stat comparison */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        className="flex items-center gap-4 mb-10"
      >
        {/* Telecom pill */}
        <div className="flex flex-col gap-1.5">
          <StatPill value="~10%" label={'DAU/MAU\nтелеком-приложения'} color={RED} />
          <div
            className="rounded-xl px-3 py-2 text-center"
            style={{ background: `${RED}08`, border: `1px solid ${RED}20` }}
          >
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Sensor Tower</p>
            <p className="text-[10px] text-white/20 mt-0.5">среднее по отрасли, 2023–2024</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <TrendingDown size={22} className="text-white/20" />
          <span className="text-white/20 text-xs font-bold uppercase tracking-widest">vs</span>
        </div>

        {/* Games/social pill */}
        <div className="flex flex-col gap-1.5">
          <StatPill value="~48%" label={'DAU/MAU\nигры и соцсети'} color={GREEN} />
          <div
            className="rounded-xl px-3 py-2 text-center"
            style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}20` }}
          >
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">data.ai (App Annie)</p>
            <p className="text-[10px] text-white/20 mt-0.5">State of Mobile 2024</p>
          </div>
        </div>

        <div
          className="ml-4 flex-1 rounded-2xl px-6 py-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-white/80 font-bold text-lg leading-snug">
            Разрыв в ~5 раз —
          </p>
          <p className="text-white/40 text-sm mt-1 leading-relaxed">
            Результат почти в 5 раз. Тоже много причин —
            но мы выделили 3 основных почему такая низкая метрика.
          </p>
        </div>
      </motion.div>

      {/* 3 pain points */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Repeat2,     text: 'Нет причины возвращаться ежедневно' },
          { icon: BrainCircuit, text: 'Нет персонализации под пользователя' },
          { icon: Gamepad2,    text: 'Нет digital-механик вовлечения' },
        ].map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.1 }}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p.icon size={16} className="text-white/30 shrink-0" />
            <p className="text-white/55 text-sm leading-snug">{p.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* 3 — Solution */
function SlideSolution() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full text-center px-16 overflow-hidden">
      <GlowOrb size={560} opacity={0.14} />

      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center gap-5"
      >
        <Tag>Решение</Tag>

        <div
          className="text-[80px] font-black tracking-tight leading-none"
          style={{
            background: `linear-gradient(135deg, #C4A8F0 0%, ${PURPLE} 50%, ${PURPLE2} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 50px ${PURPLE}60)`,
          }}
        >
          TPASS
        </div>

        <p className="text-2xl font-bold text-white/70 max-w-lg leading-snug">
          Battle Pass внутри Tcell
        </p>

        {/* Loop diagram */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          {['Действие', 'XP', 'Уровень', 'Награда'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className="rounded-full px-4 py-2 text-sm font-bold text-white"
                style={{
                  background: `${PURPLE}${18 + i * 12}`,
                  border: `1px solid ${PURPLE}${30 + i * 10}`,
                }}
              >
                {step}
              </div>
              {i < 3 && <ArrowRight size={14} className="text-white/25" />}
            </div>
          ))}
        </motion.div>

        {/* Two key insights */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col gap-3 w-full max-w-xl mt-1"
        >
          <div
            className="flex items-start gap-3 rounded-2xl px-5 py-4 text-left"
            style={{ background: `${PURPLE}12`, border: `1px solid ${PURPLE}25` }}
          >
            <span className="text-xl shrink-0">🎯</span>
            <p className="text-white/70 text-sm leading-relaxed">
              За каждое действие в приложении — награда.{' '}
              <span className="text-white/40">Пополнил, позвонил, зашёл три дня подряд — получил бонус.</span>
            </p>
          </div>
          <div
            className="flex items-start gap-3 rounded-2xl px-5 py-4 text-left"
            style={{ background: `${PURPLE}12`, border: `1px solid ${PURPLE}25` }}
          >
            <span className="text-xl shrink-0">💡</span>
            <p className="text-white/70 text-sm leading-relaxed">
              У Tcell много услуг о которых люди не знают.{' '}
              <span className="text-white/40">TPASS направляет к ним естественно — через квест и награду.</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* 4 — How it works */
function SlideHowItWorks() {
  const quests = [
    { emoji: '💳', action: 'Пополни счёт', xp: '+50 XP', reward: '500 МБ интернета' },
    { emoji: '📞', action: 'Позвони 5 минут', xp: '+30 XP', reward: '30 мин звонков' },
    { emoji: '📅', action: 'Зайди 3 дня подряд', xp: '+100 XP', reward: 'Кэшбэк 5%' },
    { emoji: '📦', action: 'Подключи услугу', xp: '+80 XP', reward: 'Эксклюзивный бонус' },
  ]

  return (
    <div className="relative flex flex-col justify-center h-full px-14 overflow-hidden">
      <GlowOrb size={400} opacity={0.1} />

      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Tag>Механика</Tag>
        <h2 className="mt-3 text-5xl font-black text-white leading-tight">
          Реальные действия.
          <br />
          <span style={{ color: PURPLE }}>Реальные награды.</span>
        </h2>
        <p className="mt-2 text-white/40 text-base">
          И вот как это выглядит на практике.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {quests.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${PURPLE}25`,
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{q.emoji}</span>
                <p className="text-white font-bold text-base">{q.action}</p>
              </div>
              <span
                className="text-xs font-black rounded-full px-2 py-0.5"
                style={{ background: `${PURPLE}20`, color: PURPLE }}
              >
                {q.xp}
              </span>
            </div>
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}
            >
              <span style={{ color: GREEN }} className="text-xs font-bold">→</span>
              <span className="text-xs text-white/50">{q.reward}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Demo CTA + bridge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 flex items-center justify-between"
      >
        <p className="text-white/25 text-sm">
          Каждый квест — это коммерческое событие для Tcell. →
        </p>
        <Link
          href="/track"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-white font-bold text-sm transition-transform hover:scale-105 active:scale-95 shrink-0"
          style={{
            background: `linear-gradient(135deg, ${PURPLE2} 0%, ${PURPLE} 100%)`,
            boxShadow: `0 0 20px ${PURPLE}40`,
          }}
        >
          <ExternalLink size={15} />
          Смотреть демо
        </Link>
      </motion.div>
    </div>
  )
}

/* 5 — Personalization */
function SlidePersonalization() {
  const params = [
    { icon: '👤', label: 'Возраст / профиль' },
    { icon: '📊', label: 'Поведение' },
    { icon: '🌸', label: 'Сезон' },
  ]

  const profiles = [
    {
      icon: '🎓',
      name: 'Студент · 19 лет',
      tags: ['📶 Интернет', '🌸 Весна'],
      quest: 'Используй 5 ГБ за неделю',
      result: '+2 ГБ бонус',
      color: PURPLE,
    },
    {
      icon: '💼',
      name: 'Бизнес · 35 лет',
      tags: ['✈️ Путешественник', '📞 Звонки'],
      quest: 'Подключи роуминг',
      result: 'Скидка 20% на тариф',
      color: GOLD,
    },
    {
      icon: '🎮',
      name: 'Геймер · 25 лет',
      tags: ['🎮 Игры', '📶 Интернет'],
      quest: 'Пополни на 50 сомони',
      result: 'Безлимит на игры 3 дня',
      color: '#818cf8',
    },
  ]

  return (
    <div className="relative flex flex-col justify-center h-full px-14 overflow-hidden">
      <GlowOrb size={400} color={GOLD} opacity={0.07} />

      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Tag color={GOLD}>Глубина</Tag>
        <h2 className="mt-3 text-5xl font-black text-white leading-tight">
          Квесты подстраиваются
          <br />
          <span style={{ color: GOLD }}>под каждого.</span>
        </h2>
      </motion.div>

      {/* Parameters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 mb-6"
      >
        {params.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}25` }}
            >
              <span className="text-sm">{p.icon}</span>
              <span className="text-xs font-bold text-white/60">{p.label}</span>
            </div>
            {i < params.length - 1 && (
              <span className="text-white/20 text-sm font-bold">+</span>
            )}
          </div>
        ))}
        <ArrowRight size={16} className="text-white/20 ml-1" />
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{ background: `${PURPLE}20`, border: `1px solid ${PURPLE}40` }}
        >
          <span className="text-sm">🎯</span>
          <span className="text-xs font-bold" style={{ color: PURPLE }}>Персональный квест</span>
        </div>
      </motion.div>

      {/* Profiles */}
      <div className="grid grid-cols-3 gap-4">
        {profiles.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.12 }}
            className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.color}25` }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{s.icon}</span>
              <p className="text-white font-black text-sm leading-tight">{s.name}</p>
            </div>

            <div className="flex flex-wrap gap-1">
              {s.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-bold rounded-full px-2 py-0.5"
                  style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}25` }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div
              className="rounded-xl px-3 py-2"
              style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}
            >
              <p className="text-xs text-white/40 font-bold uppercase tracking-wide mb-0.5">Квест</p>
              <p className="text-sm font-bold text-white">{s.quest}</p>
            </div>

            <div className="flex items-center gap-1.5">
              <span style={{ color: GREEN }} className="text-xs font-bold">→</span>
              <span className="text-xs text-white/50">{s.result}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* 6 — Innovation */
function SlideInnovation() {
  const refs = [
    { name: 'Fortnite', result: 'Изобрёл механику', Icon: IconEpicGames, color: '#818cf8' },
    { name: 'Duolingo', result: 'DAU ×3 за год',    Icon: IconDuolingo,  color: '#58CC02' },
    { name: 'Nike',     result: 'DAU +35%',          Icon: IconNike,      color: '#fb923c' },
    { name: 'Spotify',  result: 'Wrapped = 40M шер', Icon: IconSpotify,   color: '#1DB954' },
  ]

  return (
    <div className="relative flex flex-col justify-center h-full px-14 overflow-hidden">
      <GlowOrb size={500} opacity={0.12} />

      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <Tag>Инновация</Tag>
        <h2 className="mt-3 text-5xl font-black text-white leading-tight">
          Battle Pass впервые
          <br />
          <span style={{ color: PURPLE }}>в телекоме.</span>
        </h2>
        <p className="mt-2 text-white/40 text-base max-w-xl">
          Везде одно и то же: человек возвращается не потому что надо — а потому что есть прогресс и награда.
          В телекоме Таджикистана этого не было ни разу.
        </p>
      </motion.div>

      {/* Reference chain */}
      <div className="flex items-stretch gap-3 mb-6">
        {refs.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex-1 flex flex-col items-center text-center rounded-2xl py-5 px-3 gap-2"
            style={{ background: `${r.color}10`, border: `1px solid ${r.color}25` }}
          >
            <r.Icon size={32} color={r.color} />
            <p className="text-white font-black text-base">{r.name}</p>
            <p className="text-xs font-medium" style={{ color: r.color }}>{r.result}</p>
          </motion.div>
        ))}

        <div className="flex items-center px-2">
          <ArrowRight size={20} className="text-white/20" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65 }}
          className="flex-1 flex flex-col items-center text-center justify-center rounded-2xl py-5 px-3 gap-2"
          style={{
            background: `${PURPLE}15`,
            border: `1px solid ${PURPLE}50`,
            boxShadow: `0 0 30px ${PURPLE}25`,
          }}
        >
          <span className="text-3xl">📡</span>
          <p className="font-black text-base" style={{ color: PURPLE }}>Tcell</p>
          <p className="text-xs font-black uppercase tracking-wide" style={{ color: PURPLE }}>
            Первый в Таджикистане
          </p>
        </motion.div>
      </div>

      {/* Bridge */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}
        className="text-white/25 text-sm"
      >
        Первые получают преимущество на годы. И это напрямую влияет на выручку. →
      </motion.p>
    </div>
  )
}

/* 7 — Monetization */
function SlideMonetization() {
  const streams = [
    {
      icon: DollarSign,
      title: 'Прямая выручка',
      tag: 'Premium подписка',
      detail: 'Пользователи платят за доступ к расширенному треку наград и эксклюзивным квестам.',
      color: PURPLE,
    },
    {
      icon: BarChart3,
      title: 'Рост ARPU',
      tag: 'Квест-механика',
      detail: 'Квест «Пополни на 50 сомони» стимулирует пополнения напрямую. Бизнес-цели встроены в геймплей.',
      color: GOLD,
    },
    {
      icon: Repeat2,
      title: 'Снижение оттока',
      tag: 'FOMO + прогрессия',
      detail: 'Пользователь не отключается, потому что не хочет потерять уровень и сезонные награды.',
      color: GREEN,
    },
  ]

  return (
    <div className="relative flex flex-col justify-center h-full px-14 overflow-hidden">
      <GlowOrb size={400} color={GOLD} opacity={0.08} />

      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Tag color={GOLD}>Монетизация</Tag>
        <h2 className="mt-3 text-5xl font-black text-white leading-tight">
          Три источника дохода.
          <br />
          <span style={{ color: GOLD }}>Один продукт.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-3 gap-5">
        {streams.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.13, duration: 0.45 }}
            className="rounded-2xl p-5 flex flex-col gap-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.color}25` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `${s.color}18` }}
            >
              <s.icon size={22} style={{ color: s.color }} />
            </div>
            <div>
              <Tag color={s.color}>{s.tag}</Tag>
              <p className="text-white font-black text-lg mt-2">{s.title}</p>
              <p className="text-white/40 text-sm mt-1.5 leading-relaxed">{s.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* 9 — Closing */
function SlideClose() {
  const kpis = [
    { label: 'DAU/MAU', arrow: '↑', desc: 'Ежедневные квесты создают привычку', color: PURPLE },
    { label: 'ARPU',    arrow: '↑', desc: 'Квесты на пополнение и подключение услуг', color: GOLD },
    { label: 'Churn',   arrow: '↓', desc: 'Прогрессия + сезонность + FOMO', color: GREEN },
  ]

  return (
    <div className="relative flex flex-col items-center justify-center h-full text-center px-14 overflow-hidden">
      <GlowOrb size={600} opacity={0.13} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center gap-5"
      >
        <div
          className="text-[72px] font-black tracking-tight leading-none"
          style={{
            background: `linear-gradient(135deg, #C4A8F0 0%, ${PURPLE} 50%, ${PURPLE2} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 40px ${PURPLE}60)`,
          }}
        >
          TPASS
        </div>

        <p className="text-xl font-semibold text-white/55 max-w-lg leading-snug">
          Утилита становится{' '}
          <span style={{ color: PURPLE }}>привычкой.</span>
        </p>

        {/* KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mt-2"
        >
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-2xl px-7 py-5 flex flex-col items-center gap-1 min-w-[160px]"
              style={{ background: `${k.color}10`, border: `1px solid ${k.color}30` }}
            >
              <span className="text-5xl font-black leading-none" style={{ color: k.color }}>
                {k.arrow}
              </span>
              <span className="text-white font-black text-base">{k.label}</span>
              <span className="text-white/35 text-xs text-center leading-snug">{k.desc}</span>
            </div>
          ))}
        </motion.div>

        {/* Demo CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 mt-2"
        >
          <Link
            href="/track"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-white font-bold text-sm transition-transform hover:scale-105 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${PURPLE2} 0%, ${PURPLE} 100%)`,
              boxShadow: `0 0 28px ${PURPLE}45`,
            }}
          >
            <ExternalLink size={16} />
            Смотреть демо
          </Link>
          <p className="text-white/25 text-sm">Мы уже построили.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="mt-2"
        >
          <p className="text-3xl font-bold text-white">Спасибо.</p>
          <p className="text-white/30 text-base mt-1">Готовы ответить на вопросы.</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: PURPLE }}
        >
          Это не геймификация. Это инфраструктура.
        </motion.p>
      </motion.div>
    </div>
  )
}

/* ─── Slide registry ─────────────────────────────────────────────── */

const SLIDES = [
  { id: 'origin',       label: 'История идеи', render: () => <SlideOrigin /> },
  { id: 'hook',         label: 'Хук',          render: () => <SlideHook /> },
  { id: 'problem',      label: 'Проблема',      render: () => <SlideProblem /> },
  { id: 'solution',     label: 'Решение',       render: () => <SlideSolution /> },
  { id: 'howItWorks',   label: 'Механика',      render: () => <SlideHowItWorks /> },
  { id: 'personal',     label: 'Персонализация', render: () => <SlidePersonalization /> },
  { id: 'innovation',   label: 'Инновация',     render: () => <SlideInnovation /> },
  { id: 'money',        label: 'Монетизация',   render: () => <SlideMonetization /> },
  { id: 'close',        label: 'Итог',          render: () => <SlideClose /> },
]

/* ─── Shell ─────────────────────────────────────────────────────────── */

export default function SlidesPage() {
  const [current, setCurrent] = useState(0)
  const total = SLIDES.length

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, total - 1)), [total])
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) { e.preventDefault(); next() }
      if (['ArrowLeft',  'PageUp'].includes(e.key))        { e.preventDefault(); prev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const slide = SLIDES[current]

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ background: '#0A0A0C', fontFamily: 'var(--font-geist-sans, sans-serif)' }}
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.5,
        }}
      />

      {/* Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {slide.render()}
        </motion.div>
      </AnimatePresence>

      {/* Left arrow */}
      <button
        onClick={prev}
        disabled={current === 0}
        aria-label="Предыдущий слайд"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
      >
        <ChevronLeft size={20} className="text-white/50" />
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        disabled={current === total - 1}
        aria-label="Следующий слайд"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
      >
        <ChevronRight size={20} className="text-white/50" />
      </button>

      {/* Bottom dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrent(i)}
            aria-label={s.label}
            className="rounded-full transition-all duration-300"
            style={{
              width:      i === current ? 28 : 7,
              height:     7,
              background: i === current ? PURPLE : 'rgba(255,255,255,0.18)',
              boxShadow:  i === current ? `0 0 10px ${PURPLE}70` : 'none',
            }}
          />
        ))}
      </div>

      {/* Top-left: step label */}
      <div className="absolute top-5 left-8 h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={slide.label}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-bold block"
            style={{ color: PURPLE }}
          >
            {slide.label}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Top-right: counter */}
      <div className="absolute top-5 right-8 text-white/25 text-sm font-mono tabular-nums">
        {current + 1} / {total}
      </div>

      {/* Keyboard hint */}
      <motion.p
        initial={{ opacity: 0.45 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3.5, duration: 1.5 }}
        className="absolute bottom-14 left-1/2 -translate-x-1/2 text-white/25 text-xs pointer-events-none whitespace-nowrap"
      >
        → следующий слайд · ← назад · клик по точкам для перехода
      </motion.p>
    </div>
  )
}
