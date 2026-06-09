import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const CARD_STYLE = { background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: 8 }
const CARD_ELEVATED_STYLE = { background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0px 10px 30px rgba(26,43,75,0.08)' }

const cardVariants = cva(
  'relative overflow-hidden transition-all duration-200',
  {
    variants: {
      variant: {
        default: '',
        elevated: '',
        vivid: '',
        flat: 'bg-transparent',
        ghost: 'bg-transparent border border-transparent',
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
  ({ variant, hover, glow, className, children, onClick, style, ...props }, ref) => {
    const baseStyle = variant === 'elevated' ? CARD_ELEVATED_STYLE : (variant === 'flat' || variant === 'ghost') ? {} : CARD_STYLE
    return (
      <motion.div
        ref={ref}
        onClick={onClick}
        whileHover={hover ? { y: -3 } : undefined}
        transition={{ duration: 0.2 }}
        className={cn(
          cardVariants({ variant }),
          hover && 'cursor-pointer',
          className
        )}
        style={{ ...baseStyle, ...style }}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {children}
      </motion.div>
    )
  }
)
Card.displayName = 'Card'

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 pt-6 pb-4', className)} style={{ borderBottom: '1px solid #E2E8F0' }}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('font-display text-xl font-semibold', className)} style={{ color: '#031635' }}>{children}</h3>
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-sm mt-1', className)} style={{ color: '#44474e' }}>{children}</p>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-5', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 flex items-center gap-3', className)} style={{ borderTop: '1px solid #E2E8F0' }}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-5', className)}>{children}</div>
}
