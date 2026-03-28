import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || ''}/api/v1`,
  withCredentials: true, // send httpOnly refresh cookie on every request
  headers: { 'Content-Type': 'application/json' },
})

// ── Anon ID helper — stable UUID per browser, cleared on login ───────────
export function getAnonId() {
  let id = localStorage.getItem('anon_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('anon_id', id)
  }
  return id
}

// ── Request interceptor — attach access token + anon ID ──────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    // Anonymous request — send browser UUID for rate-limiting
    config.headers['X-Anon-Id'] = getAnonId()
  }
  return config
})

// ── Response interceptor — handle 401, attempt token refresh ─────────────
let isRefreshing = false
let refreshQueue = [] // requests waiting while refresh is in flight

function processQueue(error, token = null) {
  refreshQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  refreshQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Only attempt refresh on 401, skip the refresh endpoint itself
    if (
      error.response?.status !== 401 ||
      original._retry ||
      original.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject })
      })
        .then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
        .catch(Promise.reject.bind(Promise))
    }

    original._retry = true
    isRefreshing = true

    try {
      const { data } = await api.post('/auth/refresh')
      const newToken = data.access_token
      localStorage.setItem('access_token', newToken)
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`
      processQueue(null, newToken)
      original.headers.Authorization = `Bearer ${newToken}`
      return api(original)
    } catch (refreshError) {
      processQueue(refreshError, null)
      const hadToken = !!localStorage.getItem('access_token')
      localStorage.removeItem('access_token')
      // Only redirect to login if user was previously authenticated.
      // Anonymous users hitting 401 (e.g. rate-limited endpoints) must not
      // be redirected — that would break the public browsing experience.
      if (hadToken) {
        window.location.href = '/login'
      }
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
