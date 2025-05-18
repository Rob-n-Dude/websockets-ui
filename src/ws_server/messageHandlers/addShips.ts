import {ApplicationDB} from '../repository'
import {ParsedMessage} from '../utils/parse'
import {getBoardWithShips, isBoardEmpty} from '../models/Board'
import {startGame} from './responses/startGame'
import {Ship} from '../models/Ship'

type dataType = {
  ships: Ship[]
  indexPlayer: string
}

export const addShips = async (message: ParsedMessage, db: ApplicationDB) => {
  const {ships, indexPlayer} = message.data as dataType

  const user = await db.user.read(indexPlayer)

  if (!user?.gameId) {
    return
  }

  const gameId = user.gameId

  const game = await db.game.read(gameId)

  if (!game) {
    return
  }

  const board = game.boards[indexPlayer]!
  const updatedBoard = getBoardWithShips(board, ships)

  const updatedBoards = {
    ...game.boards,
    [indexPlayer]: updatedBoard,
  }

  await db.game.update(gameId, {
    boards: updatedBoards,
    ships: {
      ...game.ships,
      [indexPlayer]: ships,
    },
  })

  if (Object.values(updatedBoards).every((board) => !isBoardEmpty(board))) {
    await startGame({
      db,
      gameId,
    })
  }
}
