import {GameMessageType} from '../../constants/messageType'
import {ApplicationDB} from '../../repository'
import {sendMessage} from '../../utils/send'
import {turn} from './turn'

type StartGameArgs = {
  db: ApplicationDB
  gameId: string
}

export const startGame = async ({gameId, db}: StartGameArgs) => {
  const game = await db.game.read(gameId)

  if (!game) {
    return
  }

  for (const userId of game.users) {
    const user = await db.user.read(userId)
    if (!user) {
      return
    }

    const data = {
      ships: game.ships[userId],
      currentPlayerIndex: game.currentPlayer,
    }

    user.ws.send(
      JSON.stringify(sendMessage(GameMessageType.START_GAME, data))
    )

    await turn({
      db,
      gameId,
    })
  }
}
