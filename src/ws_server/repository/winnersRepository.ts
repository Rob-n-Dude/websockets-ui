import {Winner} from '../models/Winner'
import {Repository} from './repository'

type WinnerRepositoryStorage = Record<string, Winner>

export type WinnerRepositoryType = Omit<Repository<Winner>, 'delete'>

class WinnerRepository implements WinnerRepositoryType {
  private winners: WinnerRepositoryStorage = {}

  create(data: Winner) {
    return new Promise<Winner>((resolve) => {
      this.winners[data.id] = data
      resolve(data)
    })
  }

  update(id: string, data: Partial<Winner>): Promise<Winner | null> {
    return new Promise<Winner | null>((resolve) => {
      if (!this.winners[id]) {
        resolve(null)
        return
      }

      const winnerData = this.winners[id]
      const updatedWinnerData = {...winnerData, ...data}
      this.winners[id] = updatedWinnerData
      resolve(updatedWinnerData)
    })
  }

  read(id: string): Promise<Winner | null> {
    return new Promise<Winner | null>((resolve) => {
      if (!this.winners[id]) {
        resolve(null)
        return
      }

      resolve(this.winners[id])
    })
  }

  getAll(): Promise<Winner[]> {
    return new Promise((resolve) => {
      const winners = Object.values(this.winners).map((winner) => {
        return {
          id: winner.id,
          name: winner.name,
          wins: winner.wins,
        } as Winner
      })

      resolve(winners)
    })
  }
}

export const winnerRepository = new WinnerRepository()
