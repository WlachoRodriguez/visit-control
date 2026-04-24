import type { Church } from './church'

export interface Member {
  id: string
  name: string
  lastName: string
  phone: string
  address: string
  churchId: string
  church?: Church
}
