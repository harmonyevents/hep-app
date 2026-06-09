import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2',
    'font-body font-semibold uppercase tracking-widest',
    'transition-all duration-200 cursor-pointer outline-none select-none overflow-hidden',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'text-white',
        ],
        outline: [
          'bg-transparent border',
        ],
        ghost: 'bg-transparent',
        danger: [
          'text-white',
        ],
        link: 'bg-transparent underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'px-4 py-2 text-[0.62rem] tracking-[0.18em]',
        md: 'px-6 py-3 text-[0.68rem] tracking-[0.14em]',
        lg: 'px-8 py-4 text-[0.75rem] tracking-[0.15em]',
        icon: 'w-9 h-9 p-0 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...props }, ref) => {
    const isPrimary = variant === 'primary'

    const primaryStyle = variant === 'primary' ? { background: '#1a2b4b', color: '#ffffff', borderRadius: 8 } : {}
    const outlineStyle = variant === 'outline' ? { borderColor: '#1a2b4b', color: '#1a2b4b', borderRadius: 8 } : {}
    const dangerStyle = variant === 'danger' ? { background: '#ba1a1a', color: '#ffffff', borderRadius: 8 } : {}
    const ghostStyle = variant === 'ghost' ? { color: '#44474e' } : {}
    const linkStyle = variant === 'link' ? { color: '#1a2b4b' } : {}
    const combinedStyle = { ...primaryStyle, ...outlineStyle, ...dangerStyle, ...ghostStyle, ...linkStyle }

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !loading ? { y: -2 } : undefined}
        whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
        transition={{ duration: 0.15 }}
        className={cn(buttonVariants({ variant, size }), className)}
        style={combinedStyle}
        disabled={disabled || loading}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {isPrimary && !disabled && !loading && (
          <span className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            <motion.span
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)',
                width: '60%',
              }}
              animate={{ x: ['-100%', '280%'] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'linear', repeatDelay: 0.9 }}
            />
          </span>
        )}
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : icon ? (
          <span className="text-base leading-none">{icon}</span>
        ) : null}
        {children}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'

export { buttonVariants }
