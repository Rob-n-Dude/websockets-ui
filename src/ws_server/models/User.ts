import {ExtendedWebSocket} from './Socket'

export interface User {
  ws: ExtendedWebSocket
  password: string
  name: string
  id: string
  room: string | null
  gameId: string | null
}
