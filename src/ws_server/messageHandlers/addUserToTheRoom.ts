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
  console.log('addUserToTheRoom', userId)
  console.log('message', message)
  const {indexRoom} = message.data as AddToRoomData

  return await bookRoom({
    roomId: indexRoom,
    userId,
    db,
  })
}
