import { defineStore } from 'pinia'
import api from '@/api/api'

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
    loading: false,
  }),

  actions: {
    async login(payload: unknown) {
      try {
        this.loading = true

        const res = await api.post('/auth/login', payload)

        this.token = res.data.token
        this.user = res.data.user

        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
      } catch (error) {
        this.logout()

        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      this.user = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
