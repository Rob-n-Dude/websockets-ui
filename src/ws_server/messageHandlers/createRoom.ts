import {randomUUID} from 'node:crypto'
import {ApplicationDB} from '../repository'
import {ParsedMessage} from '../utils/parse'
import {bookRoom} from './responses/bookRoom'
import {ExtendedWebSocket} from '../models/Socket'

export const createRoom = async (
  _: ParsedMessage,
  db: ApplicationDB,
  ws: ExtendedWebSocket
) => {
  const userId = ws._userId

  const user = await db.user.read(userId)

  if (user?.room) {
    return
  }

  const id = randomUUID()
  await db.room.create(id)

  await bookRoom({
    roomId: id,
    userId: ws._userId,
    db,
  })

  return id
}
