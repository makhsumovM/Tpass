export type RewardType =
  | 'internet_500mb'
  | 'internet_1gb'
  | 'internet_2gb'
  | 'minutes_30'
  | 'minutes_100'
  | 'cashback_5'
  | 'cashback_10'
  | 'discount_10'
  | 'theme_exclusive'

export type RewardTrack = 'free' | 'premium'
export type RewardStatus = 'locked' | 'claimable' | 'claimed'

export type QuestTrack = 'free' | 'premium'
export type QuestCategory = 'daily' | 'weekly' | 'season'

export interface Reward {
  id: string
  type: RewardType
  label: string        // '500 МБ', '30 Минут'
  sublabel: string     // 'Интернет', 'Минуты', 'Кэшбэк 5%'
  track: RewardTrack
  levelRequired: number
}

export interface LevelData {
  level: number
  freeReward: Reward
  premiumReward: Reward
}

export interface Quest {
  id: string
  category: QuestCategory
  track: QuestTrack
  icon: string           // Lucide icon name
  title: string
  description: string
  progressTotal: number
  xpReward: number
}
