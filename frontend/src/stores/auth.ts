import { defineStore } from 'pinia'
import api from '../api/client'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    user: null as { id: number; iin: string; fullName: string; role: string } | null,
  }),
  actions: {
    async login(iin: string, password: string) {
      const { data } = await api.post('/auth/login', { iin, password })
      this.token = data.access_token
      localStorage.setItem('token', data.access_token)
      await this.fetchProfile()
    },
    async register(payload: { iin: string; fullName: string; password: string }) {
      const { data } = await api.post('/auth/register', payload)
      this.token = data.access_token
      localStorage.setItem('token', data.access_token)
      await this.fetchProfile()
    },
    async fetchProfile() {
      if (!this.token) return
      const { data } = await api.get('/auth/profile')
      this.user = data
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      window.location.href = '/'
    },
  },
})
