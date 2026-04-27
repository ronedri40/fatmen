import { useEffect, useRef, useState } from 'react'

export function usePersistedState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw == null) return initial
      return JSON.parse(raw)
    } catch {
      return initial
    }
  })

  const ref = useRef(value)
  ref.current = value

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  }, [key, value])

  return [value, setValue, ref]
}
