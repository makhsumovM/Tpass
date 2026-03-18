import { Wifi, Phone, BadgeDollarSign, Tag, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RewardType } from '@/types/tpass'

interface RewardIconProps {
  type: RewardType
  size?: number
  isPrem?: boolean
}

const iconMap: Record<RewardType, React.ElementType> = {
  internet_500mb:  Wifi,
  internet_1gb:    Wifi,
  internet_2gb:    Wifi,
  minutes_30:      Phone,
  minutes_100:     Phone,
  cashback_5:      BadgeDollarSign,
  cashback_10:     BadgeDollarSign,
  discount_10:     Tag,
  theme_exclusive: Sparkles,
}

const colorMap: Record<RewardType, string> = {
  internet_500mb:  'text-blue-400',
  internet_1gb:    'text-blue-400',
  internet_2gb:    'text-blue-400',
  minutes_30:      'text-green-400',
  minutes_100:     'text-green-400',
  cashback_5:      'text-amber-400',
  cashback_10:     'text-amber-400',
  discount_10:     'text-orange-400',
  theme_exclusive: 'text-violet-400',
}

// Тип-специфичный фон иконки — используется в RewardCard
export const iconBgMap: Record<RewardType, string> = {
  internet_500mb:  'bg-blue-500/15 ring-1 ring-blue-400/30',
  internet_1gb:    'bg-blue-500/15 ring-1 ring-blue-400/30',
  internet_2gb:    'bg-blue-500/20 ring-1 ring-blue-400/40',
  minutes_30:      'bg-green-500/15 ring-1 ring-green-400/30',
  minutes_100:     'bg-green-500/20 ring-1 ring-green-400/40',
  cashback_5:      'bg-amber-500/15 ring-1 ring-amber-400/30',
  cashback_10:     'bg-amber-500/20 ring-1 ring-amber-400/40',
  discount_10:     'bg-orange-500/15 ring-1 ring-orange-400/30',
  theme_exclusive: 'bg-violet-500/20 ring-1 ring-violet-400/40',
}

export function RewardIcon({ type, size = 22, isPrem = false }: RewardIconProps) {
  const Icon  = iconMap[type]
  const color = isPrem ? 'text-amber-400' : colorMap[type]
  return <Icon size={size} className={cn(color)} />
}
