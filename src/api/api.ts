const API_URL = 'http://localhost:3000'

export const apiFetch = async (endpoint: string, options: any = {}) => {
  const token = localStorage.getItem('token')

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data.message)

  return data
}
