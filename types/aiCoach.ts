export type GoalType = 'fitness' | 'habit' | 'meeting' | 'self-improvement'

export type MessageRole = 'user' | 'assistant'

export type DiscoveryPhase = 'idle' | 'questioning' | 'suggesting' | 'done'

export interface DiscoveryQuestion {
  text: string
  options: string[]   // quick-reply chips (3-5 items)
}

export interface DiscoverySuggestion {
  id: string
  emoji: string
  title: string
  description: string
  goalType: GoalType
  durationWeeks: number
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  // For discovery suggestion messages
  suggestions?: DiscoverySuggestion[]
}

export interface ScheduledTask {
  id: string
  title: string
  description: string
  date: string           // "YYYY-MM-DD"
  time: string           // "HH:MM" 24-hour
  durationMinutes: number
  notificationEnabled: boolean
  completed: boolean
}

export interface WeekGroup {
  weekLabel: string
  tasks: ScheduledTask[]
}

export interface CoachPlan {
  id: string
  goalText: string
  goalType: GoalType
  createdAt: number
  durationWeeks: number
  summary: string
  weeks: WeekGroup[]
}

// Shape Gemini must return (validated with Zod)
export interface GeminiScheduleResponse {
  summary: string
  durationWeeks: number
  goalType: GoalType
  weeks: Array<{
    weekLabel: string
    tasks: Array<{
      title: string
      description: string
      date: string
      time: string
      durationMinutes: number
    }>
  }>
}

export interface ReminderToast {
  taskId: string
  taskTitle: string
  taskTime: string
  minutesUntil: number
}
