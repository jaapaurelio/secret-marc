import DestinationCard from './DestinationCard.jsx'
import pacmanImage from './assets/pacman.png'

function Arcade() {
  const playAgain = () => {
    window.history.pushState({}, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <DestinationCard
      image={pacmanImage}
      message="Next stop: Roxy's Arcade."
      body="Pac-Man cleared the maze, so celebrate with flashing cabinets and another round at Roxy's Arcade."
      actionLabel="Play again"
      onAction={playAgain}
    />
  )
}

export default Arcade
