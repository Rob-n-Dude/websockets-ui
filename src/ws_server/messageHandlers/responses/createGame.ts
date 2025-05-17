import {randomUUID} from 'crypto'
import {GameMessageType} from '../../constants/messageType'
import {ApplicationDB} from '../../repository'
import {sendMessage} from '../../utils/send'

type CreateGameArgs = {
  roomId: string
  db: ApplicationDB
}

export const createGame = async ({roomId, db}: CreateGameArgs) => {
  const room = await db.room.read(roomId)

  const {users} = room!

  const gameId = randomUUID()

  await db.game.create({
    users,
    id: gameId,
  })

  for await (const userId of users) {
    const user = await db.user.read(userId)
    await db.user.update(userId, {
      gameId: gameId,
    })

    const data = {
      isGame: gameId,
      idPlayer: userId,
    }

    await user?.ws.send(
      JSON.stringify(sendMessage(GameMessageType.CREATE_GAME, data))
    )
  }
}
