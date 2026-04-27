import { useEffect, useState } from 'react'
import { useGameEngine } from './hooks/useGameEngine'
import { useAudio } from './hooks/useAudio'
import { useHaptic } from './hooks/useHaptic'
import { useSpeech } from './hooks/useSpeech'
import StartScreen from './components/screens/StartScreen'
import GameScreen from './components/screens/GameScreen'
import LevelUpScreen from './components/screens/LevelUpScreen'
import { readChallengeFromUrl, clearChallengeFromUrl } from './utils/challengeLink'
import { LEVELS } from './constants/levels'

export default function App() {
  const game = useGameEngine()
  const audio = useAudio(game.soundOn)
  const haptic = useHaptic(game.hapticOn)
  const speech = useSpeech(game.soundOn)

  // Pick up an inbound challenge link (from a friend's share) on first load.
  const [challenge, setChallenge] = useState(() => {
    const c = readChallengeFromUrl()
    if (!c) return null
    const lv = LEVELS.find(l => l.id === c.levelId)
    return { ...c, country: lv?.country, flag: lv?.flag }
  })
  useEffect(() => { if (challenge) clearChallengeFromUrl() }, [challenge])

  if (game.gameState === game.GAME_STATES.IDLE) {
    return (
      <StartScreen
        onStart={() => { audio.ui(); game.start() }}
        highScore={game.highScore}
        bestLevel={game.bestLevel}
        dailyBest={game.dailyBest}
        challenge={challenge}
      />
    )
  }

  if (game.gameState === game.GAME_STATES.LEVEL_UP) {
    return (
      <LevelUpScreen
        level={game.level}
        score={game.score}
        highScore={game.highScore}
        comboPeak={game.comboPeak}
        totalClicks={game.totalClicks}
        levelDurationMs={game.levelDurationMs}
        dailyOffset={game.dailyOffset}
        onNext={() => { audio.levelUp(); game.nextLevel() }}
        onRestart={() => { audio.ui(); game.restart() }}
        onSound={audio.ui}
      />
    )
  }

  return <GameScreen game={game} audio={audio} haptic={haptic} speech={speech} />
}
