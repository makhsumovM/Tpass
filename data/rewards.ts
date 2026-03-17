import type { LevelData } from '@/types/tpass'

export const LEVELS: LevelData[] = [
  {
    level: 1,
    freeReward:    { id: 'r-1-free',    type: 'internet_500mb', label: '500 МБ',   sublabel: 'Интернет',   track: 'free',    levelRequired: 1 },
    premiumReward: { id: 'r-1-prem',    type: 'minutes_30',     label: '30 Минут', sublabel: 'Звонки',     track: 'premium', levelRequired: 1 },
  },
  {
    level: 2,
    freeReward:    { id: 'r-2-free',    type: 'cashback_5',     label: 'Кэшбэк',  sublabel: '5% на счёт', track: 'free',    levelRequired: 2 },
    premiumReward: { id: 'r-2-prem',    type: 'internet_1gb',   label: '1 ГБ',    sublabel: 'Интернет',   track: 'premium', levelRequired: 2 },
  },
  {
    level: 3,
    freeReward:    { id: 'r-3-free',    type: 'internet_500mb', label: '500 МБ',   sublabel: 'Интернет',   track: 'free',    levelRequired: 3 },
    premiumReward: { id: 'r-3-prem',    type: 'minutes_100',    label: '100 Минут',sublabel: 'Звонки',     track: 'premium', levelRequired: 3 },
  },
  {
    level: 4,
    freeReward:    { id: 'r-4-free',    type: 'discount_10',    label: 'Скидка',   sublabel: '10% на тариф',track: 'free',   levelRequired: 4 },
    premiumReward: { id: 'r-4-prem',    type: 'internet_2gb',   label: '2 ГБ',    sublabel: 'Интернет',   track: 'premium', levelRequired: 4 },
  },
  {
    level: 5,
    freeReward:    { id: 'r-5-free',    type: 'cashback_5',     label: 'Кэшбэк',  sublabel: '5% на счёт', track: 'free',    levelRequired: 5 },
    premiumReward: { id: 'r-5-prem',    type: 'theme_exclusive',label: 'Тема',    sublabel: 'Эксклюзив',  track: 'premium', levelRequired: 5 },
  },
  {
    level: 6,
    freeReward:    { id: 'r-6-free',    type: 'internet_1gb',   label: '1 ГБ',    sublabel: 'Интернет',   track: 'free',    levelRequired: 6 },
    premiumReward: { id: 'r-6-prem',    type: 'cashback_10',    label: 'Кэшбэк',  sublabel: '10% на счёт',track: 'premium', levelRequired: 6 },
  },
  {
    level: 7,
    freeReward:    { id: 'r-7-free',    type: 'minutes_30',     label: '30 Минут', sublabel: 'Звонки',     track: 'free',    levelRequired: 7 },
    premiumReward: { id: 'r-7-prem',    type: 'internet_2gb',   label: '2 ГБ',    sublabel: 'Интернет',   track: 'premium', levelRequired: 7 },
  },
  {
    level: 8,
    freeReward:    { id: 'r-8-free',    type: 'internet_500mb', label: '500 МБ',   sublabel: 'Интернет',   track: 'free',    levelRequired: 8 },
    premiumReward: { id: 'r-8-prem',    type: 'discount_10',    label: 'Скидка',   sublabel: '10% на тариф',track: 'premium',levelRequired: 8 },
  },
  {
    level: 9,
    freeReward:    { id: 'r-9-free',    type: 'cashback_10',    label: 'Кэшбэк',  sublabel: '10% на счёт',track: 'free',    levelRequired: 9 },
    premiumReward: { id: 'r-9-prem',    type: 'minutes_100',    label: '100 Минут',sublabel: 'Звонки',     track: 'premium', levelRequired: 9 },
  },
  {
    level: 10,
    freeReward:    { id: 'r-10-free',   type: 'internet_1gb',   label: '1 ГБ',    sublabel: 'Интернет',   track: 'free',    levelRequired: 10 },
    premiumReward: { id: 'r-10-prem',   type: 'theme_exclusive',label: 'Тема',    sublabel: 'Эксклюзив',  track: 'premium', levelRequired: 10 },
  },
  {
    level: 11,
    freeReward:    { id: 'r-11-free',   type: 'internet_500mb', label: '500 МБ',   sublabel: 'Интернет',   track: 'free',    levelRequired: 11 },
    premiumReward: { id: 'r-11-prem',   type: 'internet_2gb',   label: '2 ГБ',    sublabel: 'Интернет',   track: 'premium', levelRequired: 11 },
  },
  {
    level: 12,
    freeReward:    { id: 'r-12-free',   type: 'discount_10',    label: 'Скидка',   sublabel: '10% на тариф',track: 'free',   levelRequired: 12 },
    premiumReward: { id: 'r-12-prem',   type: 'cashback_10',    label: 'Кэшбэк',  sublabel: '10% на счёт',track: 'premium', levelRequired: 12 },
  },
  {
    level: 13,
    freeReward:    { id: 'r-13-free',   type: 'cashback_5',     label: 'Кэшбэк',  sublabel: '5% на счёт', track: 'free',    levelRequired: 13 },
    premiumReward: { id: 'r-13-prem',   type: 'minutes_100',    label: '100 Минут',sublabel: 'Звонки',     track: 'premium', levelRequired: 13 },
  },
  {
    level: 14,
    freeReward:    { id: 'r-14-free',   type: 'internet_1gb',   label: '1 ГБ',    sublabel: 'Интернет',   track: 'free',    levelRequired: 14 },
    premiumReward: { id: 'r-14-prem',   type: 'internet_2gb',   label: '2 ГБ',    sublabel: 'Интернет',   track: 'premium', levelRequired: 14 },
  },
  {
    level: 15,
    freeReward:    { id: 'r-15-free',   type: 'cashback_10',    label: 'Кэшбэк',  sublabel: '10% на счёт',track: 'free',    levelRequired: 15 },
    premiumReward: { id: 'r-15-prem',   type: 'theme_exclusive',label: 'Тема',    sublabel: 'Эксклюзив',  track: 'premium', levelRequired: 15 },
  },
  {
    level: 16,
    freeReward:    { id: 'r-16-free',   type: 'internet_500mb', label: '500 МБ',   sublabel: 'Интернет',   track: 'free',    levelRequired: 16 },
    premiumReward: { id: 'r-16-prem',   type: 'minutes_100',    label: '100 Минут',sublabel: 'Звонки',     track: 'premium', levelRequired: 16 },
  },
  {
    level: 17,
    freeReward:    { id: 'r-17-free',   type: 'discount_10',    label: 'Скидка',   sublabel: '10% на тариф',track: 'free',   levelRequired: 17 },
    premiumReward: { id: 'r-17-prem',   type: 'cashback_10',    label: 'Кэшбэк',  sublabel: '10% на счёт',track: 'premium', levelRequired: 17 },
  },
  {
    level: 18,
    freeReward:    { id: 'r-18-free',   type: 'internet_1gb',   label: '1 ГБ',    sublabel: 'Интернет',   track: 'free',    levelRequired: 18 },
    premiumReward: { id: 'r-18-prem',   type: 'internet_2gb',   label: '2 ГБ',    sublabel: 'Интернет',   track: 'premium', levelRequired: 18 },
  },
  {
    level: 19,
    freeReward:    { id: 'r-19-free',   type: 'cashback_5',     label: 'Кэшбэк',  sublabel: '5% на счёт', track: 'free',    levelRequired: 19 },
    premiumReward: { id: 'r-19-prem',   type: 'minutes_100',    label: '100 Минут',sublabel: 'Звонки',     track: 'premium', levelRequired: 19 },
  },
  {
    level: 20,
    freeReward:    { id: 'r-20-free',   type: 'internet_2gb',   label: '2 ГБ',    sublabel: 'Интернет',   track: 'free',    levelRequired: 20 },
    premiumReward: { id: 'r-20-prem',   type: 'theme_exclusive',label: 'Тема',    sublabel: 'Эксклюзив',  track: 'premium', levelRequired: 20 },
  },
]
