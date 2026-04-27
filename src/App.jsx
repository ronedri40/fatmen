import { useCallback, useEffect, useState } from 'react'
import { useGameEngine } from './hooks/useGameEngine'
import { useAudio } from './hooks/useAudio'
import { useHaptic } from './hooks/useHaptic'
import { useSpeech } from './hooks/useSpeech'
import { useLeaderboard } from './hooks/useLeaderboard'
import StartScreen from './components/screens/StartScreen'
import GameScreen from './components/screens/GameScreen'
import LeaderboardScreen from './components/screens/LeaderboardScreen'
import { readChallengeFromUrl, clearChallengeFromUrl } from './utils/challengeLink'
import { LEVELS } from './constants/levels'

export default function App() {
  const game = useGameEngine()
  const audio = useAudio(game.soundOn)
  const haptic = useHaptic(game.hapticOn)
  const speech = useSpeech(game.soundOn)
  const leaderboard = useLeaderboard()

  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const [challenge, setChallenge] = useState(() => {
    const c = readChallengeFromUrl()
    if (!c) return null
    const lv = LEVELS.find(l => l.id === c.levelId)
    return { ...c, country: lv?.country, flag: lv?.flag }
  })
  useEffect(() => { if (challenge) clearChallengeFromUrl() }, [challenge])

  // Auto-save to leaderboard when going home, if score qualifies
  const handleGoHome = useCallback(() => {
    if (game.score > 0 && leaderboard.qualifies(game.score)) {
      leaderboard.addEntry(game.score, game.level)
    }
    game.goHome()
  }, [game, leaderboard])

  if (showLeaderboard) {
    return (
      <LeaderboardScreen
        entries={leaderboard.entries}
        playerName={leaderboard.playerName}
        onSetPlayerName={leaderboard.setPlayerName}
        onBack={() => setShowLeaderboard(false)}
      />
    )
  }

  if (game.gameState === game.GAME_STATES.IDLE) {
    return (
      <StartScreen
        onStart={() => { audio.ui(); game.start() }}
        onContinue={() => { audio.ui(); game.continueSaved() }}
        onLeaderboard={() => setShowLeaderboard(true)}
        hasSavedGame={game.hasSavedGame}
        highScore={game.highScore}
        bestLevel={game.bestLevel}
        dailyBest={game.dailyBest}
        challenge={challenge}
      />
    )
  }

  const gameWithInterceptedHome = { ...game, goHome: handleGoHome }

  return <GameScreen game={gameWithInterceptedHome} audio={audio} haptic={haptic} speech={speech} />
}
