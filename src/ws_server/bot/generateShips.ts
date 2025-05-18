import {BoardCell, getEmptyBoard} from '../models/Board'
import {MAP_SHIP_SIZE_TO_TYPE, Ship, ShipSize} from '../models/Ship'

const createShip = ({
  position,
  length,
  direction,
}: Omit<Ship, 'type'>): Ship => ({
  position,
  length,
  direction,
  type: MAP_SHIP_SIZE_TO_TYPE[length as ShipSize],
})

const BOARD_SIZE = 10
const SHIPS_CONFIG = [
  {length: ShipSize.HUGE, count: 1},
  {length: ShipSize.LARGE, count: 2},
  {length: ShipSize.MEDIUM, count: 3},
  {length: ShipSize.SMALL, count: 4},
]

export const generateShips = (): Ship[] => {
  const ships: Ship[] = []

  const board = getEmptyBoard(BOARD_SIZE)

  const isCellOccupied = (checkX: number, checkY: number): boolean =>
    checkX >= 0 &&
    checkX < BOARD_SIZE &&
    checkY >= 0 &&
    checkY < BOARD_SIZE &&
    board[checkY]![checkX] === BoardCell.SHIP

  const isAreaClear = (
    x: number,
    y: number,
    length: number,
    direction: boolean
  ): boolean => {
    for (let i = -1; i <= length; i++) {
      for (let j = -1; j <= 1; j++) {
        const checkX = !direction ? x + i : x + j
        const checkY = !direction ? y + j : y + i

        if (isCellOccupied(checkX, checkY)) {
          return false
        }
      }
    }

    return true
  }

  const isValidPosition = (
    x: number,
    y: number,
    length: number,
    direction: boolean
  ): boolean => {
    if (
      (!direction && x + length > BOARD_SIZE) ||
      (direction && y + length > BOARD_SIZE)
    ) {
      return false
    }

    return isAreaClear(x, y, length, direction)
  }

  const placeShip = (
    x: number,
    y: number,
    length: number,
    direction: boolean
  ): void => {
    for (let i = 0; i < length; i++) {
      const placeX = !direction ? x + i : x
      const placeY = !direction ? y : y + i

      board[placeY]![placeX] = BoardCell.SHIP
    }
  }

  const sizes = SHIPS_CONFIG.flatMap((ship) => [
    ...Array.from({length: ship.count}, () => ship.length),
  ])

  for (const size of sizes) {
    let placed = false

    while (!placed) {
      const x = Math.floor(Math.random() * BOARD_SIZE)
      const y = Math.floor(Math.random() * BOARD_SIZE)
      const direction = Math.random() > 0.5

      if (isValidPosition(x, y, size, direction)) {
        placeShip(x, y, size, direction)
        ships.push(
          createShip({
            position: {x, y},
            length: size,
            direction,
          })
        )
        placed = true
      }
    }
  }

  return ships
}
