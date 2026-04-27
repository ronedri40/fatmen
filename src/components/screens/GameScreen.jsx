import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Character from '../character/Character'
import CountryBackground from '../background/CountryBackground'
import HUD from '../hud/HUD'
import FlyingFood from '../effects/FlyingFood'
import FloatingScore from '../effects/FloatingScore'
import ParticleBurst from '../effects/ParticleBurst'
import ScreenShake from '../effects/ScreenShake'
import FingerCue from '../effects/FingerCue'
import SettingsToggles from '../hud/SettingsToggles'
import { levelFor } from '../../constants/levels'

let _id = 0
const nid = () => ++_id

function getMouthCenter(ref) {
  if (!ref.current) return { x: window.innerWidth / 2, y: window.innerHeight * 0.45 }
  const rect = ref.current.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

export default function GameScreen({ game, audio, haptic, speech }) {
  const [foods, setFoods] = useState([])
  const [scorePopups, setScorePopups] = useState([])
  const [bursts, setBursts] = useState([])
  const [levelCompleteInfo, setLevelCompleteInfo] = useState(null)
  const levelCompleteDismissRef = useRef(null)
  const mouthRef = useRef(null)
  const isBooming = game.gameState === game.GAME_STATES.BOOMING
  const boomFiredRef = useRef(false)
  const lastStageRef = useRef(0)
  const lastBoomRef = useRef(0)
  const [shakeId, setShakeId] = useState(0)

  const levelData = levelFor(game.level, game.dailyOffset)

  // Tap handler
  const handleTap = useCallback((e) => {
    if (isBooming) return
    e.preventDefault()

    const touches = e.touches || e.changedTouches
    const points = touches && touches.length > 0
      ? Array.from(touches)
      : [{ clientX: e.clientX, clientY: e.clientY }]

    const { x: mx, y: my } = getMouthCenter(mouthRef)

    // Dismiss level-complete overlay on first tap
    if (levelCompleteInfo) {
      clearTimeout(levelCompleteDismissRef.current)
      setLevelCompleteInfo(null)
    }

    points.forEach((pt) => {
      game.click()
      audio.tap(game.combo)
      haptic.tap()
      const id = nid()
      setFoods(prev => [...prev, {
        id, food: levelData.food,
        startX: pt.clientX, startY: pt.clientY,
        targetX: mx, targetY: my,
        combo: game.combo,
      }])
      setScorePopups(prev => [...prev, {
        id: nid() + 0.5,
        x: pt.clientX, y: pt.clientY - 24,
        value: game.lastTapGain || 10,
        mult: game.comboMult,
      }])
    })
  }, [game, isBooming, levelData.food, audio, haptic])

  const removeFood = useCallback((id) => setFoods(prev => prev.filter(f => f.id !== id)), [])
  const removePopup = useCallback((id) => setScorePopups(prev => prev.filter(p => p.id !== id)), [])
  const removeBurst = useCallback((id) => setBursts(prev => prev.filter(b => b.id !== id)), [])

  // Fire stage-advance effects
  useEffect(() => {
    if (game.stageEventId === lastStageRef.current) return
    lastStageRef.current = game.stageEventId
    if (game.stageEventId === 0) return
    audio.burp()
    haptic.stage()
    setShakeId(s => s + 1)
    const { x, y } = getMouthCenter(mouthRef)
    setBursts(prev => [...prev, {
      id: nid(), x, y, count: 18, color: levelData.accent, radius: 130, duration: 0.7,
    }])
  }, [game.stageEventId, audio, haptic, levelData.accent])

  // Fire boom effects
  useEffect(() => {
    if (game.boomEventId === lastBoomRef.current) return
    lastBoomRef.current = game.boomEventId
    if (game.boomEventId === 0) return
    audio.boom()
    haptic.boom()
    if (levelData.speech) {
      setTimeout(() => speech?.speak(levelData.speech), 200)
    }
    setShakeId(s => s + 1)
    const { x, y } = getMouthCenter(mouthRef)
    setBursts(prev => [...prev,
      { id: nid(), x, y, count: 30, color: '#fbbf24', radius: 220, duration: 0.7 },
      { id: nid(), x, y, count: 24, color: '#ef4444', radius: 180, duration: 0.8 },
    ])
    // Show non-blocking level-complete overlay — use a ref-based timer so
    // it isn't cancelled when levelData (a new object each render) changes.
    const info = { level: game.level, levelData }
    setLevelCompleteInfo(info)
    clearTimeout(levelCompleteDismissRef.current)
    levelCompleteDismissRef.current = setTimeout(() => setLevelCompleteInfo(null), 2000)
  }, [game.boomEventId, audio, haptic, speech, levelData, game.level])

  // Hand off after boom animation. We avoid depending on `game` (new object each
  // render) so the timeout doesn't get cancelled mid-flight.
  const boomDoneRef = useRef(game.boomDone)
  boomDoneRef.current = game.boomDone
  useEffect(() => {
    if (!isBooming) { boomFiredRef.current = false; return }
    if (boomFiredRef.current) return
    boomFiredRef.current = true
    const t = setTimeout(() => boomDoneRef.current(), 500)
    return () => clearTimeout(t)
  }, [isBooming])

  return (
    <div
      className="w-full h-full flex flex-col relative overflow-hidden bg-[#121212]"
      onTouchStart={handleTap}
      onClick={handleTap}
    >
      <ScreenShake triggerId={shakeId} intensity={isBooming ? 1 : 0.45}>
        <CountryBackground levelData={levelData} fatStage={game.fatStage} />

        <div className="absolute inset-0 flex flex-col">
          <HUD
            level={game.level}
            score={game.score}
            fatStage={game.fatStage}
            stageProgress={game.stageProgress}
            clicksNeededNow={game.clicksNeededNow}
            combo={game.combo}
            comboMult={game.comboMult}
            levelData={levelData}
            highScore={game.highScore}
            soundOn={game.soundOn}
            hapticOn={game.hapticOn}
            onHome={game.goHome}
          />

          <div className="flex-1 flex items-end justify-center pb-2 relative">
            <Character
              level={game.level}
              fatStage={game.fatStage}
              isBooming={isBooming}
              mouthRef={mouthRef}
              tapEventId={game.tapEventId}
              levelData={levelData}
              combo={game.combo}
              stageProgress={game.stageProgress}
            />
            <FingerCue visible={!isBooming && !game.tutorialSeen && game.totalClicks < 3} />
          </div>

          {!isBooming && (
            <motion.div
              className="pb-6 flex flex-col items-center gap-1 pointer-events-none"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
            >
              <p className="text-white/40 text-[10px] tracking-widest">
                {game.totalClicks.toLocaleString()} bites · peak {game.comboPeak}×
              </p>
            </motion.div>
          )}
        </div>
      </ScreenShake>

      {/* Settings (outside shake so toggles stay readable) */}
      <SettingsToggles
        soundOn={game.soundOn}
        hapticOn={game.hapticOn}
        onToggleSound={() => game.setSoundOn(!game.soundOn)}
        onToggleHaptic={() => game.setHapticOn(!game.hapticOn)}
      />

      {/* FX layers (also outside shake — they live in their own absolute coordinates) */}
      <AnimatePresence>
        {foods.map(f => (
          <FlyingFood key={f.id} {...f} onDone={() => removeFood(f.id)} />
        ))}
      </AnimatePresence>
      {scorePopups.map(s => (
        <FloatingScore key={s.id} {...s} onDone={() => removePopup(s.id)} />
      ))}
      {bursts.map(b => (
        <ParticleBurst key={b.id} {...b} onDone={() => removeBurst(b.id)} />
      ))}

      {/* Level complete flash — non-blocking, pointer-events-none */}
      <AnimatePresence>
        {levelCompleteInfo && (() => {
          const { level, levelData: ld } = levelCompleteInfo
          const nextLd = levelFor(level + 1, game.dailyOffset)
          return (
            <motion.div
              key={`lvl-done-${level}`}
              className="fixed inset-x-0 flex flex-col items-center gap-2 pointer-events-none z-40"
              style={{ top: '22%' }}
              initial={{ opacity: 0, y: -16, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div
                className="px-6 py-4 rounded-3xl flex flex-col items-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${ld.sky[0]}ee, ${ld.sky[1]}ee)`,
                  border: '2px solid rgba(255,255,255,0.35)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{ld.flag}</span>
                  <span className="text-white font-black text-lg tracking-wide drop-shadow">{ld.country} DONE!</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-xs font-bold tracking-widest">
                  <span>NEXT →</span>
                  <span className="text-lg">{nextLd.flag}</span>
                  <span className="text-white font-black">{nextLd.country}</span>
                  <span>{nextLd.food}</span>
                </div>
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
