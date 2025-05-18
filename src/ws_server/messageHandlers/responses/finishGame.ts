import {sendMessage} from '../../utils/send'
import {ApplicationDB} from '../../repository'
import {GameMessageType} from '../../constants/messageType'
import {updateWinners} from './updateWinners'

export const finishGame = async (db: ApplicationDB, gameId: string) => {
  const game = await db.game.read(gameId)

  if (!game) {
    return
  }

  const winnerId = game.currentPlayer

  const data = {
    winPlayer: winnerId,
  }

  const winner = await db.winner.read(winnerId)

  if (!winner) {
    const user = await db.user.read(winnerId)
    await db.winner.create({
      id: winnerId,
      name: user!.name,
      wins: 1,
    })
  } else {
    await db.winner.update(winnerId, {
      wins: winner.wins + 1,
    })
  }

  for (const userId of game.users) {
    const user = await db.user.read(userId)

    if (!user || !user.ws) {
      continue
    }

    user.ws.send(JSON.stringify(sendMessage(GameMessageType.FINISH, data)))

    await db.user.update(userId, {
      gameId: null,
      room: null,
    })
  }

  await updateWinners(db)
}
