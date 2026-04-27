import { useCallback, useEffect, useRef } from 'react'

// Lightweight Web Audio synth — no asset loading. Call useAudio() once,
// then `play.tap()`, `play.pop()`, `play.boom()`, `play.levelUp()`.
export function useAudio(enabled = true) {
  const ctxRef = useRef(null)
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  const ensureCtx = useCallback(() => {
    if (!enabledRef.current) return null
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return null
      ctxRef.current = new Ctx()
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume().catch(() => {})
    }
    return ctxRef.current
  }, [])

  useEffect(() => () => {
    try { ctxRef.current?.close() } catch {}
  }, [])

  const beep = useCallback(({ freq = 440, dur = 0.08, type = 'sine', vol = 0.15, sweepTo, attack = 0.005 }) => {
    const ctx = ensureCtx()
    if (!ctx) return
    const t0 = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t0)
    if (sweepTo != null) osc.frequency.exponentialRampToValueAtTime(Math.max(20, sweepTo), t0 + dur)
    gain.gain.setValueAtTime(0, t0)
    gain.gain.linearRampToValueAtTime(vol, t0 + attack)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + dur + 0.02)
  }, [ensureCtx])

  // Munch / chomp: noisy quick burst
  const tap = useCallback((combo = 0) => {
    const ctx = ensureCtx()
    if (!ctx) return
    const baseFreq = 280 + Math.min(combo, 30) * 18
    beep({ freq: baseFreq, sweepTo: baseFreq * 0.45, dur: 0.08, type: 'square', vol: 0.07 })
    beep({ freq: baseFreq * 1.6, sweepTo: baseFreq * 0.7, dur: 0.05, type: 'triangle', vol: 0.05 })
  }, [beep, ensureCtx])

  // Stage advance
  const pop = useCallback(() => {
    beep({ freq: 520, sweepTo: 880, dur: 0.18, type: 'sine', vol: 0.18 })
    setTimeout(() => beep({ freq: 880, sweepTo: 1320, dur: 0.16, type: 'sine', vol: 0.14 }), 80)
  }, [beep])

  // Explosion
  const boom = useCallback(() => {
    const ctx = ensureCtx()
    if (!ctx) return
    const t0 = ctx.currentTime
    // Noise burst via buffer
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2)
    }
    const src = ctx.createBufferSource()
    src.buffer = buf
    const filt = ctx.createBiquadFilter()
    filt.type = 'lowpass'
    filt.frequency.setValueAtTime(2200, t0)
    filt.frequency.exponentialRampToValueAtTime(80, t0 + 0.4)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.6, t0)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.45)
    src.connect(filt).connect(gain).connect(ctx.destination)
    src.start(t0)
    src.stop(t0 + 0.5)
    // Sub thump
    beep({ freq: 80, sweepTo: 30, dur: 0.5, type: 'sine', vol: 0.5 })
  }, [beep, ensureCtx])

  // Level up jingle
  const levelUp = useCallback(() => {
    const notes = [523, 659, 784, 1047]
    notes.forEach((f, i) =>
      setTimeout(() => beep({ freq: f, dur: 0.18, type: 'triangle', vol: 0.18 }), i * 90)
    )
  }, [beep])

  // UI click
  const ui = useCallback(() => {
    beep({ freq: 660, sweepTo: 880, dur: 0.06, type: 'triangle', vol: 0.1 })
  }, [beep])

  return { tap, pop, boom, levelUp, ui }
}
