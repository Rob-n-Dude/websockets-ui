export enum UserMessageType {
  REGISTER = 'reg',
}

export enum GameMessageType {
  CREATE_GAME = 'create_game',
  START_GAME = 'start_game',
  TURN = 'turn',
  ATTACK = 'attack',
  RANDOM_ATTACK = 'randomAttack',
  FINISH = 'finish',
  ADD_SHIPS = 'add_ships',
  UPDATE_WINNERS = 'update_winners',
  SINGLE_PLAY = 'single_play',
}

export enum RoomMessageType {
  CREATE_ROOM = 'create_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  UPDATE_ROOM = 'update_room',
}
