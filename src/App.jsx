import { useEffect, useState } from 'react'
import Countdown from './Countdown.jsx'

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

  const handleMove = (move) => {
    setEnemy((currentEnemy) => getRandomEnemyMove(currentEnemy))

    setPlayer((current) => {
      const next = { x: current.x + move.x, y: current.y + move.y }

      if (isWall(next)) {
        return current
      }

      setPellets((currentPellets) => {
        if (!currentPellets[next.y][next.x]) {
          return currentPellets
        }

        const updated = currentPellets.map((row) => [...row])
        updated[next.y][next.x] = false
        setScore((currentScore) => currentScore + 1)
        return updated
      })

      return next
    })
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
  }, [])

  const pelletsLeft = pellets.flat().filter(Boolean).length

  const navigateTo = (nextRoute) => {
    window.history.pushState({}, '', nextRoute)
    setRoute(nextRoute)
  }

  const resetGame = () => {
    setPlayer(START)
    setEnemy(ENEMY_START)
    setPellets(createPellets())
    setScore(0)
  }

  if (route === '/contdown') {
    return <Countdown />
  }

  return (
    <main className="game">
      {pelletsLeft === 0 && (
        <button
          type="button"
          className="unlock-button"
          onClick={() => navigateTo('/contdown')}
        >
          Unlock
        </button>
      )}

      <div className="game-shell">
        <div className="panel">
          <h1>Marc-Man</h1>
          <p>Use arrow keys or WASD.</p>
          <div className="stats">
            <span>Score: {score}</span>
            <span>{pelletsLeft === 0 ? 'You win' : `Dots left: ${pelletsLeft}`}</span>
          </div>
          <button type="button" onClick={resetGame}>
            Reset
          </button>
        </div>

        <section className="board" aria-label="Pac-Man board">
          {MAZE.map((row, y) =>
            row.split('').map((cell, x) => {
              const isPlayer = player.x === x && player.y === y
              const isEnemy = enemy.x === x && enemy.y === y
              const hasPellet = pellets[y][x]
              const className =
                cell === '#'
                  ? 'tile wall'
                  : isEnemy
                    ? 'tile enemy'
                    : isPlayer
                      ? 'tile player'
                      : hasPellet
                        ? 'tile pellet'
                        : 'tile path'

              return <div key={`${x}-${y}`} className={className} />
            }),
          )}
        </section>
      </div>

      <div className="mobile-controls" aria-label="On-screen controls">
        <button type="button" className="control-up" onClick={() => handleMove({ x: 0, y: -1 })}>
          ↑
        </button>
        <button type="button" className="control-left" onClick={() => handleMove({ x: -1, y: 0 })}>
          ←
        </button>
        <button type="button" className="control-right" onClick={() => handleMove({ x: 1, y: 0 })}>
          →
        </button>
        <button type="button" className="control-down" onClick={() => handleMove({ x: 0, y: 1 })}>
          ↓
        </button>
      </div>
    </main>
  )
}

export default App
