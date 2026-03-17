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
  internet_2gb:    'text-blue-500',
  minutes_30:      'text-green-400',
  minutes_100:     'text-green-500',
  cashback_5:      'text-yellow-400',
  cashback_10:     'text-yellow-500',
  discount_10:     'text-orange-400',
  theme_exclusive: 'text-tcell-accent-light',
}

export function RewardIcon({ type, size = 20, isPrem = false }: RewardIconProps) {
  const Icon = iconMap[type]
  const color = isPrem ? 'text-yellow-400' : colorMap[type]
  return <Icon size={size} className={cn(color)} />
}
