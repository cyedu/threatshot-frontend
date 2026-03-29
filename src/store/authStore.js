import { create } from 'zustand'
import api from '../lib/api'

const useAuthStore = create((set) => ({
  user: null,
  initialized: false, // true once the initial session check completes
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      // Login sets httpOnly access_token + refresh_token cookies on the response.
      // We never store or read the token in JS — the browser sends the cookie automatically.
      await api.post('/auth/login', { email, password })
      const { data } = await api.get('/users/me')
      set({ user: data, isLoading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Login failed', isLoading: false })
      return false
    }
  },

  logout: async () => {
    try {
      // Server revokes refresh token in DB and clears both httpOnly cookies
      await api.post('/auth/logout')
    } catch {}
    set({ user: null })
  },

  // Called once on app mount to restore session from httpOnly cookie
  fetchMe: async () => {
    try {
      const { data } = await api.get('/users/me')
      set({ user: data, initialized: true })
    } catch {
      set({ user: null, initialized: true })
    }
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
