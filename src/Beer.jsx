import DestinationCard from './DestinationCard.jsx'
import nicoImage from './assets/nico.png'

function Beer() {
  const playAgain = () => {
    window.history.pushState({}, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <DestinationCard
      image={nicoImage}
      message="Go here next."
      body="Head to Lamplighter Brewing Co. in Cambridge. Nico-Man's win earns a beer stop there."
      actionLabel="Play again"
      onAction={playAgain}
    />
  )
}

export default Beer
