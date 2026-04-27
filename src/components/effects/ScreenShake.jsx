import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

// Wraps children and shakes them when `triggerId` changes. Intensity 0..1.
export default function ScreenShake({ triggerId, intensity = 0.5, children }) {
  const controls = useAnimation()

  useEffect(() => {
    if (!triggerId) return
    const amp = 6 + intensity * 18
    controls.start({
      x: [0, -amp, amp, -amp * 0.5, amp * 0.5, 0],
      y: [0, amp * 0.5, -amp * 0.5, amp * 0.3, 0],
      transition: { duration: 0.35, ease: 'easeOut' },
    })
  }, [triggerId, intensity, controls])

  return (
    <motion.div animate={controls} style={{ width: '100%', height: '100%' }}>
      {children}
    </motion.div>
  )
}
