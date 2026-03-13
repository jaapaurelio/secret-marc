import DestinationCard from './DestinationCard.jsx'
import nicoImage from './assets/nico.png'

function Beer() {
  return (
    <DestinationCard
      image={nicoImage}
      message="Go here next."
      body="Head to Lamplighter Brewing Co. in Cambridge. Nico-Man's win earns a beer stop there."
    />
  )
}

export default Beer
