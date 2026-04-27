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

  // Chomp: a wet, noisy mouth-close. Built from a short pitched-noise burst
  // through a lowpass filter that closes fast — sounds more "om nom" than the
  // square-wave blip it replaces. Pitch wobbles up with combo so a streak feels
  // hungrier and more excited.
  const tap = useCallback((combo = 0) => {
    const ctx = ensureCtx()
    if (!ctx) return
    const t0 = ctx.currentTime
    const dur = 0.09
    const intensity = Math.min(combo, 25) / 25  // 0..1

    // 1. Noise burst — the "chomp" texture
    const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 1.6)
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buf
    const noiseFilt = ctx.createBiquadFilter()
    noiseFilt.type = 'lowpass'
    const startCut = 1600 + intensity * 1200
    noiseFilt.frequency.setValueAtTime(startCut, t0)
    noiseFilt.frequency.exponentialRampToValueAtTime(220, t0 + dur)
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.18 + 0.06 * intensity, t0)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    noise.connect(noiseFilt).connect(noiseGain).connect(ctx.destination)
    noise.start(t0)
    noise.stop(t0 + dur + 0.02)

    // 2. Tonal "pop" body — gives it pitch so it isn't just hiss
    const baseFreq = 230 + intensity * 130 + (Math.random() - 0.5) * 40
    beep({ freq: baseFreq, sweepTo: baseFreq * 0.55, dur: 0.07, type: 'sine', vol: 0.09, attack: 0.002 })
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

  // Burp — low sawtooth sweep down, very satisfying/funny for stage advances
  const burp = useCallback(() => {
    const ctx = ensureCtx()
    if (!ctx) return
    const t0 = ctx.currentTime
    const osc = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()
    filter.type = 'lowpass'
    filter.frequency.value = 600
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(140, t0)
    osc.frequency.exponentialRampToValueAtTime(45, t0 + 0.35)
    gain.gain.setValueAtTime(0.28, t0)
    gain.gain.linearRampToValueAtTime(0.32, t0 + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.4)
    osc.connect(filter).connect(gain).connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + 0.42)
    // Little tonal squeak at the end
    setTimeout(() => beep({ freq: 800, sweepTo: 500, dur: 0.08, type: 'sine', vol: 0.07 }), 280)
  }, [beep, ensureCtx])

  // UI click
  const ui = useCallback(() => {
    beep({ freq: 660, sweepTo: 880, dur: 0.06, type: 'triangle', vol: 0.1 })
  }, [beep])

  return { tap, pop, burp, boom, levelUp, ui }
}
