import {RoomMessageType} from '../../constants/messageType'
import {ApplicationDB} from '../../repository'
import {Room} from '../../repository/roomRepository'
import {sendToAllUsers} from '../../utils/send'

type UpdateRoomData = {
  roomId: string
  userId: string
  db: ApplicationDB
}

export const updateRoom = async ({roomId, userId, db}: UpdateRoomData) => {
  const room = await db.room.read(roomId)
  if (!room) {
    return
  }

  const user = await db.user.read(userId)
  if (!user || !!user.room) {
    return
  }

  await db.room.update(roomId, {
    users: [...room.users, userId],
  })

  const rooms = await db.room.getAll()
  const roomsWithSingleUser = rooms
    .filter((room: Room) => room.users.length === 1)
    .map((room: Room) => ({
      roomId: room.id,
      roomUsers: room.users.map(async (id) => {
        const u = await db.user.read(id)

        return {
          index: u?.id,
          name: u?.name,
        }
      }),
    }))

  return sendToAllUsers(db, RoomMessageType.UPDATE_ROOM, roomsWithSingleUser)
}
