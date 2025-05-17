import {Board} from './Board'

export interface Game {
  id: string
  users: string[]
  boards: Record<string, Board>
  ships: Record<string, Ship[]>
  currentPlayer: string
}

export type ShipType = 'huge' | 'large' | 'medium' | 'small'

export interface Ship {
  position: {
    x: number
    y: number
  }
  direction: boolean
  type: ShipType
  length: number
}
