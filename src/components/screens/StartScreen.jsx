import { motion } from 'framer-motion'
import { LEVELS } from '../../constants/levels'
import { useEffect, useState } from 'react'
import { todayLevel } from '../../utils/dailyChallenge'
import FatManSVG from '../character/FatManSVG'

function fmtTime(ms) {
  if (!ms) return '—'
  const s = Math.round(ms / 1000)
  return `${Math.floor(s/60)}:${String(s%60).padStart(2, '0')}`
}

export default function StartScreen({ onStart, onContinue, onLeaderboard, hasSavedGame, highScore, bestLevel, dailyBest, challenge }) {
  // Cycle the showcased flag/food
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % LEVELS.length), 1400)
    return () => clearInterval(t)
  }, [])
  const showcase = LEVELS[idx]
  const today = todayLevel()

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden cursor-pointer"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1f2937 0%, #0a0a0a 70%)',
      }}
      onClick={hasSavedGame ? onContinue : onStart}
    >
      {/* Animated background blobs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.35), transparent 60%)' }}
        animate={{ x: [-80, 80, -80], y: [-40, 40, -40] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.25), transparent 60%)' }}
        animate={{ x: [60, -60, 60], y: [40, -40, 40] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}/>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex flex-col items-center gap-5 z-10 px-8"
      >
        {/* Hero: a chewing fat-man cycling through countries, with a flying food bite */}
        <div className="relative w-56 h-52 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.55), transparent 70%)' }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
          <motion.div
            key={showcase.id}
            initial={{ scale: 0.5, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 18 }}
            className="relative w-full"
            style={{ transformOrigin: '50% 80%' }}
          >
            {/* Idle bob + occasional chew squash */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                animate={{
                  scaleX: [1, 1.06, 0.97, 1.02, 1, 1, 1, 1],
                  scaleY: [1, 0.92, 1.04, 0.99, 1, 1, 1, 1],
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', times: [0, 0.06, 0.12, 0.18, 0.24, 0.5, 0.7, 1] }}
                style={{ transformOrigin: '50% 80%' }}
              >
                <FatManSVG
                  stage={1}
                  palette={showcase.palette}
                  accessories={showcase.accessories}
                  level={showcase.id}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Flying food bite that loops into his mouth */}
          <motion.div
            key={`food-${showcase.id}`}
            className="absolute"
            style={{ fontSize: 32, top: '8%', right: '6%', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.45))' }}
            initial={{ x: 30, y: -10, opacity: 0, rotate: -30, scale: 1 }}
            animate={{ x: [-15, -55, -90], y: [-10, 20, 75], opacity: [0, 1, 0], rotate: [-30, 30, 90], scale: [1, 1.1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          >
            {showcase.food}
          </motion.div>

          {/* Country flag corner badge */}
          <motion.div
            key={`flag-${showcase.id}`}
            className="absolute bottom-1 right-2 text-3xl drop-shadow-lg"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.18, type: 'spring' }}
          >
            {showcase.flag}
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <h1 className="text-6xl font-black text-white tracking-tighter text-center drop-shadow-2xl">
            FAT<span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"> MAN</span>
          </h1>
          <p className="text-white/60 text-xs font-black uppercase tracking-[0.4em]">Around the World</p>
        </div>

        <p className="text-white/85 text-base text-center max-w-xs leading-snug font-bold">
          He's hungry.<br/>
          Make him <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">EXPLODE</span>.
        </p>

        {/* Today's challenge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 py-2 rounded-2xl border backdrop-blur-md flex items-center gap-3"
          style={{
            background: 'rgba(251,146,60,0.15)',
            borderColor: 'rgba(251,146,60,0.45)',
          }}
        >
          <div className="text-3xl">{today.flag}</div>
          <div className="flex flex-col leading-tight">
            <span className="text-[9px] font-black tracking-[0.25em] text-orange-300 uppercase">Today's challenge</span>
            <span className="text-white text-sm font-black">Beat {today.country}</span>
            {dailyBest && (
              <span className="text-orange-200 text-[10px] font-bold tracking-wider">
                YOUR BEST · {Math.floor(dailyBest.score).toLocaleString()} · {fmtTime(dailyBest.durationMs)}
              </span>
            )}
          </div>
        </motion.div>

        {/* Friend's challenge */}
        {challenge && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 220 }}
            className="px-4 py-2.5 rounded-2xl border backdrop-blur-md flex items-center gap-3 max-w-xs"
            style={{
              background: 'rgba(168,85,247,0.18)',
              borderColor: 'rgba(168,85,247,0.55)',
            }}
          >
            <div className="text-3xl">👑</div>
            <div className="flex flex-col leading-tight">
              <span className="text-[9px] font-black tracking-[0.25em] text-purple-200 uppercase">Friend's challenge</span>
              <span className="text-white text-sm font-black">
                Beat {Math.floor(challenge.score).toLocaleString()}
              </span>
              <span className="text-purple-200 text-[10px] font-bold tracking-wider">
                {challenge.country ? `cleared ${challenge.country}` : 'on Fat Man'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Records */}
        {(highScore > 0 || bestLevel > 1) && (
          <div className="flex gap-2">
            {highScore > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-[9px] font-black tracking-widest text-white/45 uppercase">Best</div>
                <div className="text-white font-black">{Math.floor(highScore).toLocaleString()}</div>
              </div>
            )}
            {bestLevel > 1 && (
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-[9px] font-black tracking-widest text-white/45 uppercase">Lvl</div>
                <div className="text-white font-black">{bestLevel}</div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 mt-2 w-full max-w-xs">
          {hasSavedGame ? (
            <>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={e => { e.stopPropagation(); onContinue() }}
                animate={{ boxShadow: ['0 0 20px rgba(251,146,60,0.4)', '0 0 40px rgba(251,146,60,0.8)', '0 0 20px rgba(251,146,60,0.4)'] }}
                transition={{ boxShadow: { duration: 1.6, repeat: Infinity } }}
                className="w-full py-4 rounded-2xl font-black text-lg text-white tracking-wider
                  bg-gradient-to-r from-orange-500 to-red-500 border border-white/30 shadow-2xl"
              >
                ▶ CONTINUE
              </motion.button>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={e => { e.stopPropagation(); onStart() }}
                  className="flex-1 py-3 rounded-2xl font-black text-sm text-white/70 tracking-wider
                    bg-white/8 border border-white/15 backdrop-blur-md"
                >
                  ↺ NEW GAME
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={e => { e.stopPropagation(); onLeaderboard() }}
                  className="w-14 py-3 rounded-2xl font-black text-2xl bg-white/8 border border-white/15 backdrop-blur-md"
                >
                  🏆
                </motion.button>
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                animate={{ boxShadow: ['0 0 20px rgba(251,146,60,0.4)', '0 0 40px rgba(251,146,60,0.7)', '0 0 20px rgba(251,146,60,0.4)'] }}
                transition={{ boxShadow: { duration: 1.6, repeat: Infinity } }}
                className="flex-1 py-4 rounded-2xl font-black text-lg text-white tracking-wider
                  bg-gradient-to-r from-orange-500 to-red-500 border border-white/30 shadow-2xl"
              >
                ▶ FEED HIM
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={e => { e.stopPropagation(); onLeaderboard() }}
                className="w-16 py-4 rounded-2xl font-black text-2xl bg-white/8 border border-white/15 backdrop-blur-md"
              >
                🏆
              </motion.button>
            </div>
          )}
        </div>

        {/* Country preview reel */}
        <div className="flex gap-1 mt-2">
          {LEVELS.map((lv, i) => (
            <motion.div
              key={lv.id}
              animate={{ opacity: i === idx ? 1 : 0.3, scale: i === idx ? 1.2 : 1 }}
              className="text-base"
            >
              {lv.flag}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <p className="absolute bottom-6 text-white/30 text-[10px] tracking-[0.3em] uppercase">
        Tap anywhere to begin
      </p>
    </div>
  )
}
