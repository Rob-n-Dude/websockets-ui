import {User} from '../models/User'
import {Repository} from './repository'

type UserRepositoryStorage = {
  [key: string]: User
}

export type UserRepositoryType = Repository<User>

class UserRepository implements UserRepositoryType {
  private users: UserRepositoryStorage = {}

  create(data: User) {
    return new Promise<User>((resolve) => {
      this.users[data.id] = data
      resolve(data)
    })
  }

  read(id: string) {
    return new Promise<User | null>((resolve) => {
      if (!this.users[id]) {
        resolve(null)
        return
      }

      resolve(this.users[id])
    })
  }

  update(id: string, data: Partial<User>) {
    return new Promise<User | null>((resolve) => {
      if (!this.users[id]) {
        resolve(null)
        return
      }

      const userData = this.users[id]
      const updatedUserData = {...userData, ...data}
      this.users[id] = updatedUserData
      resolve(updatedUserData)
    })
  }

  getAll(): Promise<User[]> {
    return new Promise((resolve) => {
      const users = Object.values(this.users).map((user) => {
        return {
          id: user.id,
          name: user.name,
          ws: user.ws,
          room: user.room,
        } as User
      })

      resolve(users)
    })
  }

  delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.users[id]) {
        resolve(false)
        return
      }

      delete this.users[id]
      resolve(true)
    })
  }
}

export const userRepository = new UserRepository()
