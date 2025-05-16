import {randomUUID} from 'node:crypto'
import {ApplicationDB} from '../repository'
import {ParsedMessage} from '../utils/parse'
import {updateRoom} from './responses/updateRoom'
import {ExtendedWebSocket} from '../models/Socket'

export const createRoom = async (
  _: ParsedMessage,
  db: ApplicationDB,
  ws: ExtendedWebSocket
) => {
  const id = randomUUID()
  await db.room.create(id)

  return await updateRoom({
    roomId: id,
    userId: ws._userId,
    db,
  })
}
