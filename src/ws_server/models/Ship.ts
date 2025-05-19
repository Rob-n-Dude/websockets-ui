export enum ShipType {
  HUGE = 'huge',
  LARGE = 'large',
  MEDIUM = 'medium',
  SMALL = 'small',
}

export enum ShipSize {
  HUGE = 4,
  LARGE = 3,
  MEDIUM = 2,
  SMALL = 1,
}

export const MAP_SHIP_SIZE_TO_TYPE: Record<ShipSize, ShipType> = {
  [ShipSize.HUGE]: ShipType.HUGE,
  [ShipSize.LARGE]: ShipType.LARGE,
  [ShipSize.MEDIUM]: ShipType.MEDIUM,
  [ShipSize.SMALL]: ShipType.SMALL,
}

export interface Ship {
  position: {
    x: number
    y: number
  }
  direction: boolean
  type: ShipType
  length: number
}
