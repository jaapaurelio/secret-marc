import { useEffect, useState } from 'react'

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

function createPellets() {
  return MAZE.map((row) =>
    row.split('').map((cell) => cell === '.'),
  )
}

function App() {
  const [player, setPlayer] = useState(START)
  const [pellets, setPellets] = useState(createPellets)
  const [score, setScore] = useState(0)

  useEffect(() => {
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

      setPlayer((current) => {
        const next = { x: current.x + move.x, y: current.y + move.y }

        if (MAZE[next.y]?.[next.x] === '#') {
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

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const pelletsLeft = pellets.flat().filter(Boolean).length

  const resetGame = () => {
    setPlayer(START)
    setPellets(createPellets())
    setScore(0)
  }

  return (
    <main className="game">
      <div className="panel">
        <h1>Pac-Man</h1>
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
            const hasPellet = pellets[y][x]
            const className =
              cell === '#'
                ? 'tile wall'
                : isPlayer
                  ? 'tile player'
                  : hasPellet
                    ? 'tile pellet'
                    : 'tile path'

            return <div key={`${x}-${y}`} className={className} />
          }),
        )}
      </section>
    </main>
  )
}

export default App
