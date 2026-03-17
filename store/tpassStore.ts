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
}

export const useTPassStore = create<TPassState>()(
  persist(
    (set, get) => ({
      seasonName: '🌸 Наврўз 2026',
      seasonEndDate: '2026-04-30T23:59:59.000Z',

      currentLevel: 5,
      currentXp: 45,
      xpPerLevel: XP_PER_LEVEL,
      isPremium: false,

      theme: 'light' as const,

      claimedRewards: ['r-1-free', 'r-1-prem', 'r-2-free', 'r-2-prem', 'r-3-free', 'r-4-free'],
      levels: LEVELS,

      questCategory: 'daily',
      quests: QUESTS,
      questProgress: {
        'q-daily-1': 0,
        'q-daily-2': 0,
        'q-weekly-1': 1,
        'q-weekly-2': 0,
        'q-weekly-3': 0,
        'q-weekly-4': 0,
        'q-season-1': 5,
        'q-season-2': 20,
        'q-season-3': 5,
        'q-season-4': 20,
        'q-season-5': 0,
      },

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
    }),
    {
      name: 'tpass-storage',
      partialize: (state) => ({
        currentLevel: state.currentLevel,
        currentXp: state.currentXp,
        isPremium: state.isPremium,
        claimedRewards: state.claimedRewards,
        questProgress: state.questProgress,
        questCategory: state.questCategory,
        theme: state.theme,
      }),
    }
  )
)
