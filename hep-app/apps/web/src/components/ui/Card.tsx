import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', hover = false, glow = false, onClick }: CardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -4, borderColor: 'rgba(34,81,255,0.35)' } : undefined}
      transition={{ duration: 0.2 }}
      className={`
        glass border-vivid-subtle relative overflow-hidden
        ${hover ? 'cursor-pointer' : ''}
        ${glow ? 'glow-vivid' : ''}
        ${className}
      `}
    >
      {hover && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-vivid scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
      )}
      {children}
    </motion.div>
  )
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 pt-6 pb-4 border-b border-vivid-subtle ${className}`}>{children}</div>
}

export function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>
}
