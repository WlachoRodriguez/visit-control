import api from '@/api/api'
import type { User } from '@/types/user'

export const createUser = async (data: User) => {
  const res = await api.post('/auth/register', data)
  return res.data
}

export const updateUser = async (id: string, data: User) => {
  const res = await api.put(`/users/${id}`, {
    name: data.name,
    lastName: data.lastName,
    email: data.email,
    role: data.role,
    isActive: data.isActive,
    districtId: data.districtId,
  })
  return res.data
}

export const getUsers = async (page: number, limit: number) => {
  const res = await api.get(`/users?page=${page}&limit=${limit}`)
  return res.data
}

export const deleteUser = async (id: string) => {
  const res = await api.delete(`/users/${id}`)
  return res.data
}
