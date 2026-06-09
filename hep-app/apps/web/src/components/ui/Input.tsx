import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
  label?: string
  error?: string
  hint?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, suffix, className, id, ...props }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-sky/80"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-muted-hep text-sm select-none pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-mid/40 border text-white placeholder-sky/35 font-body text-sm px-4 py-3',
              'outline-none transition-all duration-200',
              'focus:border-vivid/70 focus:bg-mid/60 focus:shadow-[0_0_0_3px_rgba(34,81,255,0.12)]',
              'hover:border-white/20',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              error ? 'border-error/60 focus:border-error' : 'border-white/10',
              prefix && 'pl-9',
              suffix && 'pr-10',
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-muted-hep text-sm select-none pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="text-error text-[0.72rem] flex items-center gap-1">⚠ {error}</p>}
        {hint && !error && <p className="text-muted-hep text-[0.72rem]">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-sky/80"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={cn(
            'w-full bg-mid/40 border text-white placeholder-sky/35 font-body text-sm px-4 py-3',
            'outline-none transition-all duration-200 resize-none',
            'focus:border-vivid/70 focus:bg-mid/60 focus:shadow-[0_0_0_3px_rgba(34,81,255,0.12)]',
            'hover:border-white/20',
            error ? 'border-error/60' : 'border-white/10',
            className
          )}
          {...props}
        />
        {error && <p className="text-error text-[0.72rem]">⚠ {error}</p>}
        {hint && !error && <p className="text-muted-hep text-[0.72rem]">{hint}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
