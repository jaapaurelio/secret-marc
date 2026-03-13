import marcImage from './assets/marc.png'
import marcQueenImage from './assets/marc-queen.png'
import nicoImage from './assets/nico.png'
import nicoQueenImage from './assets/nico-queen.png'

export const PLAYER_ORDER = ['marc', 'nico', 'marcQueen', 'nicoQueen']

export const PLAYERS = {
  marc: {
    image: marcImage,
    name: 'Marc-Man',
    released: true,
    unlockRoute: '/contdown',
  },
  nico: {
    image: nicoImage,
    name: 'Nico-Man',
    released: false,
    unlockRoute: '/beer',
  },
  marcQueen: {
    image: marcQueenImage,
    name: 'Marc-Queen',
    released: false,
    unlockRoute: '/queen?name=marcQueen',
  },
  nicoQueen: {
    image: nicoQueenImage,
    name: 'Nico-Queen',
    released: false,
    unlockRoute: '/queen?name=nicoQueen',
  },
}

export function getAvailablePlayerChoices() {
  return PLAYER_ORDER.filter((playerKey) => PLAYERS[playerKey].released)
}
