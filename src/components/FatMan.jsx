import { motion, AnimatePresence } from 'framer-motion'
import { FAT_STAGES } from '../constants/gameConfig'
import FatManSVG from './FatManSVG'

export default function FatMan({ fatStage, isBooming, mouthRef }) {
  const stageColor = FAT_STAGES[fatStage]?.color || '#4ade80'

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <AnimatePresence mode="wait">
        {isBooming ? (
          <motion.div
            key="boom"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: [1, 1.6, 0.1, 3.5], opacity: [1, 1, 1, 0] }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            style={{ fontSize: 120, lineHeight: 1 }}
          >
            💥
          </motion.div>
        ) : (
          <motion.div
            key="character"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 15 }}
            style={{ width: '100%', maxWidth: 260 }}
          >
            {/* Idle bounce */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <FatManSVG stage={fatStage} mouthRef={mouthRef} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage label */}
      {!isBooming && (
        <motion.div
          key={fatStage}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
          style={{
            color: stageColor,
            border: `1px solid ${stageColor}55`,
            background: `${stageColor}18`,
          }}
        >
          {FAT_STAGES[fatStage]?.label}
        </motion.div>
      )}
    </div>
  )
}
