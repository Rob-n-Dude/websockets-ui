export interface Repository<T> {
  create(item: T | string): Promise<T>
  read(id: string): Promise<T | null>
  delete(id: string): Promise<boolean>
  update(id: string, data: Partial<T>): Promise<T | null>
  getAll(): Promise<T[]>
}
