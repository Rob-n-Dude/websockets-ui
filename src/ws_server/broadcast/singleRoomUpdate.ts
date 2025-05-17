import {RoomMessageType} from '../constants/messageType'
import {ApplicationDB} from '../repository'
import {Room} from '../models/Room'
import {sendToAllUsers} from '../utils/send'

export const singleRoomUpdate = async (db: ApplicationDB) => {
  const rooms = await db.room.getAll()
  const users = await db.user.getAll()

  const roomsWithSingleUser = rooms
    .filter((room: Room) => room.users.length === 1)
    .map((room: Room) => ({
      roomId: room.id,
      roomUsers: room.users.map((id) => {
        const user = users.find((user) => user.id === id)
        return {
          index: user?.id,
          name: user?.name,
        }
      }),
    }))

  return sendToAllUsers(db, RoomMessageType.UPDATE_ROOM, roomsWithSingleUser)
}
