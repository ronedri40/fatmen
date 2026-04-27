import { motion } from 'framer-motion'

export default function LevelUpScreen({ level, score, onNext, onRestart }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#121212] relative overflow-hidden px-8">
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 rounded-full bg-red-500/20 blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="flex flex-col items-center gap-5 z-10"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-8xl"
        >
          💥
        </motion.div>

        <h2 className="text-4xl font-black text-white tracking-tight text-center">
          HE EXPLODED!
        </h2>

        <p className="text-[#888] text-sm text-center">
          Score: <span className="text-white font-bold">{score.toLocaleString()}</span>
        </p>

        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-center">
          <p className="text-[#888] text-xs uppercase tracking-widest mb-1">Next challenge</p>
          <p className="text-orange-400 font-black text-2xl">LEVEL {level + 1}</p>
          <p className="text-[#666] text-xs mt-1">Needs more clicks to gain weight!</p>
        </div>

        <div className="flex flex-col gap-3 w-full mt-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="w-full py-4 rounded-2xl font-bold text-lg text-white
              bg-orange-500/20 border border-orange-500/40 backdrop-blur-sm
              shadow-[0_0_20px_rgba(251,146,60,0.2)]
              active:shadow-none transition-all"
          >
            NEXT LEVEL →
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="w-full py-3 rounded-2xl font-semibold text-sm text-[#666]
              bg-white/5 border border-white/10
              transition-all"
          >
            Start Over
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
