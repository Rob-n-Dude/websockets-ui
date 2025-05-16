import {ApplicationDB} from 'ws_server/repository'

export const sendMessage = (
  type: string,
  message: object | string
): Record<string, unknown> => {
  return {
    type,
    data: JSON.stringify(message),
    id: 0,
  }
}

export const sendToAllUsers = async (
  db: ApplicationDB,
  type: string,
  message: object | string
) => {
  const users = await db.user.getAll()
  console.log('users', users)
  for await (const user of users) {
    console.log('mewssage', message)
    user.ws.send(JSON.stringify(sendMessage(type, message)))
  }
}
