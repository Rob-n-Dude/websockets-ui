import {Ship} from './Game'

export type Board = string[][]

enum BoardCell {
  EMPTY = '',
  SHIP = 'S',
  HIT = 'X',
  MISS = 'M',
}

export const getEmptyBoard = (boardSize = 10): Board =>
  Array.from({length: boardSize}, () => Array(boardSize).fill(BoardCell.EMPTY))

export const isEmpty = (board: Board): boolean => {
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
