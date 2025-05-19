import {singleRoomUpdate} from '../../broadcast/singleRoomUpdate'
import {ApplicationDB} from '../../repository'
import {createGame} from './createGame'

type UpdateRoomData = {
  roomId: string
  userId: string
  db: ApplicationDB
}

export const bookRoom = async ({roomId, userId, db}: UpdateRoomData) => {
  const room = await db.room.read(roomId)
  if (!room) {
    return
  }

  const user = await db.user.read(userId)
  if (!user) {
    return
  }

  if (room.users.includes(userId)) {
    return
  }

  if (user.room) {
    const prevUserRoom = await db.room.read(user.room)

    if (!prevUserRoom) {
      return
    }

    await db.room.update(user.room, {
      users: prevUserRoom.users.filter((u) => u !== userId),
    })
  }

  const roomUsersAfterUpdate = [...room.users, userId]

  await db.room.update(roomId, {
    users: roomUsersAfterUpdate,
  })

  await db.user.update(userId, {
    room: roomId,
  })

  if (roomUsersAfterUpdate.length > 1) {
    await createGame({roomId, db})
  }

  return await singleRoomUpdate(db)
}
