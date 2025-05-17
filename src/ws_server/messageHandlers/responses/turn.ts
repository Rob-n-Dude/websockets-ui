import {sendMessage} from '../../utils/send'
import {ApplicationDB} from '../../repository'
import {GameMessageType} from '../../constants/messageType'

type TurnArguments = {
  db: ApplicationDB
  gameId: string
}

export const turn = async ({db, gameId}: TurnArguments) => {
  const game = await db.game.read(gameId)

  if (!game) {
    return
  }

  const data = {
    currentPlayer: game.currentPlayer,
  }

  for await (const userId of game.users) {
    const user = await db.user.read(userId)

    if (!user || !user.ws) {
      continue
    }

    await user.ws.send(JSON.stringify(sendMessage(GameMessageType.TURN, data)))
  }
}
