interface SectionLabelProps {
  children: React.ReactNode
  center?: boolean
  className?: string
}

export function SectionLabel({ children, center = false, className = '' }: SectionLabelProps) {
  return (
    <p className={`text-[0.68rem] font-semibold tracking-[0.34em] uppercase text-vivid flex items-center gap-3 mb-3
      ${center ? 'justify-center' : ''}
      ${className}
    `}>
      <span className="w-6 h-px bg-vivid flex-shrink-0" />
      {children}
    </p>
  )
}
