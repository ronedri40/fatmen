import { motion, AnimatePresence } from 'framer-motion'

// Animated tapping-finger overlay. Shown to first-time players until they've
// tapped enough that the loop is obvious. Pure visual — pointer-events: none
// so it doesn't intercept the actual tap.
export default function FingerCue({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="fingercue"
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
        >
          <div className="flex flex-col items-center gap-2 -mt-10">
            {/* tap ripple */}
            <motion.div
              className="absolute"
              style={{
                width: 110, height: 110, borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.85)',
                boxShadow: '0 0 30px rgba(255,255,255,0.4)',
              }}
              animate={{ scale: [0.5, 1.4], opacity: [0.9, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute"
              style={{
                width: 110, height: 110, borderRadius: '50%',
                border: '3px solid rgba(251,146,60,0.9)',
              }}
              animate={{ scale: [0.5, 1.4], opacity: [0.9, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
            />

            {/* finger emoji bouncing onto the target */}
            <motion.div
              style={{ fontSize: 64, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }}
              animate={{ y: [0, 14, 0], scale: [1, 0.92, 1] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: [0.55, 0, 0.55, 1] }}
            >
              👆
            </motion.div>
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="px-4 py-1 rounded-full text-[11px] font-black tracking-[0.3em] uppercase text-white/90"
              style={{
                background: 'rgba(0,0,0,0.55)',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(4px)',
              }}
            >
              Tap to feed
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
