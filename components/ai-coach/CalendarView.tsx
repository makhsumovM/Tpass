'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Bot, ChevronLeft, ChevronRight, CheckCircle2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAiCoachStore } from '@/store/aiCoachStore'
import { useTPassStore } from '@/store/tpassStore'
import type { GoalType, ScheduledTask } from '@/types/aiCoach'

// ── Constants ─────────────────────────────────────────────────────────────────

const DOT_COLOR: Record<GoalType, string> = {
  fitness:          'bg-emerald-400',
  habit:            'bg-tcell-accent-light',
  meeting:          'bg-amber-400',
  'self-improvement': 'bg-sky-400',
}

const GOAL_LABEL: Record<GoalType, string> = {
  fitness:          'Фитнес',
  habit:            'Привычка',
  meeting:          'Встреча',
  'self-improvement': 'Развитие',
}

const TASK_COLOR: Record<GoalType, string> = {
  fitness:          'border-emerald-500/30 bg-emerald-500/6',
  habit:            'border-tcell-accent/30 bg-tcell-accent/6',
  meeting:          'border-amber-400/30 bg-amber-400/6',
  'self-improvement': 'border-sky-500/30 bg-sky-500/6',
}

const BADGE_COLOR: Record<GoalType, string> = {
  fitness:          'text-emerald-400',
  habit:            'text-tcell-accent-light',
  meeting:          'text-amber-400',
  'self-improvement': 'text-sky-400',
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function toYMD(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function buildCalendarDays(year: number, month: number) {
  // month is 0-indexed
  const firstDay = new Date(year, month, 1)
  const lastDay  = new Date(year, month + 1, 0)

  // Monday-first: 0=Mon … 6=Sun
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const days: (number | null)[] = []
  for (let i = 0; i < startDow; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d)
  // Pad to complete last row
  while (days.length % 7 !== 0) days.push(null)

  return days
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface TaskWithMeta extends ScheduledTask {
  goalType: GoalType
  planTitle: string
  planId: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CalendarView() {
  const { savedPlans, markTaskCompleted, setActiveTab, clearConversation, setGoalType } = useAiCoachStore()
  const { addXp } = useTPassStore()

  const today = new Date()
  const todayYMD = toYMD(today)

  const [year, setYear]     = useState(today.getFullYear())
  const [month, setMonth]   = useState(today.getMonth())
  const [selected, setSelected] = useState<string>(todayYMD)

  // Build date → tasks map from ALL saved plans
  const taskMap = useMemo(() => {
    const map: Record<string, TaskWithMeta[]> = {}
    for (const plan of savedPlans) {
      for (const week of plan.weeks) {
        for (const task of week.tasks) {
          if (!map[task.date]) map[task.date] = []
          map[task.date].push({ ...task, goalType: plan.goalType, planTitle: plan.goalText, planId: plan.id })
        }
      }
    }
    return map
  }, [savedPlans])

  const calendarDays = useMemo(() => buildCalendarDays(year, month), [year, month])

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const selectedTasks = taskMap[selected] ?? []

  // Unique dot colors for a day (max 3)
  const getDots = (day: number): GoalType[] => {
    const ymd = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const tasks = taskMap[ymd]
    if (!tasks?.length) return []
    const types = [...new Set(tasks.map(t => t.goalType))]
    return types.slice(0, 3) as GoalType[]
  }

  const formatSelectedDate = (ymd: string) => {
    const d = new Date(ymd)
    return d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  if (savedPlans.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center gap-4 px-6 py-16"
      >
        <div className="w-16 h-16 rounded-full bg-tcell-surface border border-tcell-surface2 flex items-center justify-center">
          <Bot size={26} className="text-tcell-muted" />
        </div>
        <div>
          <p className="text-base font-semibold text-tcell-fg mb-1">Календарь пуст</p>
          <p className="text-sm text-tcell-muted leading-relaxed">Создай первый план — и здесь появятся задачи по дням</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { clearConversation(); setGoalType('fitness'); setActiveTab('chat') }}
          className="flex items-center gap-2 bg-tcell-accent/80 text-white px-5 py-2.5 rounded-full text-sm font-semibold"
        >
          <Plus size={15} />
          Создать план
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col pb-6">
      {/* ── Month navigation ── */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center text-tcell-muted rounded-lg hover:text-tcell-fg transition-colors">
          <ChevronLeft size={18} />
        </button>
        <motion.span
          key={`${year}-${month}`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="text-sm font-semibold text-tcell-fg"
        >
          {MONTHS[month]} {year}
        </motion.span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center text-tcell-muted rounded-lg hover:text-tcell-fg transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── Weekday headers ── */}
      <div className="grid grid-cols-7 px-3 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className={cn(
            'text-center text-[11px] font-medium py-1',
            d === 'Сб' || d === 'Вс' ? 'text-tcell-fg3' : 'text-tcell-muted',
          )}>
            {d}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${year}-${month}`}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.15 }}
          className="grid grid-cols-7 px-3 gap-y-0.5"
        >
          {calendarDays.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />

            const ymd = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isToday    = ymd === todayYMD
            const isSelected = ymd === selected
            const dots       = getDots(day)
            const isWeekend  = (i % 7) >= 5

            return (
              <button
                key={ymd}
                onClick={() => setSelected(ymd)}
                className="flex flex-col items-center py-1 gap-0.5 rounded-xl transition-colors"
              >
                {/* Day number */}
                <div className={cn(
                  'w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors',
                  isSelected
                    ? 'bg-tcell-accent text-white font-semibold'
                    : isToday
                    ? 'border border-tcell-accent/50 text-tcell-accent-light font-medium'
                    : isWeekend
                    ? 'text-tcell-fg3'
                    : 'text-tcell-fg',
                )}>
                  {day}
                </div>

                {/* Task dots */}
                <div className="flex gap-0.5 h-1.5 items-center">
                  {dots.map((type, di) => (
                    <div
                      key={di}
                      className={cn('w-1 h-1 rounded-full', DOT_COLOR[type])}
                    />
                  ))}
                </div>
              </button>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* ── Divider ── */}
      <div className="h-px bg-tcell-surface2 mx-4 mt-3 mb-4" />

      {/* ── Day tasks ── */}
      <div className="px-4 space-y-3">
        {/* Date label */}
        <p className="text-xs text-tcell-muted capitalize">
          {formatSelectedDate(selected)}
        </p>

        <AnimatePresence mode="wait">
          {selectedTasks.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-tcell-fg3 py-4 text-center"
            >
              Задач нет
            </motion.p>
          ) : (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-2"
            >
              {selectedTasks.map((task, i) => (
                <motion.button
                  key={task.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={task.completed ? {} : { scale: 0.98 }}
                  onClick={() => {
                    if (!task.completed) {
                      markTaskCompleted(task.planId, task.id)
                      addXp(15, task.title)
                    }
                  }}
                  className={cn(
                    'w-full rounded-xl border px-4 py-3 flex items-start gap-3 text-left transition-opacity',
                    TASK_COLOR[task.goalType],
                    task.completed && 'opacity-50',
                  )}
                >
                  {/* Time */}
                  <span className={cn('text-xs font-semibold shrink-0 mt-0.5 tabular-nums', BADGE_COLOR[task.goalType])}>
                    {task.time}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-medium text-tcell-fg leading-snug', task.completed && 'line-through text-tcell-muted')}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-tcell-muted">{task.durationMinutes} мин</span>
                      <span className="text-tcell-fg3">·</span>
                      <span className={cn('text-[11px]', BADGE_COLOR[task.goalType])}>{GOAL_LABEL[task.goalType]}</span>
                    </div>
                  </div>

                  {/* Done check */}
                  {task.completed
                    ? <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                    : <div className="w-4 h-4 rounded-full border border-white/20 shrink-0 mt-0.5" />
                  }
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
