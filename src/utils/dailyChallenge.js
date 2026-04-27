import { LEVELS } from '../constants/levels'

// "YYYY-MM-DD" in the player's local timezone — same key for every load today.
export function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Stable hash → pick today's country. Uses a multiplicative hash on the date
// string so the order is unpredictable but identical for everyone today.
export function todayLevelIndex() {
  const k = todayKey()
  let h = 2166136261
  for (let i = 0; i < k.length; i++) {
    h ^= k.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h) % LEVELS.length
}

export function todayLevel() {
  return LEVELS[todayLevelIndex()]
}

// 1-indexed level number to start at today
export function todayStartLevel() {
  return todayLevelIndex() + 1
}
