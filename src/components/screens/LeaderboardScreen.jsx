import { motion } from 'framer-motion'
import { useState } from 'react'

const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardScreen({ entries, playerName, onSetPlayerName, onBack }) {
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState(playerName)

  function savePlayerName() {
    onSetPlayerName(nameInput)
    setEditing(false)
  }

  return (
    <div
      className="w-full h-full flex flex-col relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 20%, #1f1035 0%, #0a0a0a 70%)' }}
    >
      {/* Glow */}
      <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
        <motion.div
          className="w-[400px] h-[300px] rounded-full blur-3xl"
          style={{ background: 'rgba(168,85,247,0.25)', marginTop: '-60px' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white/80 text-lg"
        >
          ←
        </motion.button>
        <h1 className="text-white font-black text-2xl tracking-tight">🏆 LEADERBOARD</h1>
        <div className="w-10" />
      </div>

      {/* Player name */}
      <div className="relative z-10 px-5 pb-4">
        {editing ? (
          <div className="flex gap-2 items-center">
            <input
              autoFocus
              type="text"
              maxLength={16}
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && savePlayerName()}
              className="flex-1 py-2 px-4 rounded-xl text-white font-black text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(251,146,60,0.5)' }}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={savePlayerName}
              className="px-4 py-2 rounded-xl font-black text-sm text-white"
              style={{ background: 'linear-gradient(90deg, #f97316, #ef4444)' }}
            >
              SAVE
            </motion.button>
          </div>
        ) : (
          <button
            onClick={() => { setNameInput(playerName); setEditing(true) }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Your name</span>
            <span className="text-white font-black text-sm">{playerName}</span>
            <span className="text-white/30 text-xs">✏️</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-8 flex flex-col gap-3">
        {entries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 mt-16"
          >
            <div className="text-6xl">🍔</div>
            <p className="text-white/40 font-black text-sm tracking-widest uppercase">No scores yet</p>
            <p className="text-white/25 text-xs text-center">Play a game and go home to save your score!</p>
          </motion.div>
        )}

        {entries.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl"
            style={{
              background: i === 0
                ? 'linear-gradient(90deg, rgba(251,191,36,0.25), rgba(251,146,60,0.15))'
                : i === 1
                  ? 'linear-gradient(90deg, rgba(209,213,219,0.18), rgba(156,163,175,0.1))'
                  : i === 2
                    ? 'linear-gradient(90deg, rgba(180,83,9,0.22), rgba(146,64,14,0.12))'
                    : 'rgba(255,255,255,0.05)',
              border: `1px solid ${i < 3 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`,
            }}
          >
            <div className="w-8 text-center text-xl">
              {i < 3 ? MEDALS[i] : <span className="text-white/40 font-black text-sm">#{i + 1}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-sm truncate">{entry.name}</p>
              <p className="text-white/40 text-[10px] font-bold tracking-wider">
                LVL {entry.level} · {entry.date}
              </p>
            </div>
            <p
              className="font-black text-base"
              style={{ color: i === 0 ? '#fbbf24' : i === 1 ? '#d1d5db' : i === 2 ? '#f59e0b' : '#ffffff99' }}
            >
              {Math.floor(entry.score).toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
