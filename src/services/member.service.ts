import api from '@/api/api'
import type { Member } from '@/types/member'

export const createMember = async (data: Member) => {
  const res = await api.post('/member', data)
  return res.data
}

export const updateMember = async (id: string, data: Member) => {
  const res = await api.put(`/member/${id}`, data)
  return res.data
}

export const getMembers = async () => {
  const res = await api.get('/member')
  return res.data
}

export const deleteMember = async (id: string) => {
  const res = await api.delete(`/member/${id}`)
  return res.data
}
