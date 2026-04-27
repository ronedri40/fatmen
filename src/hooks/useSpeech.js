import { useCallback, useEffect, useRef } from 'react'

// Speak short phrases via Web Speech API. Picks the closest installed voice
// for the requested language (browsers ship a varying set; we degrade
// gracefully). Cancels any previous utterance before starting a new one.
export function useSpeech(enabled = true) {
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled
  const voicesRef = useRef([])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const load = () => { voicesRef.current = window.speechSynthesis.getVoices() }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  const findVoice = useCallback((lang) => {
    const v = voicesRef.current
    if (!v.length || !lang) return null
    // exact match first
    const exact = v.find(x => x.lang === lang)
    if (exact) return exact
    // language-prefix match (e.g. en-US → en-GB)
    const prefix = lang.split('-')[0]
    return v.find(x => x.lang?.startsWith(prefix)) || null
  }, [])

  const speak = useCallback((spec) => {
    if (!enabledRef.current) return
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    if (!spec || !spec.text) return
    try {
      window.speechSynthesis.cancel()
      const utt = new SpeechSynthesisUtterance(spec.text)
      utt.lang = spec.lang || 'en-US'
      utt.rate = spec.rate ?? 1.0
      utt.pitch = spec.pitch ?? 1.0
      utt.volume = 1
      const voice = findVoice(spec.lang)
      if (voice) utt.voice = voice
      window.speechSynthesis.speak(utt)
    } catch {}
  }, [findVoice])

  const cancel = useCallback(() => {
    try { window.speechSynthesis?.cancel() } catch {}
  }, [])

  return { speak, cancel }
}
