import {httpServer} from './src/http_server'
import { createWebSocketServer } from './src/ws_server'
import { ENV } from './src/utils/env'


const HTTP_PORT = ENV.HTTP_SERVER_PORT
const WS_PORT = ENV.WS_SERVER_PORT

httpServer.listen(HTTP_PORT, () => {
  console.log(`Start static http server on the ${HTTP_PORT} port!`)
})

createWebSocketServer(WS_PORT)
