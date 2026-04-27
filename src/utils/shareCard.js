import { levelFor } from '../constants/levels'

const W = 1080
const H = 1920
const EMOJI = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", system-ui'
const SANS = 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif'

function fmtTime(ms) {
  if (!ms || ms < 0) return '—'
  const s = Math.round(ms / 1000)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// Draws a 1080×1920 brag card. Returns a Blob (PNG).
export async function buildShareCard({ level, score, comboPeak, totalClicks, levelDurationMs, isRecord }) {
  const lv = levelFor(level)

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Sky gradient — matches the country we just cleared
  const sky = ctx.createLinearGradient(0, 0, 0, H)
  sky.addColorStop(0, lv.sky[0])
  sky.addColorStop(0.55, lv.sky[1])
  sky.addColorStop(1, lv.sky[2])
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, W, H)

  // Diagonal sheen
  const sheen = ctx.createLinearGradient(0, 0, W, H)
  sheen.addColorStop(0, 'rgba(255,255,255,0.18)')
  sheen.addColorStop(0.5, 'rgba(255,255,255,0)')
  sheen.addColorStop(1, 'rgba(0,0,0,0.25)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, W, H)

  // Soft accent glow behind the flag
  const glow = ctx.createRadialGradient(W / 2, 560, 40, W / 2, 560, 600)
  glow.addColorStop(0, lv.accent + 'cc')
  glow.addColorStop(1, lv.accent + '00')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, 1100)

  // Big flag
  ctx.textAlign = 'center'
  ctx.font = `380px ${EMOJI}`
  ctx.fillText(lv.flag, W / 2, 700)

  // Boom on top
  ctx.font = `220px ${EMOJI}`
  ctx.fillText('💥', W / 2 + 220, 360)

  // Cleared label pill
  const clearedTxt = `CLEARED ${lv.country.toUpperCase()}`
  ctx.font = `900 78px ${SANS}`
  const ctw = ctx.measureText(clearedTxt).width
  const pillW = ctw + 100
  const pillX = (W - pillW) / 2
  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  roundRect(ctx, pillX, 990, pillW, 110, 55)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'
  ctx.lineWidth = 4
  roundRect(ctx, pillX, 990, pillW, 110, 55)
  ctx.stroke()
  ctx.fillStyle = '#ffffff'
  ctx.fillText(clearedTxt, W / 2, 1068)

  // Cry quote
  ctx.fillStyle = '#fde68a'
  ctx.font = `italic 900 64px ${SANS}`
  ctx.fillText(`"${lv.cry}"`, W / 2, 1170)

  // Score block
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = `900 50px ${SANS}`
  ctx.fillText('FINAL SCORE', W / 2, 1260)

  ctx.fillStyle = '#ffffff'
  ctx.font = `900 210px ${SANS}`
  ctx.shadowColor = 'rgba(0,0,0,0.45)'
  ctx.shadowBlur = 30
  ctx.shadowOffsetY = 10
  ctx.fillText(Math.floor(score).toLocaleString(), W / 2, 1450)
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  // Stat row — peak combo · clear time · taps
  const stats = [
    { k: 'COMBO',  v: `${comboPeak}×` },
    { k: 'TIME',   v: fmtTime(levelDurationMs) },
    { k: 'BITES',  v: (totalClicks || 0).toLocaleString() },
  ]
  const cardW = 280
  const gap = 30
  const totalW = cardW * stats.length + gap * (stats.length - 1)
  const startX = (W - totalW) / 2
  stats.forEach((s, i) => {
    const x = startX + i * (cardW + gap)
    const y = 1510
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    roundRect(ctx, x, y, cardW, 140, 22)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'
    ctx.lineWidth = 3
    roundRect(ctx, x, y, cardW, 140, 22)
    ctx.stroke()

    ctx.fillStyle = 'rgba(255,255,255,0.65)'
    ctx.font = `900 28px ${SANS}`
    ctx.fillText(s.k, x + cardW / 2, y + 46)
    ctx.fillStyle = '#ffffff'
    ctx.font = `900 64px ${SANS}`
    ctx.fillText(s.v, x + cardW / 2, y + 115)
  })

  // Record ribbon — pill above the wordmark, only when it's actually a PB
  if (isRecord) {
    const recTxt = '★ NEW PERSONAL BEST'
    ctx.font = `900 44px ${SANS}`
    const rw = ctx.measureText(recTxt).width
    const pw = rw + 70
    const px = (W - pw) / 2
    ctx.fillStyle = 'rgba(0,0,0,0.45)'
    roundRect(ctx, px, 1700, pw, 70, 35)
    ctx.fill()
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 3
    roundRect(ctx, px, 1700, pw, 70, 35)
    ctx.stroke()
    ctx.fillStyle = '#fbbf24'
    ctx.fillText(recTxt, W / 2, 1750)
  }

  // Wordmark + tagline (sits at bottom regardless of record state)
  ctx.fillStyle = '#ffffff'
  ctx.font = `900 78px ${SANS}`
  ctx.fillText('FAT MAN 🍔', W / 2, 1850)
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = `bold 32px ${SANS}`
  ctx.fillText('beat my score', W / 2, 1895)

  return await new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/png', 0.95))
}
