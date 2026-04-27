import { motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'

// Radial particle ring — used for stage advances and the boom finale.
export default function ParticleBurst({ id, x, y, count = 14, color = '#fbbf24', radius = 100, duration = 0.7, onDone }) {
  const particles = useMemo(() => (
    Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3
      const r = radius * (0.7 + Math.random() * 0.4)
      return {
        i,
        dx: Math.cos(angle) * r,
        dy: Math.sin(angle) * r,
        size: 4 + Math.random() * 6,
        delay: Math.random() * 0.05,
      }
    })
  ), [count, radius])

  useEffect(() => {
    const t = setTimeout(onDone, duration * 1000 + 100)
    return () => clearTimeout(t)
  }, [onDone, duration])

  return (
    <div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 25 }}>
      {particles.map(pt => (
        <motion.div
          key={pt.i}
          style={{
            position: 'absolute',
            left: 0, top: 0,
            width: pt.size, height: pt.size,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 ${pt.size * 2}px ${color}`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: pt.dx, y: pt.dy, opacity: 0, scale: 0.3 }}
          transition={{ duration, delay: pt.delay, ease: [0.2, 0.7, 0.4, 1] }}
        />
      ))}
    </div>
  )
}
