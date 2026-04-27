import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { FAT_STAGES } from '../../constants/gameConfig'
import FatManSVG from './FatManSVG'

export default function Character({ level, fatStage, isBooming, mouthRef, tapEventId, levelData }) {
  const stageInfo = FAT_STAGES[fatStage] || FAT_STAGES[0]
  const controls = useAnimation()
  const lastTapRef = useRef(0)

  // Snappy chomp squash: 12-frame compress → bounce → settle.
  // Total duration ~120ms so rapid taps still feel responsive at 8+ taps/sec.
  useEffect(() => {
    if (tapEventId === lastTapRef.current) return
    lastTapRef.current = tapEventId
    if (tapEventId === 0) return
    controls.start({
      scaleX: [1, 1.08, 0.96, 1.02, 1],
      scaleY: [1, 0.9, 1.06, 0.99, 1],
      transition: { duration: 0.14, ease: [0.34, 1.56, 0.64, 1], times: [0, 0.25, 0.55, 0.8, 1] },
    })
  }, [tapEventId, controls])

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <AnimatePresence mode="wait">
        {isBooming ? (
          <motion.div
            key={`boom-${level}`}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: [1, 1.4, 0.05, 4], opacity: [1, 1, 1, 0] }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            style={{ fontSize: 140, lineHeight: 1 }}
          >
            💥
          </motion.div>
        ) : (
          <motion.div
            key={`character-${level}`}
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            style={{ width: '100%', maxWidth: 280 }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            >
              <motion.div animate={controls} style={{ transformOrigin: '50% 80%' }}>
                <FatManSVG
                  stage={fatStage}
                  palette={levelData.palette}
                  accessories={levelData.accessories}
                  mouthRef={mouthRef}
                  level={level}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isBooming && (
        <motion.div
          key={`stage-${fatStage}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase"
          style={{
            color: stageInfo.color,
            border: `1px solid ${stageInfo.color}66`,
            background: `${stageInfo.color}1a`,
            boxShadow: `0 0 20px ${stageInfo.color}33`,
          }}
        >
          {stageInfo.label}
        </motion.div>
      )}
    </div>
  )
}
