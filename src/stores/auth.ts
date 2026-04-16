import { defineStore } from 'pinia'
import { apiFetch } from '../api/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: (() => {
      try {
        const data = localStorage.getItem('user')
        return data && data !== 'undefined' ? JSON.parse(data) : null
      } catch {
        return null
      }
    })(),
  }),

  actions: {
    async login(payload: any) {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      this.token = res.token
      this.user = res.user

      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
    },

    logout() {
      this.token = null
      this.user = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
