import { motion, AnimatePresence } from 'framer-motion'
import { FAT_STAGES, COMBO_BONUS_THRESHOLD, COMBO_MAX } from '../../constants/gameConfig'

export default function HUD({
  level, score, fatStage, stageProgress, clicksNeededNow,
  combo, comboMult, levelData, highScore,
  soundOn, hapticOn, onToggleSound, onToggleHaptic, onHome,
}) {
  const stage = FAT_STAGES[fatStage] || FAT_STAGES[0]
  const comboPct = Math.min(combo / COMBO_MAX, 1)
  const showCombo = combo >= COMBO_BONUS_THRESHOLD

  return (
    <div className="w-full px-4 pt-4 pb-2 flex flex-col gap-3 z-20 pointer-events-none">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        {/* Level + country */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onHome}
            aria-label="Home"
            className="w-9 h-9 rounded-xl bg-black/35 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/85 active:scale-95 transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7H10v7H6a2 2 0 0 1-2-2z"/></svg>
          </button>
          <div className="rounded-xl px-3 py-1.5 bg-black/35 border border-white/15 backdrop-blur-md flex items-center gap-2">
            <span className="text-2xl leading-none">{levelData.flag}</span>
            <div className="flex flex-col leading-tight">
              <span className="text-white/55 text-[10px] font-bold uppercase tracking-wider">Lvl {level}</span>
              <span className="text-white text-xs font-black truncate max-w-[110px]">{levelData.name}</span>
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col items-end gap-1 pointer-events-auto">
          <div className="rounded-xl px-3 py-1.5 bg-black/35 border border-white/15 backdrop-blur-md flex flex-col items-end leading-tight">
            <span className="text-white/55 text-[10px] font-bold uppercase tracking-wider">Score</span>
            <motion.span
              key={Math.floor(score / 50)}
              initial={{ scale: 1.18, color: '#fbbf24' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.18 }}
              className="text-white font-black text-base"
            >
              {Math.floor(score).toLocaleString()}
            </motion.span>
          </div>
          {highScore > 0 && (
            <div className="text-[10px] text-white/55 font-bold tracking-wider">
              BEST {Math.floor(highScore).toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Stage progress bar */}
      <div className="flex flex-col gap-1.5 pointer-events-auto">
        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
          <span className="text-white/70">{stage.label}</span>
          <span className="text-white/50">{Math.round(stageProgress * 100)}% · {clicksNeededNow} taps</span>
        </div>
        <div className="relative w-full h-2.5 rounded-full bg-black/40 border border-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${stage.color}, ${stage.accent})`,
              boxShadow: `0 0 10px ${stage.color}88`,
            }}
            initial={false}
            animate={{ width: `${stageProgress * 100}%` }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
          />
          {/* stage tick marks */}
          {[0.2, 0.4, 0.6, 0.8].map(t => (
            <div key={t} className="absolute top-0 bottom-0 w-px bg-white/15" style={{ left: `${t * 100}%` }} />
          ))}
        </div>
      </div>

      {/* Combo meter — appears once active */}
      <AnimatePresence>
        {showCombo && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 pointer-events-auto"
          >
            <motion.div
              key={Math.floor(combo / 5)}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="px-2.5 py-1 rounded-lg font-black text-sm"
              style={{
                background: `linear-gradient(90deg, #fb923c, #f97316)`,
                color: '#fff',
                boxShadow: `0 0 16px #fb923c88`,
              }}
            >
              {combo}× COMBO
            </motion.div>
            <div className="flex-1 h-1.5 rounded-full bg-black/40 overflow-hidden border border-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #facc15, #fb923c, #ef4444)' }}
                animate={{ width: `${comboPct * 100}%` }}
                transition={{ duration: 0.12 }}
              />
            </div>
            <div className="text-xs font-black text-orange-300">×{comboMult.toFixed(1)}</div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
