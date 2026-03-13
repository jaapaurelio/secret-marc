import { useEffect, useState } from 'react'
import Beer from './Beer.jsx'
import Countdown from './Countdown.jsx'
import Queen from './Queen.jsx'
import { getAvailablePlayerChoices, PLAYERS } from './players.js'

const MAZE = [
  '#########',
  '#.......#',
  '#.###.#.#',
  '#.#...#.#',
  '#.#.#.#.#',
  '#...#...#',
  '#########',
]

const START = { x: 1, y: 1 }
const ENEMY_START = { x: 7, y: 5 }
const DIRECTIONS = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
]
const AVAILABLE_PLAYER_CHOICES = getAvailablePlayerChoices()

function createPellets() {
  const pellets = MAZE.map((row) =>
    row.split('').map((cell) => cell === '.'),
  )

  pellets[START.y][START.x] = false
  return pellets
}

function isWall(position) {
  return MAZE[position.y]?.[position.x] === '#'
}

function isSamePosition(first, second) {
  return first.x === second.x && first.y === second.y
}

function getTiltAngle(move) {
  if (move.x === -1) {
    return '-9deg'
  }

  if (move.x === 1) {
    return '9deg'
  }

  return '0deg'
}

function getRandomEnemyMove(enemy) {
  const validMoves = DIRECTIONS
    .map((direction) => ({
      x: enemy.x + direction.x,
      y: enemy.y + direction.y,
    }))
    .filter((position) => !isWall(position))

  if (validMoves.length === 0) {
    return enemy
  }

  return validMoves[Math.floor(Math.random() * validMoves.length)]
}

function App() {
  const [route, setRoute] = useState(window.location.pathname)
  const [player, setPlayer] = useState(START)
  const [enemy, setEnemy] = useState(ENEMY_START)
  const [pellets, setPellets] = useState(createPellets)
  const [score, setScore] = useState(0)
  const [isCaught, setIsCaught] = useState(false)
  const [playerStep, setPlayerStep] = useState(0)
  const [playerTilt, setPlayerTilt] = useState('0deg')
  const [playerChoice, setPlayerChoice] = useState(AVAILABLE_PLAYER_CHOICES[0] ?? 'marc')

  const resetGame = () => {
    setPlayer(START)
    setEnemy(ENEMY_START)
    setPellets(createPellets())
    setScore(0)
    setIsCaught(false)
    setPlayerStep(0)
    setPlayerTilt('0deg')
  }

  const handleMove = (move) => {
    if (isCaught) {
      return
    }

    const nextPlayer = { x: player.x + move.x, y: player.y + move.y }
    const resolvedPlayer = isWall(nextPlayer) ? player : nextPlayer
    const nextEnemy = getRandomEnemyMove(enemy)
    const collided =
      isSamePosition(resolvedPlayer, nextEnemy) ||
      (isSamePosition(resolvedPlayer, enemy) && isSamePosition(nextEnemy, player))

    if (collided) {
      setPlayer(resolvedPlayer)
      setEnemy(resolvedPlayer)
      setIsCaught(true)
      return
    }

    setEnemy(nextEnemy)
    setPlayer(resolvedPlayer)

    if (isSamePosition(resolvedPlayer, player) || !pellets[resolvedPlayer.y][resolvedPlayer.x]) {
      if (!isSamePosition(resolvedPlayer, player)) {
        setPlayerTilt(getTiltAngle(move))
        setPlayerStep((currentStep) => currentStep + 1)
      }
      return
    }

    const updatedPellets = pellets.map((row) => [...row])
    updatedPellets[resolvedPlayer.y][resolvedPlayer.x] = false
    setPellets(updatedPellets)
    setPlayerTilt(getTiltAngle(move))
    setPlayerStep((currentStep) => currentStep + 1)
    setScore((currentScore) => currentScore + 1)
  }

  useEffect(() => {
    const onPopState = () => {
      setRoute(window.location.pathname)
    }

    const onKeyDown = (event) => {
      const move =
        event.key === 'ArrowUp' || event.key === 'w'
          ? { x: 0, y: -1 }
          : event.key === 'ArrowDown' || event.key === 's'
            ? { x: 0, y: 1 }
            : event.key === 'ArrowLeft' || event.key === 'a'
              ? { x: -1, y: 0 }
              : event.key === 'ArrowRight' || event.key === 'd'
                ? { x: 1, y: 0 }
                : null

      if (!move) {
        return
      }

      event.preventDefault()
      handleMove(move)
    }

    window.addEventListener('popstate', onPopState)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [handleMove])

  useEffect(() => {
    if (!AVAILABLE_PLAYER_CHOICES.includes(playerChoice) && AVAILABLE_PLAYER_CHOICES.length > 0) {
      setPlayerChoice(AVAILABLE_PLAYER_CHOICES[0])
    }
  }, [playerChoice])

  const pelletsLeft = pellets.flat().filter(Boolean).length
  const activePlayer = PLAYERS[playerChoice]
  const canRotatePlayers = AVAILABLE_PLAYER_CHOICES.length > 1
  const nextPlayerChoice = canRotatePlayers
    ? AVAILABLE_PLAYER_CHOICES[
        (AVAILABLE_PLAYER_CHOICES.indexOf(playerChoice) + 1) % AVAILABLE_PLAYER_CHOICES.length
      ]
    : null
  const nextPlayer = nextPlayerChoice ? PLAYERS[nextPlayerChoice] : null

  const navigateTo = (nextRoute) => {
    window.history.pushState({}, '', nextRoute)
    setRoute(window.location.pathname)
  }

  const unlockRoute = activePlayer.unlockRoute

  const togglePlayerChoice = () => {
    if (!canRotatePlayers) {
      return
    }

    setPlayerChoice((currentChoice) => {
      const currentIndex = AVAILABLE_PLAYER_CHOICES.indexOf(currentChoice)
      return AVAILABLE_PLAYER_CHOICES[(currentIndex + 1) % AVAILABLE_PLAYER_CHOICES.length]
    })
  }

  if (route === '/contdown') {
    return <Countdown />
  }

  if (route === '/beer') {
    return <Beer />
  }

  if (route === '/queen') {
    return <Queen />
  }

  return (
    <main className="game">
      {pelletsLeft === 0 && (
        <button
          type="button"
          className="unlock-button"
          onClick={() => navigateTo(unlockRoute)}
        >
          Unlock
        </button>
      )}

      <div className="game-shell">
        <div className="panel">
          <h1>{activePlayer.name}</h1>
          <p>Use arrow keys or WASD.</p>
          <div className="stats">
            <span>Score: {score}</span>
            <span>
              {isCaught
                ? 'Caught'
                : pelletsLeft === 0
                  ? 'You win'
                  : `Dots left: ${pelletsLeft}`}
            </span>
          </div>
          <div className="panel-actions">
            <button type="button" onClick={resetGame}>
              Reset
            </button>
            {canRotatePlayers ? (
              <button type="button" onClick={togglePlayerChoice}>
                {`Change to ${nextPlayer.name}`}
              </button>
            ) : null}
          </div>
        </div>

        <section className="board" aria-label="Pac-Man board">
          {isCaught ? (
            <div className="caught-overlay">
              <p className="caught-message">Caught by red.</p>
              <button type="button" className="caught-reset" onClick={resetGame}>
                Reset
              </button>
            </div>
          ) : null}
          {MAZE.map((row, y) =>
            row.split('').map((cell, x) => {
              const isPlayer = player.x === x && player.y === y
              const isEnemy = enemy.x === x && enemy.y === y
              const isCaughtTile = isCaught && isPlayer && isEnemy
              const hasPellet = pellets[y][x]
              const className =
                cell === '#'
                  ? 'tile wall'
                  : isCaughtTile
                    ? 'tile caught'
                  : isEnemy
                    ? 'tile enemy'
                    : isPlayer
                      ? `tile player player-moving-${playerStep % 2}`
                      : hasPellet
                        ? 'tile pellet'
                        : 'tile path'

              const style =
                isPlayer || isCaughtTile
                  ? {
                      '--player-image': `url(${activePlayer.image})`,
                      '--tilt-angle': isCaughtTile ? '0deg' : playerTilt,
                    }
                  : undefined

              return <div key={`${x}-${y}`} className={className} style={style} />
            }),
          )}
        </section>
      </div>

      <div className="mobile-controls" aria-label="On-screen controls">
        <button
          type="button"
          className="control-up"
          disabled={isCaught}
          onClick={() => handleMove({ x: 0, y: -1 })}
        >
          ↑
        </button>
        <button
          type="button"
          className="control-left"
          disabled={isCaught}
          onClick={() => handleMove({ x: -1, y: 0 })}
        >
          ←
        </button>
        <button
          type="button"
          className="control-right"
          disabled={isCaught}
          onClick={() => handleMove({ x: 1, y: 0 })}
        >
          →
        </button>
        <button
          type="button"
          className="control-down"
          disabled={isCaught}
          onClick={() => handleMove({ x: 0, y: 1 })}
        >
          ↓
        </button>
      </div>
    </main>
  )
}

export default App
