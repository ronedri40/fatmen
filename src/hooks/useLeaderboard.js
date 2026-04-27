import { useState, useCallback } from 'react'

const KEY = 'fatman.leaderboard'
const NAME_KEY = 'fatman.playerName'
const MAX = 10

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}

export function useLeaderboard() {
  const [entries, setEntries] = useState(load)
  const [playerName, setPlayerNameState] = useState(
    () => localStorage.getItem(NAME_KEY) || 'Player'
  )

  const setPlayerName = useCallback((name) => {
    const trimmed = name.trim() || 'Player'
    localStorage.setItem(NAME_KEY, trimmed)
    setPlayerNameState(trimmed)
  }, [])

  const qualifies = useCallback((score) => {
    if (score <= 0) return false
    const lb = load()
    return lb.length < MAX || score > (lb[lb.length - 1]?.score ?? 0)
  }, [])

  // Auto-save: name comes from stored playerName
  const addEntry = useCallback((score, level) => {
    const name = localStorage.getItem(NAME_KEY) || 'Player'
    const entry = {
      name,
      score,
      level,
      date: new Date().toLocaleDateString(),
    }
    const updated = [...load(), entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(updated))
    setEntries(updated)
  }, [])

  return { entries, qualifies, addEntry, playerName, setPlayerName }
}
