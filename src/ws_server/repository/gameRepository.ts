import {getEmptyBoard, Board} from '../models/Board'
import {Game} from '../models/Game'
import {Repository} from './repository'

export type GameRepositoryType = Repository<Game>

class GameRepository implements GameRepositoryType {
  private games: Map<string, Game>

  constructor() {
    this.games = new Map()
  }

  create(item: Partial<Game>): Promise<Game> {
    return new Promise((resolve) => {
      const {users, id} = item as Pick<Game, 'users' | 'id'>

      const boards: Record<string, Board> = users.reduce(
        (acc: Record<string, Board>, current) => {
          acc[current] = getEmptyBoard()
          return acc
        },
        {}
      )

      const game: Game = {
        id,
        users,
        boards,
        currentPlayer: users.at(0)!,
        ships: {},
      }

      this.games.set(id, game)
      resolve(game)
    })
  }

  read(id: string): Promise<Game | null> {
    return new Promise((resolve) => {
      const game = this.games.get(id)
      resolve(game || null)
    })
  }

  delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      const deleted = this.games.delete(id)
      resolve(deleted)
    })
  }

  update(id: string, data: Partial<Game>): Promise<Game | null> {
    return new Promise((resolve) => {
      const game = this.games.get(id)

      if (!game) {
        resolve(null)
        return
      }

      const updatedGame = {...game, ...data}
      this.games.set(id, updatedGame)
      resolve(updatedGame)
    })
  }

  getAll(): Promise<Game[]> {
    return new Promise((resolve) => {
      const allGames = Array.from(this.games.values())
      resolve(allGames)
    })
  }
}

export const gameRepository = new GameRepository()
