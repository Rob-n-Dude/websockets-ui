import {ApplicationDB} from '../repository'
import {ParsedMessage} from '../utils/parse'
import {ExtendedWebSocket} from '../models/Socket'
import {Ship} from '../models/Game'
import {getBoardWithShips, isEmpty} from '../models/Board'
import {startGame} from './responses/startGame'

type dataType = {
  ships: Ship[]
  indexPlayer: string
}

export const addShips = async (
  message: ParsedMessage,
  db: ApplicationDB,
  ws: ExtendedWebSocket
) => {
  console.log(!!ws)
  const {ships, indexPlayer} = message.data as dataType

  const user = await db.user.read(indexPlayer)
  if (!user || !user.gameId) {
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

  if (Object.values(updatedBoards).every((board) => !isEmpty(board))) {
    await startGame({
      db,
      gameId,
    })
  }
}
