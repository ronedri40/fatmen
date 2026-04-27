import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function FloatingHamburger({ id, startX, startY, targetX, targetY, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 600)
    return () => clearTimeout(t)
  }, [onDone])

  // Element is positioned at startX/startY via left/top.
  // We animate it to targetX/targetY using x/y transform offsets for performance.
  const dx = targetX - startX
  const dy = targetY - startY

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
        zIndex: 9999,
        fontSize: 32,
        lineHeight: 1,
      }}
      initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
      animate={{ x: dx, y: dy, scale: 0.25, opacity: 0, rotate: -180 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 1, 1] }}
    >
      🍔
    </motion.div>
  )
}
