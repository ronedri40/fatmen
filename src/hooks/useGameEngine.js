import { useReducer, useEffect, useRef, useCallback } from 'react'
import { CLICKS_PER_STAGE, TOTAL_STAGES, DECAY_PER_SECOND, LEVEL_MULTIPLIER } from '../constants/gameConfig'

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
  lastClickTime: null,
}

function clicksNeeded(level) {
  return Math.floor(CLICKS_PER_STAGE * Math.pow(LEVEL_MULTIPLIER, level - 1))
}

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...initialState, gameState: GAME_STATES.PLAYING, lastClickTime: Date.now() }

    case 'CLICK': {
      if (state.gameState !== GAME_STATES.PLAYING) return state
      const needed = clicksNeeded(state.level)
      const newStageClicks = state.stageClicks + 1
      const newTotalClicks = state.totalClicks + 1
      const newScore = state.score + 10

      if (newStageClicks >= needed) {
        const nextStage = state.fatStage + 1
        if (nextStage >= TOTAL_STAGES) {
          return {
            ...state,
            gameState: GAME_STATES.BOOMING,
            stageClicks: newStageClicks,
            totalClicks: newTotalClicks,
            score: newScore,
            fatStage: TOTAL_STAGES - 1,
            lastClickTime: Date.now(),
          }
        }
        return {
          ...state,
          stageClicks: 0,
          fatStage: nextStage,
          totalClicks: newTotalClicks,
          score: newScore,
          lastClickTime: Date.now(),
        }
      }

      return {
        ...state,
        stageClicks: newStageClicks,
        totalClicks: newTotalClicks,
        score: newScore,
        lastClickTime: Date.now(),
      }
    }

    case 'DECAY': {
      if (state.gameState !== GAME_STATES.PLAYING) return state
      const newScore = Math.max(0, state.score - action.amount)
      return { ...state, score: newScore }
    }

    case 'BOOM_DONE':
      return { ...state, gameState: GAME_STATES.LEVEL_UP }

    case 'NEXT_LEVEL':
      return {
        ...state,
        gameState: GAME_STATES.PLAYING,
        fatStage: 0,
        stageClicks: 0,
        level: state.level + 1,
        lastClickTime: Date.now(),
      }

    case 'RESTART':
      return { ...initialState, gameState: GAME_STATES.PLAYING, lastClickTime: Date.now() }

    default:
      return state
  }
}

export function useGameEngine() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const lastTickRef = useRef(Date.now())

  // Score decay when idle
  useEffect(() => {
    if (state.gameState !== GAME_STATES.PLAYING) return

    const interval = setInterval(() => {
      const now = Date.now()
      const dt = (now - lastTickRef.current) / 1000
      lastTickRef.current = now

      const idleSec = state.lastClickTime ? (now - state.lastClickTime) / 1000 : 0
      if (idleSec > 3) {
        dispatch({ type: 'DECAY', amount: DECAY_PER_SECOND * dt })
      }
    }, 100)

    return () => clearInterval(interval)
  }, [state.gameState, state.lastClickTime])

  const click = useCallback(() => dispatch({ type: 'CLICK' }), [])
  const start = useCallback(() => dispatch({ type: 'START' }), [])
  const boomDone = useCallback(() => dispatch({ type: 'BOOM_DONE' }), [])
  const nextLevel = useCallback(() => dispatch({ type: 'NEXT_LEVEL' }), [])
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), [])

  const clicksNeededNow = clicksNeeded(state.level)
  const stageProgress = Math.min(state.stageClicks / clicksNeededNow, 1)

  return {
    ...state,
    GAME_STATES,
    click,
    start,
    boomDone,
    nextLevel,
    restart,
    stageProgress,
    clicksNeededNow,
  }
}
