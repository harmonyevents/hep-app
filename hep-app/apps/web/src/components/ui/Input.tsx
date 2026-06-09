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
  ({ label, error, hint, prefix, suffix, className, id, style, ...props }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="tracking-[0.08em] uppercase"
            style={{ fontSize: '0.75rem', fontWeight: 600, color: '#858585' }}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-sm select-none pointer-events-none" style={{ color: '#858585' }}>
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full text-sm px-4 py-3 outline-none transition-all duration-200',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              prefix && 'pl-9',
              suffix && 'pr-10',
              className
            )}
            style={{
              background: '#ffffff',
              border: error ? '1px solid #ba1a1a' : '1px solid #E4E4E4',
              borderRadius: 8,
              color: '#0A0A0A',
              fontFamily: 'Inter, sans-serif',
              ...style,
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#031635'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(3,22,53,0.08)' }}
            onBlur={e => { e.currentTarget.style.borderColor = error ? '#ba1a1a' : '#E4E4E4'; e.currentTarget.style.boxShadow = 'none' }}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-sm select-none pointer-events-none" style={{ color: '#858585' }}>
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="flex items-center gap-1" style={{ fontSize: '0.75rem', color: '#ba1a1a' }}>⚠ {error}</p>}
        {hint && !error && <p style={{ fontSize: '0.75rem', color: '#858585' }}>{hint}</p>}
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
  ({ label, error, hint, className, id, style, ...props }, ref) => {
    const inputId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="tracking-[0.08em] uppercase"
            style={{ fontSize: '0.75rem', fontWeight: 600, color: '#858585' }}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={cn(
            'w-full text-sm px-4 py-3 outline-none transition-all duration-200 resize-none',
            className
          )}
          style={{
            background: '#ffffff',
            border: error ? '1px solid #ba1a1a' : '1px solid #E4E4E4',
            borderRadius: 8,
            color: '#0A0A0A',
            fontFamily: 'Inter, sans-serif',
            ...style,
          }}
          onFocus={e => { e.currentTarget.style.borderColor = '#031635'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(3,22,53,0.08)' }}
          onBlur={e => { e.currentTarget.style.borderColor = error ? '#ba1a1a' : '#E4E4E4'; e.currentTarget.style.boxShadow = 'none' }}
          {...props}
        />
        {error && <p style={{ fontSize: '0.75rem', color: '#ba1a1a' }}>⚠ {error}</p>}
        {hint && !error && <p style={{ fontSize: '0.75rem', color: '#858585' }}>{hint}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
