import { motion } from 'framer-motion'

export const SPEECH_TEXTS = [
  'YUM! 😋', 'MORE! 🍔', 'SO TASTY! 😍', 'FEED ME! 🍕',
  "CAN'T STOP! 😤", 'DELICIOUS! 🤤', 'BURP! 🤭', 'NOM NOM! 👄',
  'SO GOOD! 🤪', 'GIMME! 😜', 'WANT MORE! 🙏', 'HUNGRY! 🤩',
  'YES PLEASE! 🙌', 'AMAZING! 🤯', 'BEST DAY EVER! 🥳',
]

export function randomSpeechText(food) {
  const extra = [`${food}${food}${food}!`, `MORE ${food}!`, `${food} IS LIFE!`]
  const all = [...SPEECH_TEXTS, ...extra]
  return all[Math.floor(Math.random() * all.length)]
}

export default function SpeechBubble({ x, y, text, onDone }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-50 select-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.5, x: '-50%', y: '-100%' }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.15, 1.05, 0.9],
        y: ['-100%', '-130%', '-155%', '-185%'],
      }}
      transition={{ duration: 1.4, times: [0, 0.15, 0.65, 1] }}
      onAnimationComplete={onDone}
    >
      <div
        className="relative px-3 py-2 rounded-2xl rounded-bl-sm shadow-2xl"
        style={{ background: 'white', border: '2px solid #f3f4f6' }}
      >
        <span className="text-gray-900 font-black text-sm whitespace-nowrap tracking-tight">
          {text}
        </span>
        {/* Tail */}
        <div
          className="absolute -bottom-2 left-3"
          style={{
            width: 0, height: 0,
            borderLeft: '8px solid white',
            borderRight: '8px solid transparent',
            borderTop: '8px solid white',
          }}
        />
      </div>
    </motion.div>
  )
}
