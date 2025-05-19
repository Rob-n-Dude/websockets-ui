import {ExtendedWebSocket} from '../models/Socket'
import {ApplicationDB} from '../repository'
import {ParsedMessage} from '../utils/parse'
import {register} from './register'
import {singleRoomUpdate} from '../broadcast/singleRoomUpdate'
import {updateWinners} from '../broadcast/updateWinners'

export const login = async (
  message: ParsedMessage,
  db: ApplicationDB,
  ws: ExtendedWebSocket
) => {
  await register(message, db, ws)
  await singleRoomUpdate(db)
  await updateWinners(db)
}
