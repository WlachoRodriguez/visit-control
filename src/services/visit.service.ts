import api from '@/api/api'
import type { Visit } from '@/types/visit'

export const createVisit = async (data: Visit) => {
  debugger
  const res = await api.post('/visit', data)
  return res.data
}

export const updateVisit = async (id: string, data: Visit) => {
  debugger
  const res = await api.put(`/visit/${id}`, data)
  return res.data
}

export const getVisits = async () => {
  const res = await api.get('/visit')
  return res.data
}

export const deleteVisit = async (id: string) => {
  const res = await api.delete(`/visit/${id}`)
  return res.data
}
