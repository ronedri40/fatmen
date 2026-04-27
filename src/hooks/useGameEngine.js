import { useReducer, useEffect, useRef, useCallback } from 'react'
import {
  CLICKS_PER_STAGE,
  TOTAL_STAGES,
  POINTS_PER_TAP,
  STAGE_BONUS,
  LEVEL_BONUS,
  DECAY_PER_SECOND,
  DECAY_GRACE_MS,
  LEVEL_MULTIPLIER,
  COMBO_WINDOW_MS,
  COMBO_MAX,
  COMBO_BONUS_THRESHOLD,
  COMBO_MULTIPLIER_MAX,
} from '../constants/gameConfig'
import { usePersistedState } from './usePersistedState'

const GAME_STATES = {
  IDLE: 'IDLE',
  PLAYING: 'PLAYING',
  BOOMING: 'BOOMING',
  LEVEL_UP: 'LEVEL_UP',
}

const initialState = {
  gameState: GAME_STATES.IDLE,
  score: 0,
  totalClicks: 0,
  stageClicks: 0,
  fatStage: 0,
  level: 1,
  combo: 0,
  comboPeak: 0,
  lastClickTime: null,
  // event flags consumed by UI; bumped each time something happens so effects fire
  tapEventId: 0,
  stageEventId: 0,
  boomEventId: 0,
  // pop-ups: last gained score (for floating "+10" rendering)
  lastTapGain: 0,
}

function clicksNeeded(level) {
  return Math.max(8, Math.floor(CLICKS_PER_STAGE * Math.pow(LEVEL_MULTIPLIER, level - 1)))
}

function comboMultiplier(combo) {
  if (combo < COMBO_BONUS_THRESHOLD) return 1
  // Linear ramp from 1 → COMBO_MULTIPLIER_MAX between threshold and COMBO_MAX
  const t = Math.min(1, (combo - COMBO_BONUS_THRESHOLD) / (COMBO_MAX - COMBO_BONUS_THRESHOLD))
  return 1 + (COMBO_MULTIPLIER_MAX - 1) * t
}

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...initialState, gameState: GAME_STATES.PLAYING, lastClickTime: Date.now() }

    case 'CLICK': {
      if (state.gameState !== GAME_STATES.PLAYING) return state
      const now = action.now
      const inCombo = state.lastClickTime != null && (now - state.lastClickTime) <= COMBO_WINDOW_MS
      const newCombo = Math.min(COMBO_MAX, inCombo ? state.combo + 1 : 1)
      const mult = comboMultiplier(newCombo)
      const tapGain = Math.round(POINTS_PER_TAP * mult)

      const needed = clicksNeeded(state.level)
      const newStageClicks = state.stageClicks + 1
      const newTotalClicks = state.totalClicks + 1
      let newScore = state.score + tapGain

      let fatStage = state.fatStage
      let stageClicks = newStageClicks
      let stageEventId = state.stageEventId
      let gameState = state.gameState
      let boomEventId = state.boomEventId

      if (newStageClicks >= needed) {
        const nextStage = state.fatStage + 1
        if (nextStage >= TOTAL_STAGES) {
          // BOOM — final stage reached
          newScore += LEVEL_BONUS
          gameState = GAME_STATES.BOOMING
          fatStage = TOTAL_STAGES - 1
          stageClicks = needed
          boomEventId = state.boomEventId + 1
        } else {
          newScore += STAGE_BONUS
          fatStage = nextStage
          stageClicks = 0
          stageEventId = state.stageEventId + 1
        }
      }

      return {
        ...state,
        gameState,
        stageClicks,
        totalClicks: newTotalClicks,
        score: newScore,
        fatStage,
        combo: newCombo,
        comboPeak: Math.max(state.comboPeak, newCombo),
        lastClickTime: now,
        tapEventId: state.tapEventId + 1,
        stageEventId,
        boomEventId,
        lastTapGain: tapGain,
      }
    }

    case 'DECAY': {
      if (state.gameState !== GAME_STATES.PLAYING) return state
      const newScore = Math.max(0, state.score - action.amount)
      return { ...state, score: newScore }
    }

    case 'COMBO_DECAY':
      if (state.gameState !== GAME_STATES.PLAYING) return state
      if (state.combo === 0) return state
      return { ...state, combo: 0 }

    case 'BOOM_DONE':
      return { ...state, gameState: GAME_STATES.LEVEL_UP }

    case 'NEXT_LEVEL':
      return {
        ...state,
        gameState: GAME_STATES.PLAYING,
        fatStage: 0,
        stageClicks: 0,
        level: state.level + 1,
        combo: 0,
        lastClickTime: Date.now(),
      }

    case 'RESTART':
      return { ...initialState, gameState: GAME_STATES.PLAYING, lastClickTime: Date.now() }

    case 'GO_HOME':
      return { ...initialState }

    default:
      return state
  }
}

export function useGameEngine() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const lastTickRef = useRef(Date.now())

  const [highScore, setHighScore] = usePersistedState('fatman.highScore', 0)
  const [bestLevel, setBestLevel] = usePersistedState('fatman.bestLevel', 1)
  const [soundOn, setSoundOn] = usePersistedState('fatman.sound', true)
  const [hapticOn, setHapticOn] = usePersistedState('fatman.haptic', true)

  // Score decay + combo timeout
  useEffect(() => {
    if (state.gameState !== GAME_STATES.PLAYING) return
    lastTickRef.current = Date.now()

    const interval = setInterval(() => {
      const now = Date.now()
      const dt = (now - lastTickRef.current) / 1000
      lastTickRef.current = now

      const idleSec = state.lastClickTime ? (now - state.lastClickTime) : 0
      if (idleSec > DECAY_GRACE_MS) {
        dispatch({ type: 'DECAY', amount: DECAY_PER_SECOND * dt })
      }
      if (state.lastClickTime && now - state.lastClickTime > COMBO_WINDOW_MS) {
        dispatch({ type: 'COMBO_DECAY' })
      }
    }, 100)

    return () => clearInterval(interval)
  }, [state.gameState, state.lastClickTime])

  // Persist records
  useEffect(() => {
    if (state.score > highScore) setHighScore(state.score)
  }, [state.score, highScore, setHighScore])

  useEffect(() => {
    if (state.level > bestLevel) setBestLevel(state.level)
  }, [state.level, bestLevel, setBestLevel])

  const click = useCallback(() => dispatch({ type: 'CLICK', now: Date.now() }), [])
  const start = useCallback(() => dispatch({ type: 'START' }), [])
  const boomDone = useCallback(() => dispatch({ type: 'BOOM_DONE' }), [])
  const nextLevel = useCallback(() => dispatch({ type: 'NEXT_LEVEL' }), [])
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), [])
  const goHome = useCallback(() => dispatch({ type: 'GO_HOME' }), [])

  const clicksNeededNow = clicksNeeded(state.level)
  const stageProgress = Math.min(state.stageClicks / clicksNeededNow, 1)
  const comboMult = comboMultiplier(state.combo)

  return {
    ...state,
    GAME_STATES,
    click, start, boomDone, nextLevel, restart, goHome,
    stageProgress,
    clicksNeededNow,
    comboMult,
    highScore,
    bestLevel,
    soundOn, setSoundOn,
    hapticOn, setHapticOn,
  }
}
