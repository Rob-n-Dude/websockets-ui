import {db} from '../repository'
import {ExtendedWebSocket} from '../models/Socket'
import {finishGame} from './responses/finishGame'
import {singleRoomUpdate} from '../broadcast/singleRoomUpdate'

export const handleUserDisconnect = async (ws: ExtendedWebSocket) => {
  const userId = ws._userId

  if (!userId) {
    return
  }

  const user = await db.user.read(userId)

  if (!user) {
    return
  }

  if (!user.room) {
    await db.user.delete(userId)
    return
  }

  const room = await db.room.read(user.room)

  if (!room) {
    return
  }

  const {users} = room

  if (users.length === 1) {
    await db.room.delete(user.room)
    await singleRoomUpdate(db)
    return
  }

  const gameId = user.gameId

  const winnerId = users.find((userId) => userId !== user.id)
  await finishGame(db, gameId!, winnerId!)
}
