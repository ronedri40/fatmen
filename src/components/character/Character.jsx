import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { FAT_STAGES } from '../../constants/gameConfig'
import FatManSVG from './FatManSVG'

export default function Character({ level, fatStage, isBooming, mouthRef, tapEventId, levelData, combo = 0, stageProgress = 0 }) {
  const stageInfo = FAT_STAGES[fatStage] || FAT_STAGES[0]
  const controls = useAnimation()
  const lastTapRef = useRef(0)

  const showAura = combo >= 10
  const isRainbow = combo >= 25
  const isUltra = combo >= 50
  const auraIntensity = showAura ? Math.min(1, (combo - 10) / 40) : 0

  // Float stage: e.g. fatStage=2, stageProgress=0.4 → 2.4
  // Clamped to max stage so character never exceeds OBESE geometry
  const floatStage = Math.min(fatStage + stageProgress, FAT_STAGES.length - 1)

  // Eating lunge: character stretches UP toward incoming food, then settles.
  // Looks like catching/eating rather than being hit.
  useEffect(() => {
    if (tapEventId === lastTapRef.current) return
    lastTapRef.current = tapEventId
    if (tapEventId === 0) return
    controls.start({
      scaleX: [1, 0.94, 1.03, 1],
      scaleY: [1, 1.12, 0.97, 1],
      y: [0, -10, 2, 0],
      transition: { duration: 0.18, ease: [0.34, 1.56, 0.64, 1], times: [0, 0.3, 0.7, 1] },
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
              <motion.div animate={controls} style={{ transformOrigin: '50% 80%', position: 'relative' }}>
                {showAura && (
                  <motion.div
                    className="absolute pointer-events-none"
                    style={{
                      inset: '-20%',
                      borderRadius: '50%',
                      zIndex: 0,
                      background: isRainbow
                        ? 'conic-gradient(from 0deg, #f87171, #fb923c, #facc15, #4ade80, #60a5fa, #c084fc, #f472b6, #f87171)'
                        : `radial-gradient(circle, #fb923c 0%, #ef4444 40%, transparent 70%)`,
                      filter: `blur(${18 + auraIntensity * 14}px)`,
                      opacity: 0.55 + auraIntensity * 0.3,
                    }}
                    animate={{
                      scale: [1, 1.18, 0.96, 1.12, 1],
                      rotate: isRainbow ? [0, 360] : [0, 0],
                    }}
                    transition={{
                      scale: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' },
                      rotate: { duration: isUltra ? 1.2 : 2.5, repeat: Infinity, ease: 'linear' },
                    }}
                  />
                )}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <FatManSVG
                    stage={floatStage}
                    palette={levelData.palette}
                    accessories={levelData.accessories}
                    mouthRef={mouthRef}
                    level={level}
                  />
                </div>
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
