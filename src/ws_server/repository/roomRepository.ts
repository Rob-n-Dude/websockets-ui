import {Repository} from './repository'

export type Room = {
  id: string
  users: string[]
}

export type RoomRepositoryType = Repository<Room>

class RoomRepository implements RoomRepositoryType {
  private rooms: Map<string, unknown>

  constructor() {
    this.rooms = new Map()
  }

  create(roomId: string): Promise<Room> {
    return new Promise<Room>((resolve) => {
      const roomData: Room = {
        id: roomId,
        users: [],
      }

      this.rooms.set(roomId, roomData)
      resolve(roomData)
    })
  }

  read(roomId: string) {
    return new Promise<Room | null>((resolve) => {
      if (!this.rooms.has(roomId)) {
        resolve(null)
        return
      }

      resolve(this.rooms.get(roomId) as Room)
    })
  }

  delete(roomId: string): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(this.rooms.delete(roomId))
    })
  }

  update(roomId: string, data: Partial<Room>): Promise<Room | null> {
    return new Promise<Room | null>((resolve) => {
      console.log('this. roooooooms;', this.rooms)
      if (!this.rooms.has(roomId)) {
        resolve(null)
        return
      }

      const roomData = this.rooms.get(roomId) as Room
      const updatedRoomData = {...roomData, ...data}
      console.log('updatedRoomData', updatedRoomData)
      this.rooms.set(roomId, updatedRoomData)
      resolve(updatedRoomData)
    })
  }

  getAll(): Promise<Room[]> {
    return new Promise<Room[]>((resolve) => {
      const allRooms = Array.from(this.rooms.values()) as Room[]
      resolve(allRooms)
    })
  }
}

export const roomRepository = new RoomRepository()
