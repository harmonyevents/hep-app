import * as RadixTooltip from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

export const TooltipProvider = RadixTooltip.Provider
export const TooltipRoot = RadixTooltip.Root
export const TooltipTrigger = RadixTooltip.Trigger

export function TooltipContent({
  children,
  className,
  side = 'top',
  ...props
}: {
  children: React.ReactNode
  className?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
} & Omit<React.ComponentPropsWithoutRef<typeof RadixTooltip.Content>, 'side'>) {
  return (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        side={side}
        sideOffset={6}
        className={cn(
          'z-50 px-3 py-1.5 text-[0.68rem] font-body text-white',
          'glass border border-white/10',
          'animate-in fade-in-0 zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          className
        )}
        {...props}
      >
        {children}
        <RadixTooltip.Arrow className="fill-mid/80" />
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  )
}

export function Tooltip({
  content,
  children,
  side,
}: {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </RadixTooltip.Root>
  )
}
