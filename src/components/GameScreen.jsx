import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FatMan from './FatMan'
import ScoreBar from './ScoreBar'
import FloatingHamburger from './FloatingHamburger'

let hamburgerCounter = 0

function getMouthCenter(ref) {
  if (!ref.current) return { x: window.innerWidth / 2, y: window.innerHeight * 0.45 }
  const rect = ref.current.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

export default function GameScreen({ game }) {
  const [hamburgers, setHamburgers] = useState([])
  const mouthRef = useRef(null)
  const isBooming = game.gameState === game.GAME_STATES.BOOMING
  const boomFiredRef = useRef(false)

  const handleTap = useCallback((e) => {
    if (isBooming) return
    e.preventDefault()

    const touches = e.touches || e.changedTouches
    const points = touches && touches.length > 0
      ? Array.from(touches)
      : [{ clientX: e.clientX, clientY: e.clientY }]

    const { x: mx, y: my } = getMouthCenter(mouthRef)

    points.forEach((pt) => {
      game.click()
      const id = hamburgerCounter++
      setHamburgers(prev => [
        ...prev,
        { id, startX: pt.clientX, startY: pt.clientY, targetX: mx, targetY: my },
      ])
    })
  }, [game, isBooming])

  const removeHamburger = useCallback((id) => {
    setHamburgers(prev => prev.filter(h => h.id !== id))
  }, [])

  useEffect(() => {
    if (isBooming && !boomFiredRef.current) {
      boomFiredRef.current = true
      const t = setTimeout(() => {
        game.boomDone()
        boomFiredRef.current = false
      }, 1200)
      return () => clearTimeout(t)
    }
  }, [isBooming, game])

  return (
    <div
      className="w-full h-full flex flex-col bg-[#121212] relative overflow-hidden"
      onTouchStart={handleTap}
      onClick={handleTap}
    >
      <ScoreBar
        score={game.score}
        fatStage={game.fatStage}
        stageProgress={game.stageProgress}
        level={game.level}
        clicksNeededNow={game.clicksNeededNow}
      />

      {/* Background glow intensifies with fat stage */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 65%, rgba(251,146,60,${game.fatStage * 0.05}) 0%, transparent 70%)`,
          transition: 'background 1s ease',
        }}
      />

      {/* Fat man */}
      <div className="flex-1 flex items-center justify-center">
        <FatMan fatStage={game.fatStage} isBooming={isBooming} mouthRef={mouthRef} />
      </div>

      {/* Tap hint */}
      {!isBooming && (
        <motion.div
          className="pb-10 flex flex-col items-center gap-1 pointer-events-none"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <p className="text-[#555] text-sm font-medium tracking-widest uppercase">Tap anywhere to feed him</p>
          <p className="text-[#333] text-xs">{game.totalClicks.toLocaleString()} bites total</p>
        </motion.div>
      )}

      {/* Flying hamburgers */}
      <AnimatePresence>
        {hamburgers.map(h => (
          <FloatingHamburger
            key={h.id}
            id={h.id}
            startX={h.startX}
            startY={h.startY}
            targetX={h.targetX}
            targetY={h.targetY}
            onDone={() => removeHamburger(h.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
