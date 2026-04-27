import { motion } from 'framer-motion'
import { useMemo } from 'react'

const COLORS = ['#fbbf24', '#22c55e', '#3b82f6', '#ec4899', '#fb923c', '#a855f7']

export default function Confetti({ count = 80, durationRange = [2.4, 4.2] }) {
  const pieces = useMemo(() => (
    Array.from({ length: count }).map((_, i) => ({
      i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: durationRange[0] + Math.random() * (durationRange[1] - durationRange[0]),
      color: COLORS[i % COLORS.length],
      drift: (Math.random() - 0.5) * 60,
      rotate: Math.random() * 720 - 360,
      size: 5 + Math.random() * 6,
    }))
  ), [count, durationRange])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map(p => (
        <motion.div
          key={p.i}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            borderRadius: 1,
          }}
          initial={{ y: -30, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: '110vh', x: p.drift, rotate: p.rotate, opacity: [1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'linear', repeat: Infinity }}
        />
      ))}
    </div>
  )
}
