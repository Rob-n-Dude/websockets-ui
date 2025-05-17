import {ParsedMessage} from '../utils/parse'
import {bookRoom} from './responses/bookRoom'
import {ApplicationDB} from '../repository'
import {ExtendedWebSocket} from '../models/Socket'

type AddToRoomData = {
  indexRoom: string
}

export const addUserToTheRoom = async (
  message: ParsedMessage,
  db: ApplicationDB,
  ws: ExtendedWebSocket
) => {
  const userId = ws._userId
  const {indexRoom} = message.data as AddToRoomData

  return await bookRoom({
    roomId: indexRoom,
    userId,
    db,
  })
}
