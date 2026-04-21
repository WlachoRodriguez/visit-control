import api from '@/api/api'

export const getDistricts = async () => {
  const res = await api.get('/district')
  return res.data
}
