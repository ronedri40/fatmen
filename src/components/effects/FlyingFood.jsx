import { motion } from 'framer-motion'
import { useEffect } from 'react'

// A piece of food (emoji) that flies from tap point → mouth with an arc.
export default function FlyingFood({ id, food, startX, startY, targetX, targetY, onDone, combo = 0 }) {
  useEffect(() => {
    const t = setTimeout(onDone, 520)
    return () => clearTimeout(t)
  }, [onDone])

  const dx = targetX - startX
  const dy = targetY - startY
  const arcY = Math.min(dy * 0.4, -40) - 60
  const spin = combo % 2 ? -360 : 360

  return (
    <motion.div
      key={id}
      style={{
        position: 'fixed',
        left: startX,
        top: startY,
        translateX: '-50%',
        translateY: '-50%',
        pointerEvents: 'none',
        zIndex: 30,
        fontSize: 30 + Math.min(combo * 0.5, 8),
        lineHeight: 1,
        filter: combo > 10 ? `drop-shadow(0 0 8px #fbbf24)` : 'none',
      }}
      initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
      animate={{
        x: [0, dx * 0.5, dx],
        y: [0, arcY, dy],
        scale: [1, 1.1, 0.25],
        opacity: [1, 1, 0],
        rotate: [0, spin / 2, spin],
      }}
      transition={{ duration: 0.45, ease: [0.32, 0.72, 0.4, 1], times: [0, 0.5, 1] }}
    >
      {food}
    </motion.div>
  )
}
