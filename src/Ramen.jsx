import DestinationCard from './DestinationCard.jsx'
import ramenImage from './assets/ramen.png'

function Ramen() {
  const playAgain = () => {
    window.history.pushState({}, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <DestinationCard
      image={ramenImage}
      message="Visit this next."
      body="Ramen-Man's win means it's time to visit Bosso Ramen Tavern for a bowl."
      actionLabel="Play again"
      onAction={playAgain}
    />
  )
}

export default Ramen
