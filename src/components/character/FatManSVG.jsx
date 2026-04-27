import { motion } from 'framer-motion'
import Accessories from './Accessories'

const CX = 160
const T = { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }

// Body geometry per fat-stage, palette-agnostic. The character SVG renders these
// proportions and the calling code passes a per-country `palette` to color it.
export const STAGES = [
  { headR:46,headCY:84,
    eyeY:74,eyeOffX:15,eyeRX:7,eyeRY:8,pupilR:4,
    browY:63,browOffX:14,browLen:14,
    noseY:91,noseRX:5,noseRY:6,
    mouthY:103,mouthRX:15,mouthRY:9,
    cheekOffX:34,cheekY:88,cheekRX:12,cheekRY:8,cheekOp:0,
    chinRX:0,chinRY:0,chinOp:0,
    neckW:28,neckTop:130,neckBot:150,
    bodyRX:56,bodyRY:76,bodyCY:226,
    bellyRX:0,bellyRY:0,bellyOp:0,bellyY:302,
    armSX:50,armSY:214,armEX:32,armEY:280,armW:22,
    legW:24,legH:68,legSpread:18 },
  { headR:53,headCY:87,
    eyeY:77,eyeOffX:17,eyeRX:7,eyeRY:7.5,pupilR:4,
    browY:66,browOffX:16,browLen:16,
    noseY:94,noseRX:6,noseRY:7,
    mouthY:108,mouthRX:18,mouthRY:10,
    cheekOffX:38,cheekY:94,cheekRX:16,cheekRY:10,cheekOp:0.3,
    chinRX:32,chinRY:9,chinOp:0.6,
    neckW:36,neckTop:140,neckBot:158,
    bodyRX:80,bodyRY:88,bodyCY:246,
    bellyRX:55,bellyRY:16,bellyOp:0.7,bellyY:334,
    armSX:72,armSY:232,armEX:46,armEY:296,armW:28,
    legW:30,legH:66,legSpread:22 },
  { headR:62,headCY:91,
    eyeY:82,eyeOffX:20,eyeRX:7,eyeRY:7,pupilR:4,
    browY:71,browOffX:19,browLen:18,
    noseY:100,noseRX:7,noseRY:8,
    mouthY:116,mouthRX:22,mouthRY:12,
    cheekOffX:44,cheekY:100,cheekRX:20,cheekRY:13,cheekOp:0.38,
    chinRX:44,chinRY:13,chinOp:0.85,
    neckW:46,neckTop:153,neckBot:168,
    bodyRX:108,bodyRY:96,bodyCY:264,
    bellyRX:82,bellyRY:24,bellyOp:1,bellyY:360,
    armSX:98,armSY:248,armEX:60,armEY:308,armW:36,
    legW:38,legH:62,legSpread:28 },
  { headR:72,headCY:96,
    eyeY:88,eyeOffX:23,eyeRX:7,eyeRY:6,pupilR:3.5,
    browY:77,browOffX:22,browLen:20,
    noseY:108,noseRX:9,noseRY:10,
    mouthY:125,mouthRX:27,mouthRY:14,
    cheekOffX:50,cheekY:108,cheekRX:26,cheekRY:17,cheekOp:0.44,
    chinRX:58,chinRY:18,chinOp:0.9,
    neckW:58,neckTop:168,neckBot:180,
    bodyRX:134,bodyRY:102,bodyCY:282,
    bellyRX:112,bellyRY:32,bellyOp:1,bellyY:384,
    armSX:122,armSY:264,armEX:72,armEY:320,armW:46,
    legW:48,legH:56,legSpread:34 },
  { headR:82,headCY:101,
    eyeY:93,eyeOffX:27,eyeRX:7,eyeRY:5,pupilR:3,
    browY:83,browOffX:26,browLen:23,
    noseY:117,noseRX:11,noseRY:12,
    mouthY:135,mouthRX:33,mouthRY:17,
    cheekOffX:57,cheekY:116,cheekRX:32,cheekRY:21,cheekOp:0.5,
    chinRX:72,chinRY:23,chinOp:1,
    neckW:72,neckTop:183,neckBot:192,
    bodyRX:155,bodyRY:108,bodyCY:300,
    bellyRX:135,bellyRY:40,bellyOp:1,bellyY:408,
    armSX:140,armSY:278,armEX:86,armEY:326,armW:58,
    legW:62,legH:44,legSpread:42 },
]

export default function FatManSVG({ stage, palette, accessories = [], mouthRef, level = 1 }) {
  const p = STAGES[Math.min(stage, 4)]
  const skin = palette?.skin || '#FDBCB4'
  const shirt = palette?.shirt || '#3B82F6'
  const stripe = palette?.stripe
  const pants = palette?.pants || '#1E3A5F'
  const hair = palette?.hair || '#3D1C02'

  const legTop = p.bodyCY + p.bodyRY - 10
  const leftLegX = CX - p.legSpread - p.legW / 2
  const rightLegX = CX + p.legSpread - p.legW / 2

  const leftArmPath  = `M ${CX - p.armSX} ${p.armSY} Q ${CX - p.armSX - 20} ${(p.armSY + p.armEY)/2} ${CX - p.armEX} ${p.armEY}`
  const rightArmPath = `M ${CX + p.armSX} ${p.armSY} Q ${CX + p.armSX + 20} ${(p.armSY + p.armEY)/2} ${CX + p.armEX} ${p.armEY}`
  const teethCount = Math.round(p.mouthRX / 5)

  const gradId = `g-${level}-${stage}`
  const showHair = !accessories.includes('turban') && !accessories.includes('ushanka') && !accessories.includes('sombrero')

  return (
    <svg
      viewBox="0 0 320 460"
      style={{ width: '100%', maxWidth: 280, height: 'auto', overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={`skinGrad${gradId}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor={skin} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`shirtGrad${gradId}`} cx="40%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="100%" stopColor={shirt} stopOpacity="0" />
        </radialGradient>
        <filter id="char-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* shadow under feet */}
      <ellipse cx={CX} cy={legTop + p.legH + 14} rx={p.bodyRX * 0.9} ry={6} fill="#000" opacity={0.35} />

      {/* legs / pants */}
      <motion.rect animate={{ x: leftLegX,  y: legTop, width: p.legW, height: p.legH, rx: p.legW/2 }} transition={T} fill={pants} />
      <motion.rect animate={{ x: rightLegX, y: legTop, width: p.legW, height: p.legH, rx: p.legW/2 }} transition={T} fill={pants} />
      <motion.ellipse animate={{ cx: leftLegX  + p.legW/2, cy: legTop + p.legH + 6, rx: p.legW*0.7, ry: 8 }} transition={T} fill="#111" />
      <motion.ellipse animate={{ cx: rightLegX + p.legW/2, cy: legTop + p.legH + 6, rx: p.legW*0.7, ry: 8 }} transition={T} fill="#111" />

      {/* body / shirt */}
      <motion.ellipse animate={{ cx: CX, cy: p.bodyCY, rx: p.bodyRX, ry: p.bodyRY }} transition={T} fill={shirt} filter="url(#char-shadow)" />
      <motion.ellipse animate={{ cx: CX, cy: p.bodyCY, rx: p.bodyRX, ry: p.bodyRY }} transition={T} fill={`url(#shirtGrad${gradId})`} />
      {/* belly bulge */}
      <motion.ellipse animate={{ cx: CX, cy: p.bellyY, rx: p.bellyRX, ry: p.bellyRY, opacity: p.bellyOp }} transition={T} fill={shirt} />

      {/* horizontal stripes (France) */}
      {stripe && [-0.45, -0.15, 0.15, 0.45].map((t, i) => (
        <motion.ellipse
          key={i}
          animate={{ cx: CX, cy: p.bodyCY + p.bodyRY * t, rx: p.bodyRX * Math.sqrt(1 - t*t) - 1, ry: 6 }}
          transition={T}
          fill={stripe}
          opacity={0.85}
        />
      ))}

      {/* arms */}
      <motion.path animate={{ d: leftArmPath  }} transition={T} stroke={skin} strokeWidth={p.armW} strokeLinecap="round" fill="none" />
      <motion.path animate={{ d: rightArmPath }} transition={T} stroke={skin} strokeWidth={p.armW} strokeLinecap="round" fill="none" />
      <motion.circle animate={{ cx: CX - p.armEX, cy: p.armEY, r: p.armW * 0.55 }} transition={T} fill={skin} />
      <motion.circle animate={{ cx: CX + p.armEX, cy: p.armEY, r: p.armW * 0.55 }} transition={T} fill={skin} />

      {/* neck */}
      <motion.rect
        animate={{ x: CX - p.neckW/2, y: p.neckTop, width: p.neckW, height: p.neckBot - p.neckTop, rx: p.neckW/2 }}
        transition={T}
        fill={skin}
      />

      {/* double chin */}
      <motion.ellipse
        animate={{ cx: CX, cy: p.neckTop + 4, rx: p.chinRX, ry: p.chinRY, opacity: p.chinOp }}
        transition={T}
        fill={skin}
      />

      {/* hair cap */}
      {showHair && (
        <motion.ellipse
          animate={{ cx: CX, cy: p.headCY - p.headR * 0.25, rx: p.headR + 5, ry: p.headR * 0.85, opacity: 1 }}
          transition={T}
          fill={hair}
        />
      )}

      {/* head */}
      <motion.circle animate={{ cx: CX, cy: p.headCY, r: p.headR }} transition={T} fill={skin} filter="url(#char-shadow)" />
      <motion.circle animate={{ cx: CX, cy: p.headCY, r: p.headR }} transition={T} fill={`url(#skinGrad${gradId})`} />

      {/* ears */}
      <motion.ellipse animate={{ cx: CX - p.headR + 2, cy: p.headCY + 4, rx: 10, ry: 13 }} transition={T} fill={skin} />
      <motion.ellipse animate={{ cx: CX + p.headR - 2, cy: p.headCY + 4, rx: 10, ry: 13 }} transition={T} fill={skin} />

      {/* cheeks */}
      <motion.ellipse animate={{ cx: CX - p.cheekOffX, cy: p.cheekY, rx: p.cheekRX, ry: p.cheekRY, opacity: p.cheekOp }} transition={T} fill="#ff8080" />
      <motion.ellipse animate={{ cx: CX + p.cheekOffX, cy: p.cheekY, rx: p.cheekRX, ry: p.cheekRY, opacity: p.cheekOp }} transition={T} fill="#ff8080" />

      {/* eyebrows */}
      <motion.path
        animate={{ d: `M ${CX - p.browOffX - p.browLen/2} ${p.browY} Q ${CX - p.browOffX} ${p.browY - 5} ${CX - p.browOffX + p.browLen/2} ${p.browY}` }}
        transition={T} stroke="#3a1c00" strokeWidth={3.5} strokeLinecap="round" fill="none"
      />
      <motion.path
        animate={{ d: `M ${CX + p.browOffX - p.browLen/2} ${p.browY} Q ${CX + p.browOffX} ${p.browY - 5} ${CX + p.browOffX + p.browLen/2} ${p.browY}` }}
        transition={T} stroke="#3a1c00" strokeWidth={3.5} strokeLinecap="round" fill="none"
      />

      {/* eyes */}
      <motion.ellipse animate={{ cx: CX - p.eyeOffX, cy: p.eyeY, rx: p.eyeRX, ry: p.eyeRY }} transition={T} fill="white" />
      <motion.ellipse animate={{ cx: CX + p.eyeOffX, cy: p.eyeY, rx: p.eyeRX, ry: p.eyeRY }} transition={T} fill="white" />
      <motion.circle animate={{ cx: CX - p.eyeOffX, cy: p.eyeY + 1, r: p.pupilR + 1.5 }} transition={T} fill="#5a3010" />
      <motion.circle animate={{ cx: CX + p.eyeOffX, cy: p.eyeY + 1, r: p.pupilR + 1.5 }} transition={T} fill="#5a3010" />
      <motion.circle animate={{ cx: CX - p.eyeOffX, cy: p.eyeY + 1, r: p.pupilR }} transition={T} fill="#111" />
      <motion.circle animate={{ cx: CX + p.eyeOffX, cy: p.eyeY + 1, r: p.pupilR }} transition={T} fill="#111" />
      <motion.circle animate={{ cx: CX - p.eyeOffX + 2, cy: p.eyeY - 2, r: 1.5 }} transition={T} fill="white" />
      <motion.circle animate={{ cx: CX + p.eyeOffX + 2, cy: p.eyeY - 2, r: 1.5 }} transition={T} fill="white" />

      {/* nose */}
      <motion.ellipse animate={{ cx: CX, cy: p.noseY - 2, rx: p.noseRX, ry: p.noseRY }} transition={T} fill={skin} />
      <motion.ellipse animate={{ cx: CX - p.noseRX * 0.6, cy: p.noseY, rx: p.noseRX * 0.45, ry: p.noseRY * 0.4 }} transition={T} fill="#a05050" opacity={0.5} />
      <motion.ellipse animate={{ cx: CX + p.noseRX * 0.6, cy: p.noseY, rx: p.noseRX * 0.45, ry: p.noseRY * 0.4 }} transition={T} fill="#a05050" opacity={0.5} />

      {/* country accessories drawn between face and mouth so hat sits on top */}
      <Accessories accessories={accessories} stage={stage} CX={CX} p={p} palette={palette} />

      {/* open mouth (refed for tap-target alignment) */}
      <g ref={mouthRef}>
        <motion.ellipse animate={{ cx: CX, cy: p.mouthY + 1, rx: p.mouthRX + 2, ry: p.mouthRY + 2 }} transition={T} fill="#8B3A3A" />
        <motion.ellipse animate={{ cx: CX, cy: p.mouthY, rx: p.mouthRX, ry: p.mouthRY }} transition={T} fill="#2a0000" />
        <motion.ellipse animate={{ cx: CX, cy: p.mouthY + p.mouthRY * 0.4, rx: p.mouthRX * 0.65, ry: p.mouthRY * 0.6 }} transition={T} fill="#e0546a" />
        <motion.ellipse animate={{ cx: CX, cy: p.mouthY + p.mouthRY * 0.3, rx: p.mouthRX * 0.25, ry: p.mouthRY * 0.2 }} transition={T} fill="#f0708a" opacity={0.6} />
        {Array.from({ length: Math.max(teethCount, 3) }).map((_, i) => {
          const totalTeeth = Math.max(teethCount, 3)
          const toothW = (p.mouthRX * 2 * 0.9) / totalTeeth
          const startX = CX - p.mouthRX * 0.9 + i * toothW
          return (
            <motion.rect
              key={i}
              animate={{ x: startX + 1, y: p.mouthY - p.mouthRY, width: toothW - 2, height: p.mouthRY * 0.65, rx: 2 }}
              transition={T}
              fill="white"
            />
          )
        })}
        <motion.circle animate={{ cx: CX + p.mouthRX * 0.5, cy: p.mouthY + p.mouthRY * 0.5, r: 2.5 }} transition={T} fill="white" opacity={0.7} />
      </g>

      {/* sweat for fatter stages */}
      {stage >= 3 && (
        <>
          <motion.ellipse cx={CX - p.headR + 8} cy={p.headCY - p.headR * 0.3}
            animate={{ opacity: [0.8, 0.3, 0.8] }} transition={{ repeat: Infinity, duration: 2 }}
            rx={3} ry={6} fill="#88ccff" opacity={0.7} />
          <motion.ellipse cx={CX + p.headR * 0.6} cy={p.headCY - p.headR * 0.5}
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.6, delay: 0.5 }}
            rx={2.5} ry={5} fill="#88ccff" opacity={0.6} />
        </>
      )}
    </svg>
  )
}
