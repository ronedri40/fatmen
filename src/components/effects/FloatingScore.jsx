import { motion } from 'framer-motion'
import { useEffect } from 'react'

// A "+10 ×1.5" pop-up that floats up + fades out from a point.
export default function FloatingScore({ id, x, y, value, mult, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 800)
    return () => clearTimeout(t)
  }, [onDone])

  const big = mult >= 2
  const color = mult >= 2.5 ? '#fb923c' : mult >= 1.5 ? '#facc15' : '#ffffff'

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: x, top: y,
        translateX: '-50%', translateY: '-50%',
        pointerEvents: 'none',
        zIndex: 40,
        fontWeight: 900,
        fontSize: big ? 24 : 18,
        color,
        textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 0 12px ' + color + '88',
        whiteSpace: 'nowrap',
      }}
      initial={{ y: 0, opacity: 0, scale: 0.6 }}
      animate={{ y: -60, opacity: [0, 1, 1, 0], scale: [0.6, 1.15, 1, 0.95] }}
      transition={{ duration: 0.75, ease: 'easeOut', times: [0, 0.15, 0.5, 1] }}
    >
      +{value}{mult > 1 ? ` ×${mult.toFixed(1)}` : ''}
    </motion.div>
  )
}
