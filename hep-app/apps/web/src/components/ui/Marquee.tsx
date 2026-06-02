interface MarqueeProps {
  children: React.ReactNode
  speed?: number
  reverse?: boolean
  pauseOnHover?: boolean
  className?: string
  gap?: string
}

/**
 * Seamless infinite horizontal marquee using CSS animation.
 * Renders two copies side-by-side; translateX(-50%) creates a perfect loop.
 */
export function Marquee({
  children,
  speed = 40,
  reverse = false,
  pauseOnHover = false,
  className = '',
  gap = '2rem',
}: MarqueeProps) {
  const animStyle: React.CSSProperties = {
    animation: `marquee ${speed}s linear infinite${reverse ? ' reverse' : ''}`,
    gap,
  }

  return (
    <div
      className={`overflow-hidden ${className}${pauseOnHover ? ' group' : ''}`}
    >
      <div
        className="flex w-max items-center"
        style={animStyle}
        {...(pauseOnHover && { 'data-pauseonhover': 'true' })}
      >
        <div className="flex items-center shrink-0" style={{ gap }}>
          {children}
        </div>
        <div className="flex items-center shrink-0" style={{ gap }} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
