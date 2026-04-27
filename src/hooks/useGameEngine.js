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
  // per-level session timing for the shareable result card
  levelStartTime: null,
  levelDurationMs: 0,
}

// Per-stage clicks: base × level-scaling × stage-pacing curve.
// The HUD progress bar uses the *current* stage's threshold.
function clicksNeeded(level, stage = 0) {
  const base = CLICKS_PER_STAGE * Math.pow(LEVEL_MULTIPLIER, level - 1)
  const pacing = STAGE_PACING[Math.min(stage, STAGE_PACING.length - 1)] ?? 1
  return Math.max(5, Math.floor(base * pacing))
}

function comboMultiplier(combo) {
  if (combo < COMBO_BONUS_THRESHOLD) return 1
  // Linear ramp from 1 → COMBO_MULTIPLIER_MAX between threshold and COMBO_MAX
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
          // BOOM — final stage reached
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
      const newScore = Math.max(0, state.score - action.amount)
      return { ...state, score: newScore }
    }

    case 'COMBO_DECAY':
      if (state.gameState !== GAME_STATES.PLAYING) return state
      if (state.combo === 0) return state
      return { ...state, combo: 0 }

    case 'BOOM_DONE':
      return { ...state, gameState: GAME_STATES.LEVEL_UP }

    case 'NEXT_LEVEL': {
      const now = Date.now()
      return {
        ...state,
        gameState: GAME_STATES.PLAYING,
        fatStage: 0,
        stageClicks: 0,
        level: state.level + 1,
        combo: 0,
        lastClickTime: now,
        levelStartTime: now,
        levelDurationMs: 0,
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

  const [highScore, setHighScore] = usePersistedState('fatman.highScore', 0)
  const [bestLevel, setBestLevel] = usePersistedState('fatman.bestLevel', 1)
  const [soundOn, setSoundOn] = usePersistedState('fatman.sound', true)
  const [hapticOn, setHapticOn] = usePersistedState('fatman.haptic', true)
  // Tutorial finger-cue: latches true once the player has tapped 5 times in
  // their first session. Stays false forever after, so returning players don't
  // get the cue again.
  const [tutorialSeen, setTutorialSeen] = usePersistedState('fatman.tutorialSeen', false)
  // dailyBest: { date: 'YYYY-MM-DD', score, durationMs } — only the personal
  // best for *today's* country counts; resets next day.
  const [dailyBest, setDailyBest] = usePersistedState('fatman.dailyBest', null)

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

  // Record daily-best when the player clears the FIRST country of the run
  // (which, with the daily offset, is today's challenge country).
  useEffect(() => {
    if (state.gameState !== GAME_STATES.BOOMING && state.gameState !== GAME_STATES.LEVEL_UP) return
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

  // dailyBest, but only if it's actually for today (yesterday's value is treated as missing)
  const dailyBestToday = dailyBest && dailyBest.date === todayKey() ? dailyBest : null

  // Latch tutorial-seen the first time the player taps enough to "get it".
  useEffect(() => {
    if (!tutorialSeen && state.totalClicks >= 5) setTutorialSeen(true)
  }, [state.totalClicks, tutorialSeen, setTutorialSeen])

  const click = useCallback(() => dispatch({ type: 'CLICK', now: Date.now() }), [])
  const start = useCallback(() => dispatch({ type: 'START' }), [])
  const boomDone = useCallback(() => dispatch({ type: 'BOOM_DONE' }), [])
  const nextLevel = useCallback(() => dispatch({ type: 'NEXT_LEVEL' }), [])
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), [])
  const goHome = useCallback(() => dispatch({ type: 'GO_HOME' }), [])

  const clicksNeededNow = clicksNeeded(state.level, state.fatStage)
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
    dailyBest: dailyBestToday,
    dailyOffset: todayLevelIndex(),
    tutorialSeen,
    soundOn, setSoundOn,
    hapticOn, setHapticOn,
  }
}
