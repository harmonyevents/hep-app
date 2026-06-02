type BadgeVariant = 'vivid' | 'success' | 'warn' | 'error' | 'sky' | 'ghost'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  dot?: boolean
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  vivid: 'bg-vivid/15 text-vlight border border-vivid/30',
  success: 'bg-success/15 text-success border border-success/30',
  warn: 'bg-warn/15 text-warn border border-warn/30',
  error: 'bg-error/15 text-error border border-error/30',
  sky: 'bg-sky/10 text-sky border border-sky/20',
  ghost: 'bg-white/5 text-white/60 border border-white/10',
}

export function Badge({ children, variant = 'vivid', dot = false, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[0.6rem] font-mono-hep font-semibold tracking-widest uppercase ${variants[variant]} ${className}`}>
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            variant === 'success' ? 'bg-success animate-[ping-dot_2s_ease-in-out_infinite]' : 'bg-current'
          }`}
        />
      )}
      {children}
    </span>
  )
}
