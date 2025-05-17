import {AttackResult, Ship} from './Game'

export type Board = string[][]

enum BoardCell {
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
