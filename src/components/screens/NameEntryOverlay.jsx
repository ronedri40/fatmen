import { motion } from 'framer-motion'
import { useState } from 'react'

export default function NameEntryOverlay({ score, level, onSave, onSkip }) {
  const [name, setName] = useState('')

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-end"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-full max-w-md px-6 pb-10 pt-8 flex flex-col items-center gap-5"
        style={{
          background: 'linear-gradient(180deg, #1f1f2e, #0f0f1a)',
          borderTop: '2px solid rgba(251,146,60,0.4)',
          borderRadius: '28px 28px 0 0',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      >
        <div className="text-5xl">🏆</div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-white font-black text-xl tracking-tight">YOU MADE THE BOARD!</p>
          <p className="text-white/50 text-sm font-bold">
            Score <span className="text-orange-400">{Math.floor(score).toLocaleString()}</span>
            {' · '}Level <span className="text-orange-400">{level}</span>
          </p>
        </div>

        <input
          autoFocus
          type="text"
          maxLength={16}
          placeholder="Enter your name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSave(name)}
          className="w-full py-4 px-5 rounded-2xl text-white font-black text-lg text-center tracking-wide outline-none"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '2px solid rgba(251,146,60,0.5)',
          }}
        />

        <div className="flex flex-col gap-2 w-full">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onSave(name)}
            className="w-full py-4 rounded-2xl font-black text-base text-white tracking-wider"
            style={{
              background: 'linear-gradient(90deg, #f97316, #ef4444)',
              boxShadow: '0 0 24px rgba(249,115,22,0.4)',
            }}
          >
            SAVE 🏆
          </motion.button>
          <button
            onClick={onSkip}
            className="text-white/35 text-xs font-bold tracking-widest py-1"
          >
            SKIP
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
