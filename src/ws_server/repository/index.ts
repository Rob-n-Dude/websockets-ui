import {roomRepository, RoomRepositoryType} from './roomRepository'
import {userRepository, UserRepositoryType} from './userRepository'

export type ApplicationDB = {
  user: UserRepositoryType
  room: RoomRepositoryType
}

export const db = {
  user: userRepository,
  room: roomRepository,
} as ApplicationDB
