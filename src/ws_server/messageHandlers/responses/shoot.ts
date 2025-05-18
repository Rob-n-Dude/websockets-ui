import {
  areAllShipsDestroyed,
  Board,
  getAttackResult,
  getBoardAfterShot,
  getNearbyCells,
  isShipKilled,
} from '../../models/Board'
import {
  AttackResponseStatus,
  AttackResult,
  getShipByCoordinates,
  Ship,
} from '../../models/Game'
import {ApplicationDB} from '../../repository'
import {sendMessage} from '../../utils/send'
import {GameMessageType} from '../../constants/messageType'
import {finishGame} from './finishGame'

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

  if (attackResult === AttackResult.MISS) {
    await handleMiss(
      db,
      gameId,
      currentPlayer,
      opponentId,
      targetBoard,
      position
    )
    await switchTurn(db, gameId, opponentId)

    return
  }

  const ships = game.ships[opponentId] as unknown as Ship[]

  const targetShip = getShipByCoordinates(ships, position)

  if (!targetShip) {
    return
  }

  const isKilled = isShipKilled(targetBoard, position, targetShip)

  if (!isKilled) {
    await handleHit(
      db,
      gameId,
      currentPlayer,
      opponentId,
      targetBoard,
      position
    )

    return
  }

  await handleKill(
    db,
    gameId,
    currentPlayer,
    opponentId,
    targetBoard,
    position,
    targetShip
  )
}

const handleMiss = async (
  db: ApplicationDB,
  gameId: string,
  currentPlayer: string,
  opponentId: string,
  targetBoard: Board,
  position: {x: number; y: number}
) => {
  const game = await db.game.read(gameId)!

  if (!game) {
    return
  }

  await db.game.update(gameId, {
    boards: {
      ...game.boards,
      [opponentId]: getBoardAfterShot(AttackResult.MISS, targetBoard, position),
    },
  })

  const resultData = {
    position,
    currentPlayer,
    status: AttackResponseStatus.MISS,
  }

  for (const player of game.users) {
    const user = await db.user.read(player)!

    if (!user) {
      continue
    }

    user?.ws.send(
      JSON.stringify(sendMessage(GameMessageType.ATTACK, resultData))
    )
  }
}

const handleHit = async (
  db: ApplicationDB,
  gameId: string,
  currentPlayer: string,
  opponentId: string,
  targetBoard: Board,
  position: {x: number; y: number}
) => {
  const game = await db.game.read(gameId)!

  if (!game) {
    return
  }

  await db.game.update(gameId, {
    boards: {
      ...game.boards,
      [opponentId]: getBoardAfterShot(AttackResult.HIT, targetBoard, position),
    },
  })

  const resultData = {
    position,
    currentPlayer,
    status: AttackResponseStatus.SHOT,
  }

  for (const player of game.users) {
    const user = await db.user.read(player)!

    if (!user) {
      continue
    }

    user?.ws.send(
      JSON.stringify(sendMessage(GameMessageType.ATTACK, resultData))
    )
  }
}

const handleKill = async (
  db: ApplicationDB,
  gameId: string,
  currentPlayer: string,
  opponentId: string,
  targetBoard: Board,
  position: {x: number; y: number},
  targetShip: Ship
) => {
  const game = await db.game.read(gameId)!
  if (!game) {
    return
  }

  const boardAfterShot = getBoardAfterShot(
    AttackResult.KILL,
    targetBoard,
    position
  )
  await db.game.update(gameId, {
    boards: {
      ...game.boards,
      [opponentId]: boardAfterShot,
    },
  })

  const resultData = {
    position,
    currentPlayer,
    status: AttackResponseStatus.KILLED,
  }

  for (const player of game.users) {
    const user = await db.user.read(player)!

    if (!user) {
      continue
    }

    user?.ws.send(
      JSON.stringify(sendMessage(GameMessageType.ATTACK, resultData))
    )
  }

  const nearbyCells = getNearbyCells(boardAfterShot, targetShip)

  for (const cell of nearbyCells) {
    const {x, y} = cell

    const resultData = {
      position: {x, y},
      currentPlayer,
      status: AttackResponseStatus.MISS,
    }

    for (const player of game.users) {
      const user = await db.user.read(player)!

      if (!user) {
        continue
      }

      user?.ws.send(
        JSON.stringify(sendMessage(GameMessageType.ATTACK, resultData))
      )
    }
  }

  const boardAfterNearbyMisses = nearbyCells.reduce((acc, cell) => {
    acc = getBoardAfterShot(AttackResult.KILL, acc, cell)
    return acc
  }, boardAfterShot)

  await db.game.update(gameId, {
    boards: {
      ...game.boards,
      [opponentId]: boardAfterNearbyMisses,
    },
  })

  const areShipsDestroyed = areAllShipsDestroyed(boardAfterNearbyMisses)

  if (areShipsDestroyed) {
    return await finishGame(db, gameId)
  }
}

const switchTurn = async (
  db: ApplicationDB,
  gameId: string,
  opponentId: string
) => {
  await db.game.update(gameId, {
    currentPlayer: opponentId,
  })
}
