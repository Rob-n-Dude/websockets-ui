import {canShootAtCell} from '../models/Board'
import {ApplicationDB} from '../repository'
import {ParsedMessage} from '../utils/parse'
import {shoot} from './responses/shoot'
import {turn} from './responses/turn'

type AttackDataType = {
  x: number
  y: number
  indexPlayer: string
}

export const attack = async (message: ParsedMessage, db: ApplicationDB) => {
  const {x, y, indexPlayer} = message.data as AttackDataType

  const user = await db.user.read(indexPlayer)
  if (!user || !user.gameId) {
    return
  }

  const game = await db.game.read(user.gameId)

  if (!game) {
    return
  }

  const currentPlayer = game.currentPlayer

  if (indexPlayer !== currentPlayer) {
    return
  }

  const [_, targetBoard] = Object.entries(game.boards).find(
    ([key]) => key !== indexPlayer
  )!

  const canShoot = canShootAtCell(targetBoard, x, y)

  if (!canShoot) {
    await turn({
      db,
      gameId: user.gameId,
    })

    return
  }

  const position = {
    x,
    y,
  }

  await shoot({
    db,
    position,
    gameId: user.gameId,
  })

  await turn({
    db,
    gameId: user.gameId,
  })
}
