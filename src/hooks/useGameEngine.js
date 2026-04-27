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
  STAGE_PACING,
  COMBO_WINDOW_MS,
  COMBO_MAX,
  COMBO_BONUS_THRESHOLD,
  COMBO_MULTIPLIER_MAX,
} from '../constants/gameConfig'
import { usePersistedState } from './usePersistedState'
import { todayKey, todayLevelIndex } from '../utils/dailyChallenge'

const SAVE_KEY = 'fatman.savedGame'

const GAME_STATES = {
  IDLE: 'IDLE',
  PLAYING: 'PLAYING',
  BOOMING: 'BOOMING',
  LEVEL_UP: 'LEVEL_UP',
}

const initialState = {
  gameState: GAME_STATES.IDLE,
  score: 0,
  levelStartScore: 0,
  totalClicks: 0,
  stageClicks: 0,
  fatStage: 0,
  level: 1,
  combo: 0,
  comboPeak: 0,
  lastClickTime: null,
  tapEventId: 0,
  stageEventId: 0,
  boomEventId: 0,
  lastTapGain: 0,
  levelStartTime: null,
  levelDurationMs: 0,
}

function loadSavedGame() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY))
    return s && s.score > 0 ? s : null
  } catch { return null }
}

function clicksNeeded(level, stage = 0) {
  const base = CLICKS_PER_STAGE * Math.pow(LEVEL_MULTIPLIER, level - 1)
  const pacing = STAGE_PACING[Math.min(stage, STAGE_PACING.length - 1)] ?? 1
  return Math.max(3, Math.floor(base * pacing))
}

function comboMultiplier(combo) {
  if (combo < COMBO_BONUS_THRESHOLD) return 1
  const t = Math.min(1, (combo - COMBO_BONUS_THRESHOLD) / (COMBO_MAX - COMBO_BONUS_THRESHOLD))
  return 1 + (COMBO_MULTIPLIER_MAX - 1) * t
}

function reducer(state, action) {
  switch (action.type) {
    case 'START': {
      const now = Date.now()
      return { ...initialState, gameState: GAME_STATES.PLAYING, lastClickTime: now, levelStartTime: now }
    }

    case 'CLICK': {
      if (state.gameState !== GAME_STATES.PLAYING) return state
      const now = action.now
      const inCombo = state.lastClickTime != null && (now - state.lastClickTime) <= COMBO_WINDOW_MS
      const newCombo = Math.min(COMBO_MAX, inCombo ? state.combo + 1 : 1)
      const mult = comboMultiplier(newCombo)
      const tapGain = Math.round(POINTS_PER_TAP * mult)

      const needed = clicksNeeded(state.level, state.fatStage)
      const newStageClicks = state.stageClicks + 1
      const newTotalClicks = state.totalClicks + 1
      let newScore = state.score + tapGain

      let fatStage = state.fatStage
      let stageClicks = newStageClicks
      let stageEventId = state.stageEventId
      let gameState = state.gameState
      let boomEventId = state.boomEventId
      let levelDurationMs = state.levelDurationMs

      if (newStageClicks >= needed) {
        const nextStage = state.fatStage + 1
        if (nextStage >= TOTAL_STAGES) {
          newScore += LEVEL_BONUS
          gameState = GAME_STATES.BOOMING
          fatStage = TOTAL_STAGES - 1
          stageClicks = needed
          boomEventId = state.boomEventId + 1
          levelDurationMs = state.levelStartTime ? now - state.levelStartTime : 0
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
        levelDurationMs,
      }
    }

    case 'DECAY': {
      if (state.gameState !== GAME_STATES.PLAYING) return state
      // Score cannot drop below the score earned from completing previous levels
      const newScore = Math.max(state.levelStartScore, state.score - action.amount)
      return { ...state, score: newScore }
    }

    case 'COMBO_DECAY':
      if (state.gameState !== GAME_STATES.PLAYING) return state
      if (state.combo === 0) return state
      return { ...state, combo: 0 }

    case 'BOOM_DONE': {
      const now = Date.now()
      const newScore = state.score
      return {
        ...state,
        gameState: GAME_STATES.PLAYING,
        fatStage: 0,
        stageClicks: 0,
        level: state.level + 1,
        levelStartScore: newScore,
        combo: 0,
        lastClickTime: now,
        levelStartTime: now,
        levelDurationMs: 0,
      }
    }

    case 'CONTINUE': {
      const now = Date.now()
      return {
        ...initialState,
        ...action.saved,
        gameState: GAME_STATES.PLAYING,
        lastClickTime: now,
        levelStartTime: now,
      }
    }

    case 'RESTART': {
      const now = Date.now()
      return { ...initialState, gameState: GAME_STATES.PLAYING, lastClickTime: now, levelStartTime: now }
    }

    case 'GO_HOME':
      return { ...initialState }

    default:
      return state
  }
}

export function useGameEngine() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const lastTickRef = useRef(Date.now())
  const saveTimerRef = useRef(null)

  const [highScore, setHighScore] = usePersistedState('fatman.highScore', 0)
  const [bestLevel, setBestLevel] = usePersistedState('fatman.bestLevel', 1)
  const [soundOn, setSoundOn] = usePersistedState('fatman.sound', true)
  const [hapticOn, setHapticOn] = usePersistedState('fatman.haptic', true)
  const [tutorialSeen, setTutorialSeen] = usePersistedState('fatman.tutorialSeen', false)
  const [dailyBest, setDailyBest] = usePersistedState('fatman.dailyBest', null)

  // Persist game state — debounced so rapid taps don't thrash localStorage
  useEffect(() => {
    if (state.gameState === GAME_STATES.PLAYING) {
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        localStorage.setItem(SAVE_KEY, JSON.stringify({
          level: state.level,
          score: state.score,
          levelStartScore: state.levelStartScore,
          fatStage: state.fatStage,
          stageClicks: state.stageClicks,
          totalClicks: state.totalClicks,
          comboPeak: state.comboPeak,
        }))
      }, 800)
    } else if (state.gameState === GAME_STATES.IDLE) {
      localStorage.removeItem(SAVE_KEY)
    }
    return () => clearTimeout(saveTimerRef.current)
  }, [state.gameState, state.level, state.fatStage, state.stageClicks, state.score])

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

  useEffect(() => {
    if (state.gameState !== GAME_STATES.BOOMING) return
    if (state.levelDurationMs <= 0) return
    if (state.level !== 1) return
    const today = todayKey()
    const isNewDay = !dailyBest || dailyBest.date !== today
    const beats = !isNewDay && (
      state.score > dailyBest.score ||
      (state.score === dailyBest.score && state.levelDurationMs < dailyBest.durationMs)
    )
    if (isNewDay || beats) {
      setDailyBest({ date: today, score: state.score, durationMs: state.levelDurationMs })
    }
  }, [state.gameState, state.levelDurationMs, state.level, state.score, dailyBest, setDailyBest])

  const dailyBestToday = dailyBest && dailyBest.date === todayKey() ? dailyBest : null

  useEffect(() => {
    if (!tutorialSeen && state.totalClicks >= 5) setTutorialSeen(true)
  }, [state.totalClicks, tutorialSeen, setTutorialSeen])

  const click = useCallback(() => dispatch({ type: 'CLICK', now: Date.now() }), [])
  const start = useCallback(() => { localStorage.removeItem(SAVE_KEY); dispatch({ type: 'START' }) }, [])
  const continueSaved = useCallback(() => {
    const saved = loadSavedGame()
    if (saved) dispatch({ type: 'CONTINUE', saved })
    else dispatch({ type: 'START' })
  }, [])
  const boomDone = useCallback(() => dispatch({ type: 'BOOM_DONE' }), [])
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), [])
  const goHome = useCallback(() => dispatch({ type: 'GO_HOME' }), [])

  const clicksNeededNow = clicksNeeded(state.level, state.fatStage)
  const stageProgress = Math.min(state.stageClicks / clicksNeededNow, 1)
  const comboMult = comboMultiplier(state.combo)

  const hasSavedGame = state.gameState === GAME_STATES.IDLE && !!loadSavedGame()

  return {
    ...state,
    GAME_STATES,
    click, start, continueSaved, boomDone, restart, goHome,
    stageProgress,
    clicksNeededNow,
    comboMult,
    highScore,
    bestLevel,
    dailyBest: dailyBestToday,
    dailyOffset: todayLevelIndex(),
    tutorialSeen,
    soundOn, setSoundOn,
    hapticOn, setHapticOn,
    hasSavedGame,
  }
}
