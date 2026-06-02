import { useEffect, useRef } from 'react'

interface Orb {
  x: number; y: number
  rx: number; ry: number
  color: [number, number, number]
  alpha: number
  sx: number; sy: number
  phase: number
}

const ORBS: Orb[] = [
  { x: 0.14, y: 0.28, rx: 0.55, ry: 0.42, color: [34,  81,  255], alpha: 0.085, sx: 0.00062, sy: 0.00044, phase: 0.0 },
  { x: 0.78, y: 0.62, rx: 0.45, ry: 0.32, color: [77,  112, 255], alpha: 0.065, sx: 0.00078, sy: 0.00051, phase: 1.5 },
  { x: 0.50, y: 0.08, rx: 0.42, ry: 0.28, color: [18,  52,  128], alpha: 0.10,  sx: 0.00054, sy: 0.00069, phase: 3.0 },
  { x: 0.22, y: 0.80, rx: 0.48, ry: 0.30, color: [34,  81,  255], alpha: 0.055, sx: 0.00045, sy: 0.00038, phase: 2.0 },
  { x: 0.88, y: 0.18, rx: 0.36, ry: 0.22, color: [100, 148, 255], alpha: 0.045, sx: 0.00091, sy: 0.00062, phase: 4.2 },
]

export function AuroraBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let t = 0

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      t += 0.55
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'screen'

      for (const orb of ORBS) {
        const cx = (orb.x + Math.sin(t * orb.sx + orb.phase) * 0.17) * canvas.width
        const cy = (orb.y + Math.cos(t * orb.sy + orb.phase) * 0.13) * canvas.height
        const rx = orb.rx * canvas.width
        const ry = orb.ry * canvas.height

        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(1, ry / rx)

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
        const [r, g, b] = orb.color
        grad.addColorStop(0,   `rgba(${r},${g},${b},${orb.alpha})`)
        grad.addColorStop(0.45, `rgba(${r},${g},${b},${(orb.alpha * 0.38).toFixed(3)})`)
        grad.addColorStop(1,   `rgba(${r},${g},${b},0)`)

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(0, 0, rx, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
    />
  )
}
