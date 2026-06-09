import { cn } from '@/lib/utils'

const BADGE_STYLES: Record<string, React.CSSProperties> = {
  default:  { background: 'rgba(239,239,239,0.8)', color: '#3D3D3D', border: '1px solid #E4E4E4', borderRadius: 999 },
  vivid:    { background: 'rgba(26,43,75,0.10)', color: '#1a2b4b', border: '1px solid rgba(26,43,75,0.20)', borderRadius: 999 },
  success:  { background: 'rgba(34,197,94,0.10)', color: '#166534', border: '1px solid rgba(34,197,94,0.30)', borderRadius: 999 },
  warning:  { background: 'rgba(245,158,11,0.10)', color: '#92400e', border: '1px solid rgba(245,158,11,0.30)', borderRadius: 999 },
  warn:     { background: 'rgba(245,158,11,0.10)', color: '#92400e', border: '1px solid rgba(245,158,11,0.30)', borderRadius: 999 },
  error:    { background: 'rgba(186,26,26,0.10)', color: '#ba1a1a', border: '1px solid rgba(186,26,26,0.30)', borderRadius: 999 },
  sky:      { background: 'rgba(212,175,55,0.10)', color: '#8a6d00', border: '1px solid rgba(212,175,55,0.30)', borderRadius: 999 },
  ghost:    { background: 'rgba(25,28,30,0.06)', color: '#3D3D3D', border: '1px solid #E4E4E4', borderRadius: 999 },
  outline:  { background: 'transparent', color: '#3D3D3D', border: '1px solid #E4E4E4', borderRadius: 999 },
}

const SIZE_CLASSES: Record<string, string> = {
  sm: 'px-2 py-0.5',
  md: 'px-2.5 py-0.5',
  lg: 'px-3 py-1',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'vivid' | 'success' | 'warning' | 'warn' | 'error' | 'sky' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

export function Badge({ variant = 'default', size = 'md', dot, children, className, style, ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 font-semibold tracking-wide uppercase', SIZE_CLASSES[size], className)}
      style={{ fontSize: '0.75rem', ...BADGE_STYLES[variant], ...style }}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            variant === 'success'
              ? 'bg-success animate-[ping-dot_2s_ease-in-out_infinite]'
              : 'bg-current'
          )}
        />
      )}
      {children}
    </span>
  )
}
