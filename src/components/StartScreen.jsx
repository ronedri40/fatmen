import { motion } from 'framer-motion'

export default function StartScreen({ onStart }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center bg-[#121212] relative overflow-hidden"
      onClick={onStart}
    >
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6 z-10 px-8"
      >
        {/* Emoji man */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="text-8xl"
        >
          🍔
        </motion.div>

        <h1 className="text-5xl font-black text-white tracking-tight text-center">
          FAT<span className="text-orange-400"> MAN</span>
        </h1>

        <p className="text-[#888] text-base text-center max-w-xs leading-relaxed">
          Click like crazy to feed the man.<br />
          Every <span className="text-orange-400 font-semibold">10,000 clicks</span> he gains weight.<br />
          Make him <span className="text-red-400 font-semibold">EXPLODE</span> to level up!
        </p>

        {/* Glass button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-10 py-4 rounded-2xl font-bold text-lg text-white
            bg-white/10 border border-white/20 backdrop-blur-sm
            shadow-[0_0_30px_rgba(251,146,60,0.3)]
            active:shadow-[0_0_10px_rgba(251,146,60,0.1)]
            transition-all duration-150"
        >
          TAP TO START
        </motion.button>
      </motion.div>

      <p className="absolute bottom-8 text-[#444] text-xs">tap anywhere to begin</p>
    </div>
  )
}
