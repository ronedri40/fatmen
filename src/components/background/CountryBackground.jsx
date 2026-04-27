import { memo } from 'react'
import { motion } from 'framer-motion'

// Per-country silhouette decals — drawn with SVG over a vertical gradient.
// Kept abstract so character stays foregrounded.
const SCENES = {
  usa: ({ ground }) => (
    <>
      {/* highway lines */}
      {[0, 1, 2, 3].map(i => (
        <motion.rect key={i} x={120 + i * 80} y={460} width={40} height={6} rx={3} fill="#fef3c7" opacity={0.7}
          animate={{ x: [120 + i * 80, -40] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', delay: i * 0.6 }}
        />
      ))}
      {/* mesa silhouettes */}
      <path d="M 0 420 L 60 360 L 120 360 L 140 380 L 180 380 L 200 350 L 260 350 L 280 380 L 360 380 L 360 500 L 0 500 Z" fill={ground} opacity={0.6} />
      {/* sun */}
      <circle cx="300" cy="120" r="50" fill="#fef3c7" opacity={0.7} />
      <circle cx="300" cy="120" r="38" fill="#fbbf24" opacity={0.85} />
      {/* cactus */}
      <g fill="#365314" opacity={0.5}>
        <rect x="40" y="370" width="10" height="40" rx="4" />
        <rect x="32" y="380" width="8" height="20" rx="3" />
        <rect x="50" y="385" width="8" height="18" rx="3" />
      </g>
    </>
  ),

  japan: ({ ground }) => (
    <>
      <circle cx="270" cy="130" r="60" fill="#fecaca" opacity={0.55} />
      <circle cx="270" cy="130" r="44" fill="#fda4af" opacity={0.85} />
      {/* Mt Fuji */}
      <path d="M 0 430 L 110 280 L 140 300 L 180 250 L 220 300 L 260 280 L 360 430 Z" fill="#1e293b" opacity={0.55} />
      <path d="M 145 290 L 180 250 L 215 290 L 200 295 L 180 280 L 160 295 Z" fill="#fff" opacity={0.85} />
      {/* sakura petals */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.circle key={i}
          cx={20 + i * 30}
          cy={-10}
          r={3}
          fill="#fbcfe8"
          opacity={0.8}
          animate={{ y: [0, 540], x: [0, (i % 2 ? 30 : -30)], rotate: [0, 360] }}
          transition={{ duration: 6 + (i % 4), repeat: Infinity, ease: 'linear', delay: i * 0.4 }}
        />
      ))}
      <rect x="0" y="430" width="360" height="80" fill={ground} opacity={0.6} />
    </>
  ),

  mexico: ({ ground }) => (
    <>
      <circle cx="80" cy="120" r="42" fill="#fbbf24" opacity={0.85} />
      {/* pyramid */}
      <path d="M 200 430 L 280 280 L 360 430 Z" fill="#78350f" opacity={0.7} />
      <path d="M 200 430 L 280 280 L 360 430 Z" fill="none" stroke="#fbbf24" strokeWidth="2" opacity={0.5} strokeDasharray="6 6" />
      {/* cacti */}
      <g fill="#15803d" opacity={0.7}>
        <rect x="30" y="360" width="14" height="70" rx="6" />
        <rect x="20" y="380" width="10" height="28" rx="4" />
        <rect x="44" y="385" width="10" height="24" rx="4" />
        <rect x="120" y="380" width="12" height="50" rx="5" />
      </g>
      <rect x="0" y="430" width="360" height="80" fill={ground} opacity={0.7} />
    </>
  ),

  italy: ({ ground }) => (
    <>
      <circle cx="60" cy="80" r="22" fill="#fef3c7" opacity={0.7} />
      {/* colosseum arches */}
      <g fill="#a8a29e" opacity={0.6}>
        <rect x="30" y="320" width="300" height="110" rx="6" />
      </g>
      <g fill={ground} opacity={0.95}>
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={i} x={50 + i * 56} y={340} width={36} height={70} rx={18} />
        ))}
      </g>
      <rect x="0" y="430" width="360" height="80" fill={ground} opacity={0.6} />
    </>
  ),

  russia: ({ ground }) => (
    <>
      {/* snowflakes */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.text key={i}
          x={(i * 23) % 360}
          y={-10}
          fill="#fff"
          fontSize="14"
          opacity={0.7}
          animate={{ y: [0, 540] }}
          transition={{ duration: 5 + (i % 5), repeat: Infinity, ease: 'linear', delay: i * 0.25 }}
        >❄</motion.text>
      ))}
      {/* onion dome */}
      <g fill="#dc2626" opacity={0.85}>
        <path d="M 240 360 Q 240 300 270 300 Q 300 300 300 360 L 290 380 L 250 380 Z" />
      </g>
      <rect x="262" y="280" width="16" height="30" fill="#fbbf24" />
      <rect x="0" y="380" width="360" height="120" fill={ground} opacity={0.7} />
      <rect x="0" y="395" width="360" height="120" fill="#fff" opacity={0.5} />
    </>
  ),

  france: ({ ground }) => (
    <>
      <circle cx="80" cy="120" r="40" fill="#fff" opacity={0.5} />
      {/* Eiffel Tower */}
      <g fill="#0f172a" opacity={0.65}>
        <path d="M 250 430 L 270 200 L 290 200 L 310 430 Z" />
        <rect x="255" y="320" width="50" height="6" />
        <rect x="260" y="370" width="40" height="6" />
      </g>
      {/* stars */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.circle key={i}
          cx={(i * 27) % 360}
          cy={20 + (i * 11) % 200}
          r={1.5}
          fill="#fff"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      <rect x="0" y="430" width="360" height="80" fill={ground} opacity={0.7} />
    </>
  ),

  india: ({ ground }) => (
    <>
      <circle cx="280" cy="100" r="50" fill="#fef3c7" opacity={0.7} />
      {/* Taj silhouette */}
      <g fill="#fbbf24" opacity={0.6}>
        <path d="M 100 360 Q 100 280 160 280 Q 220 280 220 360 L 220 400 L 100 400 Z" />
        <rect x="155" y="240" width="10" height="50" />
        <circle cx="160" cy="240" r="8" />
      </g>
      {/* lanterns */}
      {[0, 1, 2, 3].map(i => (
        <motion.g key={i}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
        >
          <circle cx={40 + i * 90} cy={100} r="8" fill="#fbbf24" opacity={0.85} />
          <line x1={40 + i * 90} y1={92} x2={40 + i * 90} y2={40} stroke="#fbbf24" strokeWidth={1} opacity={0.5} />
        </motion.g>
      ))}
      <rect x="0" y="430" width="360" height="80" fill={ground} opacity={0.7} />
    </>
  ),

  brazil: ({ ground }) => (
    <>
      <circle cx="60" cy="100" r="34" fill="#facc15" opacity={0.85} />
      {/* sugarloaf */}
      <path d="M 230 430 Q 230 320 280 320 Q 330 320 330 430 Z" fill="#365314" opacity={0.7} />
      {/* palm trees */}
      <g fill="#14532d" opacity={0.7}>
        <rect x="40" y="320" width="6" height="100" rx="2" />
        <path d="M 30 320 Q 50 300 70 330 M 30 318 Q 18 308 14 326 M 60 320 Q 80 308 78 330 M 30 314 Q 50 290 50 270" stroke="#16a34a" strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
      {/* confetti */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.rect key={i}
          x={(i * 31) % 360}
          y={-8}
          width={4}
          height={8}
          fill={['#22c55e', '#facc15', '#3b82f6', '#ec4899'][i % 4]}
          animate={{ y: [0, 540], rotate: [0, 360] }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
        />
      ))}
      <rect x="0" y="430" width="360" height="80" fill={ground} opacity={0.7} />
    </>
  ),

  germany: ({ ground }) => (
    <>
      {/* castle */}
      <g fill="#a8a29e" opacity={0.7}>
        <rect x="100" y="280" width="160" height="150" />
        <path d="M 100 280 L 130 240 L 160 280 Z" />
        <path d="M 200 280 L 230 240 L 260 280 Z" />
        <rect x="170" y="220" width="20" height="60" />
      </g>
      <rect x="0" y="430" width="360" height="80" fill={ground} opacity={0.7} />
      {/* pretzels floating */}
      {[0, 1, 2].map(i => (
        <motion.text key={i}
          x={50 + i * 110}
          y={150 + i * 30}
          fontSize="22"
          animate={{ y: [150 + i * 30, 130 + i * 30, 150 + i * 30] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
        >🥨</motion.text>
      ))}
    </>
  ),

  china: ({ ground }) => (
    <>
      <circle cx="80" cy="100" r="28" fill="#fbbf24" opacity={0.85} />
      {/* great wall */}
      <path d="M 0 380 L 60 360 L 60 350 L 80 350 L 80 360 L 140 360 L 140 350 L 160 350 L 160 360 L 220 340 L 220 330 L 240 330 L 240 340 L 360 320 L 360 430 L 0 430 Z" fill={ground} opacity={0.65} />
      {/* lanterns */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.g key={i}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        >
          <ellipse cx={30 + i * 80} cy={70} rx="11" ry="14" fill="#dc2626" opacity={0.9} />
          <rect x={30 + i * 80 - 1} y={84} width={2} height={6} fill="#fbbf24" />
          <line x1={30 + i * 80} y1={56} x2={30 + i * 80} y2={20} stroke="#fbbf24" strokeWidth={1} opacity={0.5} />
        </motion.g>
      ))}
    </>
  ),
}

function CountryBackgroundImpl({ levelData, fatStage }) {
  const sceneFn = SCENES[levelData.id]
  const [c1, c2, c3] = levelData.sky
  const intensity = (fatStage + 1) / 5

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        background: `linear-gradient(180deg, ${c1} 0%, ${c2} 55%, ${c3} 100%)`,
        transition: 'background 1.2s ease',
      }}
    >
      {/* sky vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 110%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 60%)'
      }} />

      <svg viewBox="0 0 360 500" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
        {sceneFn && sceneFn({ ground: levelData.ground })}
      </svg>

      {/* fat-stage warmth — gets more intense as he gets fatter */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 65%, ${levelData.accent}${Math.floor(intensity * 50).toString(16).padStart(2,'0')} 0%, transparent 65%)`,
          transition: 'background 1s ease',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  )
}

// Background only changes on level-up or stage change. Tapping must not re-render
// it — animated children (sakura, lanterns, confetti) lose phase on remount.
const CountryBackground = memo(CountryBackgroundImpl, (prev, next) =>
  prev.levelData === next.levelData && prev.fatStage === next.fatStage
)
export default CountryBackground
