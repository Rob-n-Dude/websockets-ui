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
