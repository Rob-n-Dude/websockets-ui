import {getRandomNotTouchedCell} from '../models/Board'
import {ApplicationDB} from '../repository'
import {ParsedMessage} from '../utils/parse'
import {shoot} from './responses/shoot'
import {turn} from './responses/turn'

type randomAttackDataType = {
  indexPlayer: string
}

export const randomAttack = async (
  message: ParsedMessage,
  db: ApplicationDB
) => {
  const {indexPlayer} = message.data as randomAttackDataType

  const user = await db.user.read(indexPlayer)

  if (!user || !user.gameId) {
    return
  }

  const game = await db.game.read(user.gameId)

  if (!game) {
    return
  }

  if (game.currentPlayer !== indexPlayer) {
    return
  }

  const [_, targetBoard] = Object.entries(game.boards).find(
    ([key]) => key !== indexPlayer
  )!

  const targetCell = getRandomNotTouchedCell(targetBoard)

  await shoot({
    db,
    position: targetCell,
    gameId: user.gameId,
  })

  await turn({
    db,
    gameId: user.gameId,
  })
}
