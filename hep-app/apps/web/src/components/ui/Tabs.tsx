import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs = RadixTabs.Root

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <RadixTabs.List
      className={cn(
        'inline-flex items-center gap-1 p-1 glass border border-white/8',
        className
      )}
    >
      {children}
    </RadixTabs.List>
  )
}

export function TabsTrigger({
  children,
  value,
  className,
}: {
  children: React.ReactNode
  value: string
  className?: string
}) {
  return (
    <RadixTabs.Trigger
      value={value}
      className={cn(
        'px-4 py-2 text-[0.65rem] font-semibold tracking-[0.14em] uppercase transition-all duration-200 outline-none',
        'text-white/45 hover:text-white/70',
        'data-[state=active]:text-white data-[state=active]:bg-vivid/20 data-[state=active]:shadow-[0_0_12px_rgba(34,81,255,0.2)]',
        className
      )}
    >
      {children}
    </RadixTabs.Trigger>
  )
}

export function TabsContent({
  children,
  value,
  className,
}: {
  children: React.ReactNode
  value: string
  className?: string
}) {
  return (
    <RadixTabs.Content value={value} className={cn('outline-none', className)}>
      {children}
    </RadixTabs.Content>
  )
}
