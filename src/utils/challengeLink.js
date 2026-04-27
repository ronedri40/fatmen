// Encodes a challenge into a single short query param so it survives
// link-shorteners and copy/paste. Format:
//   ?c=<base64url(JSON{ s, l, t })>
// where s = score, l = level id (string), t = clear time in ms.

function b64urlEncode(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlDecode(str) {
  let s = str.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  try { return atob(s) } catch { return null }
}

export function buildChallengeUrl({ score, levelId, levelDurationMs }) {
  const payload = JSON.stringify({ s: Math.floor(score), l: levelId, t: Math.round(levelDurationMs || 0) })
  const enc = b64urlEncode(payload)
  const base = window.location.origin + window.location.pathname
  return `${base}?c=${enc}`
}

// Reads the current URL and returns { score, levelId, durationMs } or null.
export function readChallengeFromUrl() {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const c = params.get('c')
  if (!c) return null
  const json = b64urlDecode(c)
  if (!json) return null
  try {
    const parsed = JSON.parse(json)
    if (typeof parsed.s !== 'number') return null
    return { score: parsed.s, levelId: parsed.l, durationMs: parsed.t || 0 }
  } catch {
    return null
  }
}

// Strip the challenge param from the URL bar after we've read it,
// so refresh / share-after-play doesn't keep echoing the same friend's score.
export function clearChallengeFromUrl() {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (!url.searchParams.has('c')) return
  url.searchParams.delete('c')
  window.history.replaceState({}, '', url.toString())
}
