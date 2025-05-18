import {AttackResult} from './Game'
import {Ship} from './Ship'

export type Board = string[][]

export enum BoardCell {
  EMPTY = '',
  SHIP = 'S',
  HIT = 'X',
  MISS = 'M',
}

export const getEmptyBoard = (boardSize = 10): Board =>
  Array.from({length: boardSize}, () => Array(boardSize).fill(BoardCell.EMPTY))

export const isBoardEmpty = (board: Board): boolean => {
  return board.every((row) => row.every((cell) => cell === BoardCell.EMPTY))
}

export const getBoardWithShips = (board: Board, ships: Ship[]): Board => {
  const newBoard = board.map((row) => [...row])

  ships.forEach((ship) => {
    const {position, direction, length} = ship
    const {x, y} = position

    for (let i = 0; i < length; i++) {
      const row = direction ? y + i : y
      const col = direction ? x : x + i

      newBoard![row]![col] = BoardCell.SHIP
    }
  })

  return newBoard
}

export const getBoardAfterShot = (
  shotResult: AttackResult,
  board: Board,
  position: {x: number; y: number}
) => {
  const marker =
    shotResult === AttackResult.MISS ? BoardCell.MISS : BoardCell.HIT

  const newBoard = board.map((row) => [...row])

  newBoard![position.y]![position.x] = marker

  return newBoard
}

export const canShootAtCell = (board: Board, x: number, y: number): boolean => {
  if (board[y] === undefined) {
    return false
  }

  if (board[y][x] === undefined) {
    return false
  }

  return board[y][x] === BoardCell.EMPTY || board[y][x] === BoardCell.SHIP
}

export const getAttackResult = (
  board: Board,
  x: number,
  y: number
): AttackResult => {
  const cell = board![y]![x]

  if (cell === BoardCell.SHIP) {
    return AttackResult.HIT
  }

  return AttackResult.MISS
}

const getShipCells = (ship: Ship) => {
  const {position, direction, length} = ship
  const {x, y} = position
  const cells = []

  for (let i = 0; i < length; i++) {
    const row = direction ? y + i : y
    const col = direction ? x : x + i

    cells.push({x: col, y: row})
  }

  return cells
}

export const isShipKilled = (
  board: Board,
  position: {x: number; y: number},
  ship: Ship
) => {
  const shipCells = getShipCells(ship)

  const isKilled = shipCells.every((cell) => {
    const {x, y} = cell

    if (x === position.x && y === position.y) {
      return board[y]![x] === BoardCell.SHIP
    }

    return board[y]![x] === BoardCell.HIT
  })

  return isKilled
}

export const getNearbyCells = (board: Board, ship: Ship) => {
  const boardSize = board.length

  const minX = ship.position.x - 1 <= 0 ? 0 : ship.position.x - 1
  const minY = ship.position.y - 1 <= 0 ? 0 : ship.position.y - 1
  const maxX =
    ship.position.x + (ship.direction ? 1 : ship.length) >= boardSize
      ? boardSize - 1
      : ship.position.x + (ship.direction ? 1 : ship.length)
  const maxY =
    ship.position.y + (ship.direction ? ship.length : 1) >= boardSize
      ? boardSize - 1
      : ship.position.y + (ship.direction ? ship.length : 1)

  const cells = []

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      if (board[y]![x] === BoardCell.EMPTY) {
        cells.push({x, y})
      }
    }
  }

  return cells
}

export const getRandomNotTouchedCell = (
  board: Board
): {x: number; y: number} => {
  const cells: {x: number; y: number}[] = []

  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === BoardCell.EMPTY || cell === BoardCell.SHIP) {
        cells.push({x, y})
      }
    })
  })

  const randomIndex = Math.round(Math.random() * (cells.length - 1))

  return cells[randomIndex]!
}

export const areAllShipsDestroyed = (board: Board): boolean => {
  return board.every((row) => row.every((cell) => cell !== BoardCell.SHIP))
}
