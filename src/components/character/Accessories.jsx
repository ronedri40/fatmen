import { motion } from 'framer-motion'

const T = { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }

// Each accessory is a function that returns SVG fragments. They share access to:
//   CX (center X), p (current stage geometry), palette (country colors), stage idx.
const RENDERERS = {
  cowboyHat: ({ CX, p }) => {
    const top = p.headCY - p.headR
    return (
      <g key="cowboyHat">
        {/* brim */}
        <motion.ellipse animate={{ cx: CX, cy: top + 4, rx: p.headR + 22, ry: 9 }} transition={T} fill="#7c4a1e" />
        <motion.ellipse animate={{ cx: CX, cy: top + 4, rx: p.headR + 22, ry: 9 }} transition={T} fill="#a06b34" opacity={0.5} />
        {/* crown */}
        <motion.path
          animate={{ d: `M ${CX - p.headR * 0.85} ${top + 6} Q ${CX} ${top - p.headR * 0.6} ${CX + p.headR * 0.85} ${top + 6} Z` }}
          transition={T} fill="#7c4a1e"
        />
        {/* dent */}
        <motion.path
          animate={{ d: `M ${CX - p.headR * 0.4} ${top - p.headR * 0.18} Q ${CX} ${top + 2} ${CX + p.headR * 0.4} ${top - p.headR * 0.18}` }}
          transition={T} stroke="#3d220a" strokeWidth={2} fill="none"
        />
        {/* star band */}
        <motion.rect
          animate={{ x: CX - p.headR * 0.85, y: top + 2, width: p.headR * 1.7, height: 5 }}
          transition={T} fill="#3d220a"
        />
      </g>
    )
  },

  topknot: ({ CX, p, palette }) => {
    const top = p.headCY - p.headR
    return (
      <g key="topknot">
        {/* base hair behind head */}
        <motion.ellipse animate={{ cx: CX, cy: top + p.headR * 0.4, rx: p.headR * 0.95, ry: p.headR * 0.5 }} transition={T} fill={palette?.hair || '#0a0a0a'} />
        {/* topknot bun */}
        <motion.ellipse animate={{ cx: CX, cy: top - 4, rx: 14, ry: 10 }} transition={T} fill={palette?.hair || '#0a0a0a'} />
        <motion.rect animate={{ x: CX - 10, y: top - 14, width: 20, height: 6, rx: 3 }} transition={T} fill={palette?.hair || '#0a0a0a'} />
      </g>
    )
  },

  fundoshi: ({ CX, p }) => {
    // White loincloth — a wide white band over the pants
    return (
      <motion.rect
        key="fundoshi"
        animate={{ x: CX - p.bodyRX * 0.55, y: p.bodyCY + p.bodyRY * 0.3, width: p.bodyRX * 1.1, height: 16, rx: 4 }}
        transition={T}
        fill="white"
      />
    )
  },

  sombrero: ({ CX, p }) => {
    const top = p.headCY - p.headR
    return (
      <g key="sombrero">
        <motion.ellipse animate={{ cx: CX, cy: top + 6, rx: p.headR + 38, ry: 12 }} transition={T} fill="#a06b34" />
        <motion.ellipse animate={{ cx: CX, cy: top + 4, rx: p.headR + 38, ry: 11 }} transition={T} fill="#c79754" />
        <motion.ellipse animate={{ cx: CX, cy: top - p.headR * 0.4, rx: p.headR * 0.9, ry: p.headR * 0.55 }} transition={T} fill="#c79754" />
        <motion.ellipse animate={{ cx: CX, cy: top, rx: p.headR * 0.85, ry: 6 }} transition={T} fill="#7c4a1e" />
        {/* decorative pom-poms */}
        {[-1, 1].map((s, i) => (
          <motion.circle key={i}
            animate={{ cx: CX + s * (p.headR + 30), cy: top + 4, r: 5 }}
            transition={T} fill="#dc2626" />
        ))}
      </g>
    )
  },

  mustache: ({ CX, p }) => (
    <motion.path
      key="mustache"
      animate={{ d: `M ${CX - p.mouthRX - 4} ${p.noseY + 8} Q ${CX - p.mouthRX/2} ${p.noseY + 18} ${CX} ${p.noseY + 12} Q ${CX + p.mouthRX/2} ${p.noseY + 18} ${CX + p.mouthRX + 4} ${p.noseY + 8} Q ${CX + p.mouthRX/2} ${p.noseY + 14} ${CX} ${p.noseY + 8} Q ${CX - p.mouthRX/2} ${p.noseY + 14} ${CX - p.mouthRX - 4} ${p.noseY + 8} Z` }}
      transition={T}
      fill="#1a0a00"
    />
  ),

  chefHat: ({ CX, p }) => {
    const top = p.headCY - p.headR
    return (
      <g key="chefHat">
        <motion.rect animate={{ x: CX - p.headR * 0.85, y: top - 4, width: p.headR * 1.7, height: 10, rx: 3 }} transition={T} fill="white" />
        <motion.ellipse animate={{ cx: CX, cy: top - 24, rx: p.headR * 1.05, ry: 22 }} transition={T} fill="white" />
        <motion.ellipse animate={{ cx: CX - p.headR * 0.5, cy: top - 18, rx: p.headR * 0.5, ry: 14 }} transition={T} fill="white" />
        <motion.ellipse animate={{ cx: CX + p.headR * 0.5, cy: top - 18, rx: p.headR * 0.5, ry: 14 }} transition={T} fill="white" />
      </g>
    )
  },

  curlyMustache: ({ CX, p }) => (
    <g key="curlyMustache">
      <motion.path
        animate={{ d: `M ${CX} ${p.noseY + 10} Q ${CX - 16} ${p.noseY + 16} ${CX - 24} ${p.noseY + 8} Q ${CX - 28} ${p.noseY + 4} ${CX - 22} ${p.noseY + 2}` }}
        transition={T} stroke="#1a0a00" strokeWidth={4} fill="none" strokeLinecap="round"
      />
      <motion.path
        animate={{ d: `M ${CX} ${p.noseY + 10} Q ${CX + 16} ${p.noseY + 16} ${CX + 24} ${p.noseY + 8} Q ${CX + 28} ${p.noseY + 4} ${CX + 22} ${p.noseY + 2}` }}
        transition={T} stroke="#1a0a00" strokeWidth={4} fill="none" strokeLinecap="round"
      />
    </g>
  ),

  ushanka: ({ CX, p }) => {
    const top = p.headCY - p.headR
    return (
      <g key="ushanka">
        {/* ear flaps */}
        <motion.ellipse animate={{ cx: CX - p.headR + 2, cy: p.headCY, rx: 14, ry: 18 }} transition={T} fill="#3a2a1a" />
        <motion.ellipse animate={{ cx: CX + p.headR - 2, cy: p.headCY, rx: 14, ry: 18 }} transition={T} fill="#3a2a1a" />
        {/* fur dome */}
        <motion.ellipse animate={{ cx: CX, cy: top + 4, rx: p.headR + 6, ry: p.headR * 0.7 }} transition={T} fill="#5a3a26" />
        <motion.ellipse animate={{ cx: CX, cy: top, rx: p.headR + 4, ry: p.headR * 0.55 }} transition={T} fill="#7c5236" />
        {/* red star */}
        <motion.circle animate={{ cx: CX, cy: top - 6, r: 6 }} transition={T} fill="#dc2626" />
      </g>
    )
  },

  beard: ({ CX, p, palette }) => (
    <motion.path
      key="beard"
      animate={{ d: `M ${CX - p.headR * 0.95} ${p.mouthY - 4} Q ${CX - p.headR * 0.6} ${p.mouthY + p.headR * 0.7} ${CX} ${p.headCY + p.headR + 6} Q ${CX + p.headR * 0.6} ${p.mouthY + p.headR * 0.7} ${CX + p.headR * 0.95} ${p.mouthY - 4} Q ${CX} ${p.mouthY + 4} ${CX - p.headR * 0.95} ${p.mouthY - 4} Z` }}
      transition={T}
      fill={palette?.hair || '#cbd5e1'}
    />
  ),

  beret: ({ CX, p, palette }) => {
    const top = p.headCY - p.headR
    const accent = palette?.beret || '#1a0a00'
    return (
      <g key="beret">
        <motion.ellipse animate={{ cx: CX, cy: top + 2, rx: p.headR + 6, ry: 6 }} transition={T} fill={accent} opacity={0.7} />
        <motion.ellipse animate={{ cx: CX - 6, cy: top - 8, rx: p.headR + 4, ry: p.headR * 0.45 }} transition={T} fill={accent} />
        <motion.circle animate={{ cx: CX + p.headR * 0.5, cy: top - 14, r: 5 }} transition={T} fill={accent} />
      </g>
    )
  },

  pencilMustache: ({ CX, p }) => (
    <motion.rect
      key="pencilMustache"
      animate={{ x: CX - p.mouthRX - 2, y: p.noseY + 9, width: (p.mouthRX + 2) * 2, height: 3, rx: 1 }}
      transition={T} fill="#1a0a00"
    />
  ),

  stripes: () => null,  // visual handled in FatManSVG via palette.stripe

  turban: ({ CX, p, palette }) => {
    const top = p.headCY - p.headR
    const main = palette?.shirt || '#fbbf24'
    return (
      <g key="turban">
        <motion.ellipse animate={{ cx: CX, cy: top + 6, rx: p.headR + 10, ry: p.headR * 0.55 }} transition={T} fill={main} />
        <motion.ellipse animate={{ cx: CX - 6, cy: top - 4, rx: p.headR + 4, ry: p.headR * 0.45 }} transition={T} fill={main} />
        <motion.path animate={{ d: `M ${CX - p.headR - 6} ${top + 4} Q ${CX} ${top - p.headR * 0.4} ${CX + p.headR + 6} ${top + 4}` }} transition={T} stroke="#FFFFFF" strokeWidth={3} fill="none" />
        <motion.path animate={{ d: `M ${CX - p.headR - 4} ${top + 12} Q ${CX} ${top - p.headR * 0.1} ${CX + p.headR + 4} ${top + 12}` }} transition={T} stroke="#dc2626" strokeWidth={3} fill="none" />
        {/* gem */}
        <motion.circle animate={{ cx: CX, cy: top - p.headR * 0.25, r: 6 }} transition={T} fill="#dc2626" />
        <motion.circle animate={{ cx: CX, cy: top - p.headR * 0.25, r: 3 }} transition={T} fill="#fff" opacity={0.7} />
      </g>
    )
  },

  feathers: ({ CX, p }) => {
    const top = p.headCY - p.headR
    const colors = ['#22c55e', '#facc15', '#3b82f6', '#ec4899', '#f97316']
    return (
      <g key="feathers">
        <motion.rect animate={{ x: CX - p.headR * 0.9, y: top - 2, width: p.headR * 1.8, height: 8, rx: 3 }} transition={T} fill="#facc15" />
        {colors.map((c, i) => {
          const offset = (i - (colors.length - 1) / 2) * 14
          return (
            <motion.ellipse key={i}
              animate={{ cx: CX + offset, cy: top - 22, rx: 5, ry: 22 }}
              transition={T} fill={c} />
          )
        })}
      </g>
    )
  },

  bavarianHat: ({ CX, p }) => {
    const top = p.headCY - p.headR
    return (
      <g key="bavarianHat">
        <motion.ellipse animate={{ cx: CX, cy: top + 4, rx: p.headR + 14, ry: 8 }} transition={T} fill="#365314" />
        <motion.path
          animate={{ d: `M ${CX - p.headR * 0.85} ${top + 4} Q ${CX} ${top - p.headR * 0.6} ${CX + p.headR * 0.85} ${top + 4} Z` }}
          transition={T} fill="#365314"
        />
        <motion.rect animate={{ x: CX - p.headR * 0.85, y: top + 0, width: p.headR * 1.7, height: 5 }} transition={T} fill="#facc15" />
        {/* feather */}
        <motion.path
          animate={{ d: `M ${CX + p.headR * 0.5} ${top + 2} Q ${CX + p.headR * 0.7} ${top - p.headR} ${CX + p.headR * 1.0} ${top - p.headR * 1.1}` }}
          transition={T} stroke="#dc2626" strokeWidth={4} strokeLinecap="round" fill="none"
        />
      </g>
    )
  },

  lederhosen: ({ CX, p }) => (
    <g key="lederhosen">
      {/* H suspenders */}
      <motion.rect
        animate={{ x: CX - p.bodyRX * 0.55, y: p.bodyCY - p.bodyRY * 0.7, width: 8, height: p.bodyRY * 1.3, rx: 2 }}
        transition={T} fill="#7c2d12"
      />
      <motion.rect
        animate={{ x: CX + p.bodyRX * 0.55 - 8, y: p.bodyCY - p.bodyRY * 0.7, width: 8, height: p.bodyRY * 1.3, rx: 2 }}
        transition={T} fill="#7c2d12"
      />
      <motion.rect
        animate={{ x: CX - p.bodyRX * 0.5, y: p.bodyCY - p.bodyRY * 0.1, width: p.bodyRX, height: 6, rx: 2 }}
        transition={T} fill="#7c2d12"
      />
    </g>
  ),

  roundHat: ({ CX, p }) => {
    const top = p.headCY - p.headR
    return (
      <g key="roundHat">
        <motion.ellipse animate={{ cx: CX, cy: top + 2, rx: p.headR + 8, ry: 6 }} transition={T} fill="#0a0a0a" />
        <motion.ellipse animate={{ cx: CX, cy: top - 14, rx: p.headR * 0.7, ry: p.headR * 0.4 }} transition={T} fill="#0a0a0a" />
        <motion.circle animate={{ cx: CX, cy: top - p.headR * 0.55, r: 5 }} transition={T} fill="#dc2626" />
      </g>
    )
  },

  longBeard: ({ CX, p }) => (
    <motion.path
      key="longBeard"
      animate={{ d: `M ${CX - 8} ${p.mouthY + p.mouthRY + 4} L ${CX} ${p.mouthY + p.mouthRY + 50} L ${CX + 8} ${p.mouthY + p.mouthRY + 4} Z` }}
      transition={T}
      fill="#0a0a0a"
    />
  ),
}

export default function Accessories({ accessories = [], stage, CX, p, palette }) {
  return (
    <>
      {accessories.map((key) => {
        const r = RENDERERS[key]
        if (!r) return null
        return r({ CX, p, palette, stage })
      })}
    </>
  )
}
