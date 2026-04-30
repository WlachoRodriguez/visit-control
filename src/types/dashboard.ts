export type VisitByUser = {
  userId: string
  total: number
}

export type VisitByMonth = {
  month: string
  total: number
}

export type VisitByChurch = {
  church: string
  total: number
}

export type DashboardResponse = {
  visitsByUser?: VisitByUser[]
  visitsByMonth: VisitByMonth[]
  visitsByChurch: VisitByChurch[]
}
