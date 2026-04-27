import { useGameEngine } from './hooks/useGameEngine'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import LevelUpScreen from './components/LevelUpScreen'

export default function App() {
  const game = useGameEngine()

  if (game.gameState === game.GAME_STATES.IDLE) {
    return <StartScreen onStart={game.start} />
  }

  if (game.gameState === game.GAME_STATES.LEVEL_UP) {
    return <LevelUpScreen level={game.level} score={game.score} onNext={game.nextLevel} onRestart={game.restart} />
  }

  return <GameScreen game={game} />
}
