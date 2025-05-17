import {getAttackResult, getBoardAfterShot} from '../../models/Board'
import {AttackResponseStatus, AttackResult} from '../../models/Game'
import {ApplicationDB} from '../../repository'
import {sendMessage} from '../../utils/send'
import {GameMessageType} from '../../constants/messageType'
import {turn} from './turn'

type ShootArgs = {
  db: ApplicationDB
  position: {
    x: number
    y: number
  }
  gameId: string
}

export const shoot = async ({db, position, gameId}: ShootArgs) => {
  const game = await db.game.read(gameId)!

  if (!game) {
    return
  }

  const {x, y} = position
  const currentPlayer = game.currentPlayer
  const [opponentId, targetBoard] = Object.entries(game.boards).find(
    ([key]) => key !== currentPlayer
  )!

  const attackResult = getAttackResult(targetBoard, x, y)

  const resultData = {
    position,
    currentPlayer,
    status: '',
  }

  if (attackResult === AttackResult.MISS) {
    resultData.status = AttackResponseStatus.MISS

    await db.game.update(game.id, {
      boards: {
        ...game.boards,
        [opponentId]: getBoardAfterShot(attackResult, targetBoard, {x, y}),
      },
      currentPlayer: opponentId,
    })

    const user = await db.user.read(currentPlayer)!
    await user?.ws.send(
      JSON.stringify(sendMessage(GameMessageType.ATTACK, resultData))
    )

    await turn({
      db,
      gameId,
    })

    return
  }
}
