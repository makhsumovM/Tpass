import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LevelData, Quest, QuestCategory } from '@/types/tpass'
import { LEVELS } from '@/data/rewards'
import { QUESTS } from '@/data/quests'

const XP_PER_LEVEL = 100

interface XpToast {
  amount: number
  questTitle: string
  fromXp: number
  toXp: number
  fromLevel: number
  toLevel: number
}

interface TPassState {
  // Season
  seasonName: string
  seasonEndDate: string

  // Player progress
  currentLevel: number
  currentXp: number
  xpPerLevel: number
  isPremium: boolean

  // Rewards
  claimedRewards: string[]
  levels: LevelData[]

  // Quests
  questCategory: QuestCategory
  quests: Quest[]
  questProgress: Record<string, number>

  // Theme
  theme: 'light' | 'dark'

  // Onboarding
  onboarded: boolean

  // UI state (not persisted)
  premiumModalOpen: boolean
  xpToast: XpToast | null

  // Actions
  claimReward: (rewardId: string) => void
  addXp: (amount: number, questTitle?: string) => void
  incrementQuestProgress: (questId: string) => void
  setQuestCategory: (category: QuestCategory) => void
  setPremium: (value: boolean) => void
  openPremiumModal: () => void
  closePremiumModal: () => void
  clearXpToast: () => void
  toggleTheme: () => void
  completeOnboarding: () => void
  resetProgress: () => void
}

export const useTPassStore = create<TPassState>()(
  persist(
    (set, get) => ({
      seasonName: '🌸 Наврўз 2026',
      seasonEndDate: '2026-04-30T23:59:59.000Z',

      currentLevel: 1,
      currentXp: 0,
      xpPerLevel: XP_PER_LEVEL,
      isPremium: false,

      onboarded: false,

      theme: 'light' as const,

      claimedRewards: [],
      levels: LEVELS,

      questCategory: 'daily',
      quests: QUESTS,
      questProgress: Object.fromEntries(QUESTS.map((q) => [q.id, 0])),

      premiumModalOpen: false,
      xpToast: null,

      claimReward: (rewardId) =>
        set((state) => ({
          claimedRewards: [...state.claimedRewards, rewardId],
        })),

      addXp: (amount, questTitle = '') =>
        set((state) => {
          const fromXp    = state.currentXp
          const fromLevel = state.currentLevel
          let newXp    = fromXp + amount
          let newLevel = fromLevel

          while (newXp >= state.xpPerLevel) {
            newXp -= state.xpPerLevel
            newLevel += 1
          }

          return {
            currentXp: newXp,
            currentLevel: newLevel,
            xpToast: {
              amount,
              questTitle,
              fromXp,
              toXp: newXp,
              fromLevel,
              toLevel: newLevel,
            },
          }
        }),

      incrementQuestProgress: (questId) => {
        const state = get()
        const quest = state.quests.find((q) => q.id === questId)
        if (!quest) return

        const current = state.questProgress[questId] ?? 0
        if (current >= quest.progressTotal) return

        const next = current + 1
        const justCompleted = next >= quest.progressTotal

        set((s) => ({ questProgress: { ...s.questProgress, [questId]: next } }))

        if (justCompleted) {
          get().addXp(quest.xpReward, quest.title)
        }
      },

      setQuestCategory: (category) => set({ questCategory: category }),
      setPremium: (value) => set({ isPremium: value, premiumModalOpen: false }),
      openPremiumModal: () => set({ premiumModalOpen: true }),
      closePremiumModal: () => set({ premiumModalOpen: false }),
      clearXpToast: () => set({ xpToast: null }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      completeOnboarding: () => set({ onboarded: true }),
      resetProgress: () =>
        set({
          currentLevel: 1,
          currentXp: 0,
          isPremium: false,
          onboarded: false,
          claimedRewards: [],
          questProgress: Object.fromEntries(QUESTS.map((q) => [q.id, 0])),
          questCategory: 'daily',
          xpToast: null,
        }),
    }),
    {
      name: 'tpass-storage',
      partialize: (state) => ({
        currentLevel: state.currentLevel,
        currentXp: state.currentXp,
        isPremium: state.isPremium,
        onboarded: state.onboarded,
        claimedRewards: state.claimedRewards,
        questProgress: state.questProgress,
        questCategory: state.questCategory,
        theme: state.theme,
      }),
    }
  )
)
