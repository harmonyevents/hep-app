import {
  Zap, Shield, CheckCircle, ArrowRight, MapPin, Calendar, Users, FileText,
  Star, Bell, TrendingUp, Award, ChevronDown, ChevronRight, X, Plus, Lock,
  Clipboard, Clock, Phone, Eye, Building, RefreshCw, Music, Camera, Mic,
  Truck, Cpu, Percent, Scissors, Printer, PlusCircle, Briefcase, Check,
  type LucideProps,
} from 'lucide-react'

type IconName =
  | 'zap' | 'shield' | 'check-circle' | 'arrow-right' | 'map-pin'
  | 'calendar' | 'users' | 'file-text' | 'star' | 'bell' | 'trending-up'
  | 'award' | 'chevron-down' | 'chevron-right' | 'x' | 'plus' | 'lock'
  | 'clipboard' | 'clock' | 'phone' | 'eye' | 'building' | 'refresh-cw'
  | 'music' | 'camera' | 'mic' | 'truck' | 'cpu' | 'percent'
  | 'scissors' | 'printer' | 'plus-circle' | 'briefcase' | 'check'

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName
  size?: number
  strokeWidth?: number
}

const ICON_MAP: Record<IconName, React.ComponentType<LucideProps>> = {
  'zap': Zap,
  'shield': Shield,
  'check-circle': CheckCircle,
  'arrow-right': ArrowRight,
  'map-pin': MapPin,
  'calendar': Calendar,
  'users': Users,
  'file-text': FileText,
  'star': Star,
  'bell': Bell,
  'trending-up': TrendingUp,
  'award': Award,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  'x': X,
  'plus': Plus,
  'lock': Lock,
  'clipboard': Clipboard,
  'clock': Clock,
  'phone': Phone,
  'eye': Eye,
  'building': Building,
  'refresh-cw': RefreshCw,
  'music': Music,
  'camera': Camera,
  'mic': Mic,
  'truck': Truck,
  'cpu': Cpu,
  'percent': Percent,
  'scissors': Scissors,
  'printer': Printer,
  'plus-circle': PlusCircle,
  'briefcase': Briefcase,
  'check': Check,
}

export function Icon({ name, size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  const Component = ICON_MAP[name]
  if (!Component) return null
  return <Component size={size} strokeWidth={strokeWidth} {...props} />
}

export type { IconName }
