import * as RadixProgress from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  label?: string
}

export function Progress({ value, max = 100, className, barClassName, label }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <RadixProgress.Root
      value={value}
      max={max}
      className={cn(
        'relative h-1.5 w-full overflow-hidden bg-white/8 rounded-full',
        className
      )}
      aria-label={label}
    >
      <RadixProgress.Indicator
        className={cn(
          'h-full bg-gradient-to-r from-vivid to-vlight rounded-full transition-all duration-500 ease-out',
          barClassName
        )}
        style={{ width: `${pct}%` }}
      />
    </RadixProgress.Root>
  )
}

export function StepProgress({
  current,
  total,
  className,
}: {
  current: number
  total: number
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            'h-0.5 flex-1 rounded-full transition-all duration-300',
            i < current ? 'bg-vivid' : i === current ? 'bg-vivid/50' : 'bg-white/12'
          )}
        />
      ))}
    </div>
  )
}
