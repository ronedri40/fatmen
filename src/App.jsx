import { useGameEngine } from './hooks/useGameEngine'
import { useAudio } from './hooks/useAudio'
import { useHaptic } from './hooks/useHaptic'
import StartScreen from './components/screens/StartScreen'
import GameScreen from './components/screens/GameScreen'
import LevelUpScreen from './components/screens/LevelUpScreen'

export default function App() {
  const game = useGameEngine()
  const audio = useAudio(game.soundOn)
  const haptic = useHaptic(game.hapticOn)

  if (game.gameState === game.GAME_STATES.IDLE) {
    return <StartScreen onStart={() => { audio.ui(); game.start() }} highScore={game.highScore} bestLevel={game.bestLevel} />
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
        onNext={() => { audio.levelUp(); game.nextLevel() }}
        onRestart={() => { audio.ui(); game.restart() }}
        onSound={audio.ui}
      />
    )
  }

  return <GameScreen game={game} audio={audio} haptic={haptic} />
}
