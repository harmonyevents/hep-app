import { forwardRef } from 'react'
import { motion } from 'framer-motion'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
}

const variants: Record<Variant, string> = {
  primary: [
    'text-white',
    'bg-vivid-gradient',
    'shadow-[0_6px_24px_rgba(34,81,255,0.4)]',
    'hover:shadow-[0_8px_40px_rgba(34,81,255,0.6)]',
  ].join(' '),
  outline: 'bg-transparent text-white border border-white/25 hover:border-vivid/70 hover:text-vivid hover:shadow-[0_0_24px_rgba(34,81,255,0.2)]',
  ghost:   'bg-transparent text-sky hover:text-white hover:bg-white/5',
  danger:  'bg-error text-white hover:bg-red-600 shadow-[0_4px_16px_rgba(239,68,68,0.35)]',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-[0.65rem] tracking-[0.18em]',
  md: 'px-6 py-3 text-[0.7rem] tracking-[0.14em]',
  lg: 'px-8 py-4 text-[0.75rem] tracking-[0.15em]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props }, ref) => {
    const isPrimary = variant === 'primary'

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !loading ? { y: -2 } : undefined}
        whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
        transition={{ duration: 0.15 }}
        className={`
          relative inline-flex items-center justify-center gap-2 font-body font-semibold uppercase
          transition-all duration-200 cursor-pointer outline-none select-none overflow-hidden
          disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
          ${variants[variant]} ${sizes[size]} ${className}
        `}
        disabled={disabled || loading}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {/* Shimmer sweep — primary only */}
        {isPrimary && !disabled && !loading && (
          <span className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            <motion.span
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)',
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
