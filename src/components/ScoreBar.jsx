import { motion } from 'framer-motion'
import { FAT_STAGES } from '../constants/gameConfig'

export default function ScoreBar({ score, fatStage, stageProgress, level, clicksNeededNow }) {
  const stage = FAT_STAGES[fatStage] || FAT_STAGES[0]

  return (
    <div className="w-full px-4 pt-4 pb-2 flex flex-col gap-3">
      {/* Top row: level + score */}
      <div className="flex items-center justify-between">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
          <span className="text-[#888] text-xs font-semibold uppercase tracking-wider">Level</span>
          <span className="text-white font-black text-lg ml-2">{level}</span>
        </div>
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
          <span className="text-[#888] text-xs font-semibold uppercase tracking-wider">Score</span>
          <motion.span
            key={Math.floor(score / 100)}
            initial={{ scale: 1.2, color: '#fb923c' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.2 }}
            className="text-white font-black text-lg ml-2"
          >
            {score.toLocaleString()}
          </motion.span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-[#666]">
          <span>{Math.round(stageProgress * 100)}%</span>
          <span>{clicksNeededNow.toLocaleString()} clicks to gain weight</span>
        </div>
        <div className="w-full h-3 rounded-full bg-white/5 border border-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${stage.color}88, ${stage.color})` }}
            initial={false}
            animate={{ width: `${stageProgress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </div>
  )
}
