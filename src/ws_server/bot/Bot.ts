import {sendMessage} from '../utils/send'
import {
  GameMessageType,
  RoomMessageType,
  UserMessageType,
} from '../constants/messageType'
import {parse, ParsedMessage} from '../utils/parse'
import {generateShips} from './generateShips'
import {EventEmitter} from 'node:events'
import {Event} from './Event'

const connectionPass = 'bot-pass'

export class Bot extends EventEmitter {
  private id: string
  private gameId: string
  private name: string
  private socket: WebSocket

  constructor(socket: WebSocket) {
    super()
    this.name = 'ShipBot'
    this.socket = socket

    this.socket.addEventListener('message', async (event) => {
      const parsedMessage = parse(event.data)
      console.log('Bot received message:', parsedMessage)

      this.handleMessage(parsedMessage)
    })
  }

  private handleMessage(parsedMessage: ParsedMessage) {
    const {type} = parsedMessage

    switch (type) {
      case UserMessageType.REGISTER:
        this.handleRegister(parsedMessage)
        break
      case GameMessageType.CREATE_GAME:
        this.handleCreateGame(parsedMessage)
        break
      case GameMessageType.TURN:
        this.handleTurn(parsedMessage)
        break
      case GameMessageType.FINISH:
        this.destroy()
        break
      default:
        console.log('Bot: Receive not valuable message:', type)
    }
  }

  private send(type: string, message: object | string) {
    this.socket!.send(JSON.stringify(sendMessage(type, message)))
  }

  public requestRegister() {
    const registerMessage = {
      name: this.name,
      password: connectionPass,
    }

    this.send(UserMessageType.REGISTER, registerMessage)
  }

  private handleRegister(parsedMessage: ParsedMessage) {
    const {index} = parsedMessage.data as {index: string}
    this.id = index

    this.emit(Event.REGISTER)
  }

  private handleCreateGame(parsedMessage: ParsedMessage) {
    const {idGame} = parsedMessage.data as {idGame: string}
    this.gameId = idGame

    this.emit(Event.CREATE_GAME)
  }

  private handleTurn(parsedMessage: ParsedMessage) {
    const {currentPlayer} = parsedMessage.data as {currentPlayer: string}

    if (currentPlayer !== this.id) {
      return
    }

    const dataToSend = {
      gameId: this.gameId,
      indexPlayer: this.id,
    }

    console.log('Bot: Sending random attack')
    this.send(GameMessageType.RANDOM_ATTACK, dataToSend)
  }
  public joinToRoom(roomId: string) {
    this.send(RoomMessageType.ADD_USER_TO_ROOM, {indexRoom: roomId})
  }

  public addShips() {
    const ships = generateShips()
    const dataToSend = {
      gameId: this.gameId,
      ships,
      indexPlayer: this.id,
    }

    this.send(GameMessageType.ADD_SHIPS, dataToSend)
  }

  private destroy() {
    this.socket.close()

    this.socket = null as unknown as WebSocket
    this.id = ''
    this.gameId = ''
    this.name = ''

    this.emit(Event.DESTROY)
    this.removeAllListeners()
  }
}
