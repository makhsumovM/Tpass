import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatMessage, CoachPlan, DiscoveryPhase, DiscoveryQuestion, GoalType, ReminderToast } from '@/types/aiCoach'

interface AiCoachState {
  // Conversation
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null

  // Plans
  activePlan: CoachPlan | null
  savedPlans: CoachPlan[]

  // UI state
  activeTab: 'chat' | 'goals' | 'calendar'
  selectedGoalType: GoalType | 'discovery'

  // Discovery mode
  discoveryPhase: DiscoveryPhase
  discoveryAnswers: string
  discoveryQuestions: DiscoveryQuestion[]
  discoveryCurrentIndex: number
  discoveryAnswersArray: { question: string; answer: string }[]

  // Notifications
  notificationPermission: NotificationPermission | 'unsupported' | 'unknown'
  reminderToast: ReminderToast | null

  // Onboarding
  onboarded: boolean

  // Actions
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  setActivePlan: (plan: CoachPlan) => void
  deletePlan: (planId: string) => void
  toggleTaskNotification: (planId: string, taskId: string) => void
  markTaskCompleted: (planId: string, taskId: string) => void
  updateTaskTime: (planId: string, taskId: string, time: string) => void
  setActiveTab: (tab: 'chat' | 'goals' | 'calendar') => void
  setGoalType: (t: GoalType | 'discovery') => void
  setOnboarded: () => void
  setDiscoveryPhase: (phase: DiscoveryPhase) => void
  setDiscoveryAnswers: (answers: string) => void
  setDiscoveryQuestions: (questions: DiscoveryQuestion[]) => void
  advanceDiscovery: (answer: string) => void
  resetDiscovery: () => void
  setNotificationPermission: (p: NotificationPermission | 'unsupported' | 'unknown') => void
  setReminderToast: (toast: ReminderToast | null) => void
  clearConversation: () => void
}

export const useAiCoachStore = create<AiCoachState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      error: null,
      activePlan: null,
      savedPlans: [],
      activeTab: 'chat',
      onboarded: false,
      selectedGoalType: 'fitness',
      discoveryPhase: 'idle',
      discoveryAnswers: '',
      discoveryQuestions: [] as DiscoveryQuestion[],
      discoveryCurrentIndex: 0,
      discoveryAnswersArray: [],
      notificationPermission: 'unknown',
      reminderToast: null,

      addMessage: (msg) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { ...msg, id: crypto.randomUUID(), timestamp: Date.now() },
          ],
        })),

      setLoading: (v) => set({ isLoading: v }),

      setError: (e) => set({ error: e }),

      setActivePlan: (plan) =>
        set((state) => {
          const alreadySaved = state.savedPlans.some((p) => p.id === plan.id)
          return {
            activePlan: plan,
            savedPlans: alreadySaved
              ? state.savedPlans.map((p) => (p.id === plan.id ? plan : p))
              : [plan, ...state.savedPlans],
          }
        }),

      deletePlan: (planId) =>
        set((state) => ({
          savedPlans: state.savedPlans.filter((p) => p.id !== planId),
          activePlan: state.activePlan?.id === planId ? null : state.activePlan,
        })),

      toggleTaskNotification: (planId, taskId) =>
        set((state) => {
          const updatePlan = (plan: CoachPlan): CoachPlan => ({
            ...plan,
            weeks: plan.weeks.map((w) => ({
              ...w,
              tasks: w.tasks.map((t) =>
                t.id === taskId ? { ...t, notificationEnabled: !t.notificationEnabled } : t,
              ),
            })),
          })
          return {
            activePlan:
              state.activePlan?.id === planId ? updatePlan(state.activePlan) : state.activePlan,
            savedPlans: state.savedPlans.map((p) => (p.id === planId ? updatePlan(p) : p)),
          }
        }),

      markTaskCompleted: (planId, taskId) =>
        set((state) => {
          const updatePlan = (plan: CoachPlan): CoachPlan => ({
            ...plan,
            weeks: plan.weeks.map((w) => ({
              ...w,
              tasks: w.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: true } : t,
              ),
            })),
          })
          return {
            activePlan:
              state.activePlan?.id === planId ? updatePlan(state.activePlan) : state.activePlan,
            savedPlans: state.savedPlans.map((p) => (p.id === planId ? updatePlan(p) : p)),
          }
        }),

      updateTaskTime: (planId, taskId, time) =>
        set((state) => {
          const updatePlan = (plan: CoachPlan): CoachPlan => ({
            ...plan,
            weeks: plan.weeks.map((w) => ({
              ...w,
              tasks: w.tasks.map((t) => (t.id === taskId ? { ...t, time } : t)),
            })),
          })
          return {
            activePlan:
              state.activePlan?.id === planId ? updatePlan(state.activePlan) : state.activePlan,
            savedPlans: state.savedPlans.map((p) => (p.id === planId ? updatePlan(p) : p)),
          }
        }),

      setOnboarded: () => set({ onboarded: true }),

      setActiveTab: (tab) => set({ activeTab: tab }),
      setGoalType: (t) => set({ selectedGoalType: t }),
      setDiscoveryPhase: (phase) => set({ discoveryPhase: phase }),
      setDiscoveryAnswers: (answers) => set({ discoveryAnswers: answers }),
      setDiscoveryQuestions: (questions) =>
        set({ discoveryQuestions: questions, discoveryCurrentIndex: 0, discoveryAnswersArray: [] }),
      advanceDiscovery: (answer) =>
        set((state) => {
          const q = state.discoveryQuestions[state.discoveryCurrentIndex]
          const newAnswers = [
            ...state.discoveryAnswersArray,
            { question: q?.text ?? '', answer },
          ]
          const nextIndex = state.discoveryCurrentIndex + 1
          const done = nextIndex >= state.discoveryQuestions.length
          return {
            discoveryAnswersArray: newAnswers,
            discoveryCurrentIndex: nextIndex,
            // Build flat answers string for the API
            discoveryAnswers: newAnswers.map((a, i) => `${i + 1}. ${a.answer}`).join('\n'),
            discoveryPhase: done ? 'suggesting' : 'questioning',
          }
        }),
      resetDiscovery: () =>
        set({
          discoveryPhase: 'idle',
          discoveryAnswers: '',
          discoveryQuestions: [],
          discoveryCurrentIndex: 0,
          discoveryAnswersArray: [],
        }),
      setNotificationPermission: (p) => set({ notificationPermission: p }),
      setReminderToast: (toast) => set({ reminderToast: toast }),

      clearConversation: () =>
        set({
          messages: [],
          error: null,
          activePlan: null,
          activeTab: 'chat',
          discoveryPhase: 'idle',
          discoveryAnswers: '',
          discoveryQuestions: [],
          discoveryCurrentIndex: 0,
          discoveryAnswersArray: [],
        }),
    }),
    {
      name: 'ai-coach-storage',
      partialize: (state) => ({
        messages: state.messages,
        activePlan: state.activePlan,
        savedPlans: state.savedPlans,
        activeTab: state.activeTab,
        selectedGoalType: state.selectedGoalType,
        onboarded: state.onboarded,
        discoveryPhase: state.discoveryPhase,
        discoveryAnswers: state.discoveryAnswers,
        discoveryQuestions: state.discoveryQuestions,
        discoveryCurrentIndex: state.discoveryCurrentIndex,
        discoveryAnswersArray: state.discoveryAnswersArray,
      }),
    },
  ),
)

// Helper: get all tasks across all weeks of a plan
export function getAllTasks(plan: CoachPlan) {
  return plan.weeks.flatMap((w) => w.tasks)
}

// Helper: count completed tasks
export function getCompletedCount(plan: CoachPlan) {
  return getAllTasks(plan).filter((t) => t.completed).length
}

// Helper: get total tasks count
export function getTotalCount(plan: CoachPlan) {
  return getAllTasks(plan).length
}
