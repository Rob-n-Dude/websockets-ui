import {gameRepository, GameRepositoryType} from './gameRepository'
import {roomRepository, RoomRepositoryType} from './roomRepository'
import {userRepository, UserRepositoryType} from './userRepository'

export type ApplicationDB = {
  user: UserRepositoryType
  room: RoomRepositoryType
  game: GameRepositoryType
}

export const db = {
  user: userRepository,
  room: roomRepository,
  game: gameRepository,
} as ApplicationDB
