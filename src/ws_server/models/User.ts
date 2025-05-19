import {ExtendedWebSocket} from './Socket'

export interface User {
  ws: ExtendedWebSocket
  password: string
  name: string
  id: string
  room: string | null
  gameId: string | null
}

export type UserRegisterData = {
  name: string
  password: string
}

export const isUserDataValid = (data: UserRegisterData): boolean => {
  const {name, password} = data
  const isNameValid = typeof name === 'string' && name.length > 5

  const isPasswordValid = typeof password === 'string' && password.length >= 5

  return isNameValid && isPasswordValid
}
