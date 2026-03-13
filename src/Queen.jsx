import DestinationCard from './DestinationCard.jsx'
import { PLAYERS } from './players.js'

function Queen() {
  const searchParams = new URLSearchParams(window.location.search)
  const playerName = searchParams.get('name')
  const winner = PLAYERS[playerName] ?? PLAYERS.marcQueen

  const playAgain = () => {
    window.history.pushState({}, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <DestinationCard
      image={winner.image}
      message={`${winner.name} wins.`}
      body="Beer first, then drag queen energy. Take the crown, get a drink, and keep the night moving."
      actionLabel="Play again"
      onAction={playAgain}
    />
  )
}

export default Queen
