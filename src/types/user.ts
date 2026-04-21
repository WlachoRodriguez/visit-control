export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SECRETARY = 'SECRETARY',
  OFFICE = 'OFFICE',
}

export interface User {
  id: string
  name: string
  lastName: string
  email: string
  password: string
  role: UserRole
  isActive: boolean
  districtId?: string
}
