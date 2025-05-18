import {randomUUID} from 'node:crypto'
import {ApplicationDB} from '../repository'
import {ParsedMessage} from '../utils/parse'
import {User} from '../models/User'
import {ExtendedWebSocket} from '../models/Socket'
import {sendMessage} from '..//utils/send'

type RegisterData = {
  name: string
  password: string
}

export const register = async (
  message: ParsedMessage,
  db: ApplicationDB,
  ws: ExtendedWebSocket
) => {
  const data = message.data as RegisterData

  const id = randomUUID()
  ws._userId = id

  const createdUser = await db.user.create({
    id,
    name: data.name,
    password: data.password,
    ws: ws as ExtendedWebSocket,
    room: null,
  } as User)

  const sanitizedData = {
    index: createdUser.id,
    name: createdUser.name,
    error: false,
  }

  ws.send(JSON.stringify(sendMessage(message.type, sanitizedData)))
}
