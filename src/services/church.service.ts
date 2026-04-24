import api from '@/api/api'
import type { Church } from '@/types/church'

export const createChurch = async (data: Church) => {
  const res = await api.post('/church', data)
  return res.data
}

export const updateChurch = async (id: string, data: Church) => {
  const res = await api.put(`/church/${id}`, data)
  return res.data
}

export const getChurches = async () => {
  const res = await api.get('/church')
  return res.data
}

export const deleteChurch = async (id: string) => {
  const res = await api.delete(`/church/${id}`)
  return res.data
}
