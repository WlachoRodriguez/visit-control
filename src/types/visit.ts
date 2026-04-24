import type { Member } from './member'

export interface Visit {
  id: string
  date: string
  schedule: 'MORNING' | 'AFTERNOON' | 'NIGHT'
  type: string
  comments?: string
  userId: string
  members?: Member[]
}
