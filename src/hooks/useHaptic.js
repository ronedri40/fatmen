import { useCallback, useMemo, useRef } from 'react'

export function useHaptic(enabled = true) {
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  const buzz = useCallback((pattern) => {
    if (!enabledRef.current) return
    if (typeof navigator === 'undefined' || !navigator.vibrate) return
    try { navigator.vibrate(pattern) } catch {}
  }, [])

  return useMemo(() => ({
    tap:   () => buzz(8),
    stage: () => buzz([0, 30, 30, 30]),
    boom:  () => buzz([0, 60, 40, 80, 40, 120]),
  }), [buzz])
}
