import { useState } from 'react'
import { motion } from 'framer-motion'
import { buildShareCard } from '../../utils/shareCard'
import { buildChallengeUrl } from '../../utils/challengeLink'

export default function ShareButton({ stats, onSound }) {
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')   // '' | 'shared' | 'saved' | 'copied' | 'error'

  const downloadBlob = (blob, filename) => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const handleShare = async (e) => {
    e.stopPropagation()
    if (busy) return
    onSound?.()
    setBusy(true)
    setStatus('')
    let blob, file, url, text, filename
    try {
      blob = await buildShareCard(stats)
      filename = `fatman-${Math.floor(stats.score)}.png`
      file = new File([blob], filename, { type: 'image/png' })
      // Encode the challenge into the URL so receivers see "BEAT MY 12,450"
      url = buildChallengeUrl(stats)
      text = `I scored ${Math.floor(stats.score).toLocaleString()} on Fat Man — beat me?`
    } catch {
      setStatus('error')
      setBusy(false)
      setTimeout(() => setStatus(''), 2200)
      return
    }

    // 1. Native share sheet with the image file (mobile Safari/Chrome).
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Fat Man — World Tour', text, url })
        setStatus('shared')
        setBusy(false); setTimeout(() => setStatus(''), 2200)
        return
      } catch (err) {
        if (err?.name === 'AbortError') {
          setBusy(false); setStatus(''); return  // user cancelled — silent
        }
        // Otherwise drop through to alternative paths.
      }
    }

    // 2. Native share sheet with just text/url (Firefox Android, some Safaris).
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Fat Man — World Tour', text, url })
        // Pair with a download so they can attach the image to the share manually.
        downloadBlob(blob, filename)
        setStatus('shared')
        setBusy(false); setTimeout(() => setStatus(''), 2200)
        return
      } catch (err) {
        if (err?.name === 'AbortError') {
          setBusy(false); setStatus(''); return
        }
      }
    }

    // 3. Desktop: copy image to clipboard if permitted.
    if (navigator.clipboard && window.ClipboardItem) {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setStatus('copied')
        setBusy(false); setTimeout(() => setStatus(''), 2200)
        return
      } catch {
        // permission denied / no focus — fall through to download
      }
    }

    // 4. Hard fallback: download the PNG.
    downloadBlob(blob, filename)
    setStatus('saved')
    setBusy(false)
    setTimeout(() => setStatus(''), 2200)
  }

  const label =
    busy        ? 'Building card…' :
    status === 'shared' ? 'Shared ✓' :
    status === 'saved'  ? 'Saved ✓' :
    status === 'copied' ? 'Copied to clipboard ✓' :
    status === 'error'  ? 'Try again' :
    'SHARE RESULT'

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      disabled={busy}
      className="w-full py-3.5 rounded-2xl font-black text-sm text-white tracking-wider
        bg-white/15 border border-white/30 backdrop-blur-md
        flex items-center justify-center gap-2 disabled:opacity-70"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <polyline points="16 6 12 2 8 6"/>
        <line x1="12" y1="2" x2="12" y2="15"/>
      </svg>
      {label}
    </motion.button>
  )
}
