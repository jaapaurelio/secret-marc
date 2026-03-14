import marcImage from './assets/marc.png'
import marcQueenImage from './assets/marc-queen.png'
import nicoImage from './assets/nico.png'
import nicoQueenImage from './assets/nico-queen.png'
import pacmanImage from './assets/pacman.png'
import ramenImage from './assets/ramen.png'

export const PLAYER_ORDER = ['marc', 'nico', 'marcQueen', 'nicoQueen', 'ramen', 'pacman']

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
    released: true,
    unlockRoute: '/beer',
  },
  marcQueen: {
    image: marcQueenImage,
    name: 'Marc-Queen',
    released: true,
    unlockRoute: '/queen?name=marcQueen',
  },
  nicoQueen: {
    image: nicoQueenImage,
    name: 'Nico-Queen',
    released: true,
    unlockRoute: '/queen?name=nicoQueen',
  },
  ramen: {
    image: ramenImage,
    name: 'Ramen-Man',
    released: true,
    unlockRoute: '/ramen',
  },
  pacman: {
    image: pacmanImage,
    name: 'Pac-Man',
    released: false,
    unlockRoute: '/arcade',
  },
}

export function getAvailablePlayerChoices() {
  return PLAYER_ORDER.filter((playerKey) => PLAYERS[playerKey].released)
}
