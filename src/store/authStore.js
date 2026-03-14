import { create } from 'zustand'
import api from '../lib/api'

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('access_token', data.access_token)
      const me = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${data.access_token}` },
      })
      set({ user: me.data, token: data.access_token, isLoading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Login failed', isLoading: false })
      return false
    }
  },

  logout: async () => {
    try { await api.post('/auth/logout') } catch {}
    localStorage.removeItem('access_token')
    set({ user: null, token: null })
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/users/me')
      set({ user: data })
    } catch {
      localStorage.removeItem('access_token')
      set({ user: null, token: null })
    }
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
