// Tuned for satisfying mobile pacing — not the literal 10k clicks of the design doc.
// First boom should hit within ~15s of pressing TAP TO START so the WOW moment
// happens before the user can lose interest. Per-stage scaling below makes the
// first weight-gain in ~3s and the final boom feel earned.
export const CLICKS_PER_STAGE = 18
export const LEVEL_MULTIPLIER = 1.35

// Per-stage multipliers applied to CLICKS_PER_STAGE × LEVEL_MULTIPLIER^(level-1).
// Stage 0 (slim → chubby) is fast for early gratification; stage 4 (very fat → BOOM)
// is the longest to create tension before payoff.
export const STAGE_PACING = [0.55, 0.8, 1.0, 1.2, 1.45]

export const FAT_STAGES = [
  { label: 'Slim',      scale: 1.0,  color: '#4ade80', accent: '#22c55e' },
  { label: 'Chubby',    scale: 1.18, color: '#facc15', accent: '#eab308' },
  { label: 'Fat',       scale: 1.4,  color: '#fb923c', accent: '#f97316' },
  { label: 'Very Fat',  scale: 1.65, color: '#f87171', accent: '#ef4444' },
  { label: 'OBESE',     scale: 1.95, color: '#c084fc', accent: '#a855f7' },
]

export const TOTAL_STAGES = FAT_STAGES.length

// Scoring
export const POINTS_PER_TAP = 10
export const STAGE_BONUS = 500
export const LEVEL_BONUS = 2000
export const DECAY_PER_SECOND = 12
export const DECAY_GRACE_MS = 2500

// Combo
export const COMBO_WINDOW_MS = 600           // taps within this gap chain the combo
export const COMBO_MAX = 50
export const COMBO_BONUS_THRESHOLD = 5       // combo >= this gives bonus multiplier
export const COMBO_MULTIPLIER_MAX = 3        // peak combo gives ×3
