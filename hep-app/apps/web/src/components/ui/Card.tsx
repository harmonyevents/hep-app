import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  'relative overflow-hidden transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'glass border border-white/8',
        elevated: 'glass border border-white/8 shadow-[0_8px_40px_rgba(0,0,0,0.4)]',
        vivid: 'glass border border-vivid/20 shadow-[0_0_24px_rgba(34,81,255,0.12)]',
        flat: 'bg-transparent border border-white/10',
        ghost: 'bg-white/3 border border-transparent',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  hover?: boolean
  glow?: boolean
  as?: 'div' | 'article' | 'section'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant, hover, glow, className, children, onClick, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        onClick={onClick}
        whileHover={hover ? { y: -3, borderColor: 'rgba(34,81,255,0.3)' } : undefined}
        transition={{ duration: 0.2 }}
        className={cn(
          cardVariants({ variant }),
          hover && 'cursor-pointer',
          glow && 'shadow-[0_0_40px_rgba(34,81,255,0.2)]',
          className
        )}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {hover && (
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-vivid/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        )}
        {children}
      </motion.div>
    )
  }
)
Card.displayName = 'Card'

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 pt-6 pb-4 border-b border-white/8', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('font-display text-xl font-light text-white', className)}>{children}</h3>
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-sm text-muted-hep mt-1', className)}>{children}</p>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-5', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-white/8 flex items-center gap-3', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-5', className)}>{children}</div>
}
