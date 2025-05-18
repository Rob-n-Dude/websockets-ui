import {GameMessageType} from '../../constants/messageType'
import {ApplicationDB} from '../../repository'
import {sendToAllUsers} from '../../utils/send'

export const updateWinners = async (db: ApplicationDB) => {
  const winners = await db.winner.getAll()

  const dataToSend = winners.map((winner) => ({
    name: winner.name,
    wins: winner.wins,
  }))

  return sendToAllUsers(db, GameMessageType.UPDATE_WINNERS, dataToSend)
}
