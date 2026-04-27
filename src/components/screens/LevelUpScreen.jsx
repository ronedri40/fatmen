import { motion } from 'framer-motion'
import { levelFor } from '../../constants/levels'
import Confetti from '../effects/Confetti'

export default function LevelUpScreen({ level, score, highScore, onNext, onRestart }) {
  const cleared = levelFor(level)
  const next = levelFor(level + 1)
  const isRecord = score >= highScore

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden px-6"
      style={{
        background: `linear-gradient(180deg, ${cleared.sky[0]} 0%, ${cleared.sky[1]} 50%, ${cleared.sky[2]} 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-black/30" />

      <Confetti count={70} />

      {/* Pulsing glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[420px] h-[420px] rounded-full blur-3xl"
          style={{ background: `${cleared.accent}66` }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        className="flex flex-col items-center gap-4 z-10 max-w-sm w-full"
      >
        <motion.div
          animate={{ rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.25, 1] }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-7xl drop-shadow-2xl"
        >
          💥
        </motion.div>

        {/* Cry */}
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="px-4 py-1.5 rounded-full bg-white/15 border border-white/30 backdrop-blur-md"
        >
          <p className="text-white font-black text-sm tracking-widest">"{cleared.cry}"</p>
        </motion.div>

        <h2 className="text-4xl font-black text-white tracking-tight text-center drop-shadow-lg">
          HE EXPLODED!
        </h2>

        {/* Score card */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md px-5 py-4 flex items-center justify-between"
        >
          <div>
            <div className="text-[10px] font-black tracking-widest text-white/60 uppercase">Score</div>
            <div className="text-white font-black text-2xl">{Math.floor(score).toLocaleString()}</div>
            {isRecord && score > 0 && (
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="text-[10px] font-black tracking-widest text-yellow-300 uppercase"
              >
                ★ NEW RECORD
              </motion.div>
            )}
          </div>
          <div className="text-5xl">{cleared.flag}</div>
        </motion.div>

        {/* Next destination */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="w-full rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md px-5 py-4 flex items-center justify-between"
        >
          <div>
            <div className="text-[10px] font-black tracking-widest text-white/60 uppercase">Next destination</div>
            <div className="text-white font-black text-lg">{next.country}</div>
            <div className="text-white/70 text-xs">{next.name}</div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-4xl">{next.flag}</span>
            <span className="text-3xl">{next.food}</span>
          </div>
        </motion.div>

        <div className="flex flex-col gap-2 w-full mt-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="w-full py-4 rounded-2xl font-black text-base text-white tracking-wider
              bg-gradient-to-r from-orange-500 to-red-500 border border-white/30
              shadow-[0_0_30px_rgba(251,146,60,0.5)]"
          >
            FLY TO {next.country.toUpperCase()} →
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl font-bold text-xs text-white/70 tracking-wider
              bg-black/30 border border-white/15 backdrop-blur-sm"
          >
            START OVER
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
