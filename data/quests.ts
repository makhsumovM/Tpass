import type { Quest } from '@/types/tpass'

export const QUESTS: Quest[] = [
  // ── Ежедневные (только free) ──────────────────────────────────
  {
    id: 'q-daily-1',
    category: 'daily',
    track: 'free',
    icon: 'Wallet',
    title: 'Проверь баланс',
    description: 'Открой раздел «Баланс» в приложении',
    progressTotal: 1,
    xpReward: 20,
  },
  {
    id: 'q-daily-2',
    category: 'daily',
    track: 'free',
    icon: 'CreditCard',
    title: 'Пополни счёт',
    description: 'Пополни счёт любым способом',
    progressTotal: 1,
    xpReward: 50,
  },

  // ── Недельные — бесплатные ────────────────────────────────────
  {
    id: 'q-weekly-1',
    category: 'weekly',
    track: 'free',
    icon: 'Smartphone',
    title: 'Открой приложение 3 дня',
    description: 'Зайди в приложение в течение 3 разных дней',
    progressTotal: 3,
    xpReward: 100,
  },
  {
    id: 'q-weekly-2',
    category: 'weekly',
    track: 'free',
    icon: 'Flower2',
    title: 'Поздравь с Наврузом',
    description: 'Отправь праздничное поздравление другу через Tcell',
    progressTotal: 1,
    xpReward: 80,
  },

  // ── Недельные — премиум ───────────────────────────────────────
  {
    id: 'q-weekly-3',
    category: 'weekly',
    track: 'premium',
    icon: 'Plus',
    title: 'Подключи дополнительную услугу',
    description: 'Подключи любую платную услугу Tcell',
    progressTotal: 1,
    xpReward: 200,
  },
  {
    id: 'q-weekly-4',
    category: 'weekly',
    track: 'premium',
    icon: 'UserPlus',
    title: 'Пригласи друга на Навруз',
    description: 'Пригласи друга зарегистрироваться в Tcell',
    progressTotal: 1,
    xpReward: 300,
  },

  // ── Сезонные — бесплатные ─────────────────────────────────────
  {
    id: 'q-season-1',
    category: 'season',
    track: 'free',
    icon: 'Star',
    title: 'Достигни 10 уровня',
    description: 'Получи 10-й уровень в Tcell Pass',
    progressTotal: 10,
    xpReward: 500,
  },
  {
    id: 'q-season-2',
    category: 'season',
    track: 'free',
    icon: 'Sun',
    title: 'Наврузское пополнение',
    description: 'Пополни счёт суммарно на 50 сомони за сезон',
    progressTotal: 50,
    xpReward: 400,
  },

  // ── Сезонные — премиум ────────────────────────────────────────
  {
    id: 'q-season-3',
    category: 'season',
    track: 'premium',
    icon: 'Trophy',
    title: 'Чемпион Навруза',
    description: 'Получи 20-й уровень в Tcell Pass',
    progressTotal: 20,
    xpReward: 1000,
  },
  {
    id: 'q-season-4',
    category: 'season',
    track: 'premium',
    icon: 'Sparkles',
    title: 'Праздничный спонсор',
    description: 'Пополни счёт суммарно на 200 сомони за сезон',
    progressTotal: 200,
    xpReward: 800,
  },
  {
    id: 'q-season-5',
    category: 'season',
    track: 'premium',
    icon: 'Crown',
    title: 'Активируй Tcell Pass',
    description: 'Оформи подписку Tcell Pass в честь Навруза',
    progressTotal: 1,
    xpReward: 1500,
  },
]
