import type { District } from './district'

export interface Church {
  id: string
  name: string
  districtId: string
  district?: District
}
