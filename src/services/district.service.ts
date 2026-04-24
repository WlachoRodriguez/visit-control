import api from '@/api/api'

export const getDistricts = async () => {
  const res = await api.get('/district')
  return res.data
}

export const createDistrict = async (data: { name: string }) => {
  const res = await api.post('/district', data)
  return res.data
}

export const updateDistrict = async (id: string, data: { name: string }) => {
  const res = await api.put(`/district/${id}`, data)
  return res.data
}

export const deleteDistrict = async (id: string) => {
  const res = await api.delete(`/district/${id}`)
  return res.data
}
