import {ApplicationDB} from '../repository'
import {Bot} from './Bot'
import {ExtendedWebSocket} from '../models/Socket'
import {ParsedMessage} from '../utils/parse'
import {createRoom} from '../messageHandlers/createRoom'
import {createSocket} from './createSocket'
import {Event} from './Event'

export const createBot = async (db: ApplicationDB, ws: ExtendedWebSocket) => {
  const socket = await createSocket()

  let bot = new Bot(socket)

  bot.on(Event.CREATED, () => {
    console.log('Bot created')
    bot.requestRegister()
  })

  bot.on(Event.REGISTER, async () => {
    const roomId = await createRoom({} as ParsedMessage, db, ws)
    console.log('Room created', roomId)
    bot.joinToRoom(roomId!)
  })

  bot.on(Event.CREATE_GAME, () => {
    bot.addShips()
  })

  bot.on(Event.DESTROY, () => {
    console.log('Bot destroyed')
    bot = null as unknown as Bot
  })

  bot.emit(Event.CREATED)
}
