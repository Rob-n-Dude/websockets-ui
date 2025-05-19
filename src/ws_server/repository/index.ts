import {gameRepository, GameRepositoryType} from './gameRepository'
import {roomRepository, RoomRepositoryType} from './roomRepository'
import {userRepository, UserRepositoryType} from './userRepository'
import {winnerRepository, WinnerRepositoryType} from './winnersRepository'

export type ApplicationDB = {
  user: UserRepositoryType
  room: RoomRepositoryType
  game: GameRepositoryType
  winner: WinnerRepositoryType
}

export const db = {
  user: userRepository,
  room: roomRepository,
  game: gameRepository,
  winner: winnerRepository,
} as ApplicationDB
