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
    // case GameMessageType.CREATE_GAME:
    //   return await createGame(parsedMessage, db)
    // case GameMessageType.START_GAME:
    //   return await startGame(parsedMessage, db)
    // case GameMessageType.TURN:
    //   return await turn(parsedMessage, db)

    // case GameMessageType.FINISH:
    //   return await finish(parsedMessage, db)
    // case RoomMessageType.UPDATE_ROOM:
    //   return await updateRoom(parsedMessage, db)
    // case RoomMessageType.UPDATE_WINNERS:
    //   return await updateWinners(parsedMessage, db)
    default:
      throw new Error(`Unknown message type: ${type}`)
  }
}
