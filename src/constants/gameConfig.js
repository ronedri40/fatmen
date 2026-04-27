export const CLICKS_PER_STAGE = 10000

export const FAT_STAGES = [
  { label: 'Slim',        scale: 1.0,  color: '#4ade80', bmi: 22 },
  { label: 'Chubby',     scale: 1.25, color: '#facc15', bmi: 28 },
  { label: 'Fat',        scale: 1.55, color: '#fb923c', bmi: 35 },
  { label: 'Very Fat',   scale: 1.85, color: '#f87171', bmi: 45 },
  { label: 'OBESE',      scale: 2.2,  color: '#c084fc', bmi: 60 },
]

// After last stage → BOOM → next level
export const TOTAL_STAGES = FAT_STAGES.length

// Score decays this many points per second when idle
export const DECAY_PER_SECOND = 8

// Each level multiplies required clicks per stage
export const LEVEL_MULTIPLIER = 1.5
