import {WebSocket} from 'ws'
import {parse} from './utils/parse'
import {ExtendedWebSocket} from './models/Socket'
import {handleMessage} from './messageHandlers/handleMessage'
import {handleUserDisconnect} from './messageHandlers/handleDisconnect'

export const createWebSocketServer = (port: number) => {
  const wsServer = new WebSocket.Server({
    port,
  })

  wsServer.on('connection', (ws: WebSocket) => {
    console.log('New client connected')

    ws.on('message', async (message: Buffer) => {
      const parsedMessage = parse(message)
      console.log('Received message:', parsedMessage)

      await handleMessage(parsedMessage, ws as unknown as ExtendedWebSocket)
    })

    ws.on('close', async () => {
      console.log('Client disconnected')
      await handleUserDisconnect(ws as unknown as ExtendedWebSocket)
    })
  })

  wsServer.on('error', (error) => {
    console.error('WebSocket error:', error)
  })

  wsServer.on('listening', () => {
    console.log(`WebSocket server is listening on port ${port}`)
  })

  return wsServer
}
