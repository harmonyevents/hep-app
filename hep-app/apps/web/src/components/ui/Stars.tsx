interface StarsProps {
  value: number
  max?: number
  size?: 'sm' | 'md'
  showValue?: boolean
}

export function Stars({ value, max = 5, size = 'sm', showValue = false }: StarsProps) {
  const sz = size === 'sm' ? 'text-xs' : 'text-base'
  return (
    <span className={`inline-flex items-center gap-0.5 ${sz}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < Math.floor(value) ? 'text-warn' : 'text-white/15'}>
          ★
        </span>
      ))}
      {showValue && (
        <span className="ml-1 text-muted-hep font-mono-hep text-[0.68rem]">{value.toFixed(1)}</span>
      )}
    </span>
  )
}
