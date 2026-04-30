import api from '@/api/api'
import type { DashboardResponse } from '@/types/dashboard'

export const getDashboard = async (params: {
  startDate: string
  endDate: string
  userId?: string
}) => {
  const { data } = await api.get<DashboardResponse>('/dashboard', { params })

  return data
}
