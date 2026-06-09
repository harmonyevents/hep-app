import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-mono-hep font-semibold tracking-widest uppercase',
  {
    variants: {
      variant: {
        default:  'bg-vivid/15 text-vlight border border-vivid/30',
        vivid:    'bg-vivid/15 text-vlight border border-vivid/30',
        success:  'bg-success/15 text-success border border-success/30',
        warning:  'bg-warn/15 text-warn border border-warn/30',
        warn:     'bg-warn/15 text-warn border border-warn/30',
        error:    'bg-error/15 text-error border border-error/30',
        sky:      'bg-sky/10 text-sky border border-sky/20',
        ghost:    'bg-white/5 text-white/60 border border-white/10',
        outline:  'bg-transparent text-white/60 border border-white/20',
      },
      size: {
        sm: 'px-2 py-0.5 text-[0.55rem]',
        md: 'px-2.5 py-0.5 text-[0.6rem]',
        lg: 'px-3 py-1 text-[0.65rem]',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

export function Badge({ variant, size, dot, children, className, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
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
