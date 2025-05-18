import {Board} from './Board'
import {Ship} from './Ship'

export interface Game {
  id: string
  users: string[]
  boards: Record<string, Board>
  ships: Record<string, Ship[]>
  currentPlayer: string
}

export enum AttackResult {
  HIT = 'hit',
  MISS = 'miss',
  KILL = 'kill',
}

export enum AttackResponseStatus {
  MISS = 'miss',
  KILLED = 'killed',
  SHOT = 'shot',
}

export const getShipByCoordinates = (
  ships: Ship[],
  position: {x: number; y: number}
): Ship | undefined => {
  return ships.find((ship) => {
    const {x, y} = ship.position
    const {length, direction} = ship

    if (direction) {
      return x === position.x && y <= position.y && position.y < y + length
    }

    return y === position.y && x <= position.x && position.x < x + length
  })
}
