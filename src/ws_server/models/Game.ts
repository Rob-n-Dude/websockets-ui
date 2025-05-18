import {Board} from './Board'

export interface Game {
  id: string
  users: string[]
  boards: Record<string, Board>
  ships: Record<string, Ship[]>
  currentPlayer: string
}

export type ShipType = 'huge' | 'large' | 'medium' | 'small'

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
export interface Ship {
  position: {
    x: number
    y: number
  }
  direction: boolean
  type: ShipType
  length: number
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
