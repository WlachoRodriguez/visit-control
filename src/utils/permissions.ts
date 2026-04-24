import { UserRole } from '@/types/user'

export const canAccess = (userRole: UserRole | undefined, roles?: UserRole[]) => {
  if (!roles || roles.length === 0) return true
  if (!userRole) return false

  return roles.includes(userRole)
}
