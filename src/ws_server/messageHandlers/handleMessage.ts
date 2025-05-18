import {ExtendedWebSocket} from '../models/Socket'
import {
  GameMessageType,
  RoomMessageType,
  UserMessageType,
} from '../constants/messageType'
import {db} from '../repository'
import {ParsedMessage} from '../utils/parse'
import {createRoom} from './createRoom'
import {addUserToTheRoom} from './addUserToTheRoom'
import {login} from './login'
import {addShips} from './addShips'
import {attack} from './attack'
import {randomAttack} from './randomAttack'

export const handleMessage = async (
  parsedMessage: ParsedMessage,
  ws: ExtendedWebSocket
) => {
  const {type} = parsedMessage

  switch (type) {
    case UserMessageType.REGISTER:
      return await login(parsedMessage, db, ws)
    case RoomMessageType.CREATE_ROOM:
      return await createRoom(parsedMessage, db, ws)
    case RoomMessageType.ADD_USER_TO_ROOM:
      return await addUserToTheRoom(parsedMessage, db, ws)
    case GameMessageType.ADD_SHIPS:
      return await addShips(parsedMessage, db)
    case GameMessageType.ATTACK:
      return await attack(parsedMessage, db)
    case GameMessageType.RANDOM_ATTACK:
      return await randomAttack(parsedMessage, db)
    default:
      throw new Error(`Unknown message type: ${type}`)
  }
}
