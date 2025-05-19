import {ENV} from '../../utils/env'

const connectionString = `ws://localhost:${ENV.WS_SERVER_PORT}`

export const createSocket = () =>
  new Promise<WebSocket>((resolve) => {
    const socket = new WebSocket(connectionString)

    socket.addEventListener('open', () => {
      console.log('Socket connected to server')
      resolve(socket)
    })

    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error)
    })
  })
