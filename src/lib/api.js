import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || ''}/api/v1`,
  withCredentials: true, // send httpOnly access_token + refresh_token cookies on every request
  headers: { 'Content-Type': 'application/json' },
})

// ── Anon ID helper — stable UUID per browser, used for rate-limiting anonymous requests ──
export function getAnonId() {
  let id = localStorage.getItem('anon_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('anon_id', id)
  }
  return id
}

// ── Request interceptor — attach anon ID for unauthenticated requests ────────
// The access_token is an httpOnly cookie — the browser sends it automatically.
// We never read or store it in JavaScript.
api.interceptors.request.use((config) => {
  // Only send anon ID when no session cookie is expected (public endpoints).
  // We can't check the httpOnly cookie from JS, so we always send it as a fallback.
  config.headers['X-Anon-Id'] = getAnonId()
  return config
})

// ── Response interceptor — handle 401, attempt token refresh ─────────────
let isRefreshing = false
let refreshQueue = [] // requests waiting while refresh is in flight

function processQueue(error) {
  refreshQueue.forEach((p) => (error ? p.reject(error) : p.resolve()))
  refreshQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Only attempt refresh on 401, skip the refresh endpoint itself and silent session checks
    if (
      error.response?.status !== 401 ||
      original._retry ||
      original.url?.includes('/auth/refresh') ||
      original._silentAuth
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject })
      })
        .then(() => api(original))
        .catch(Promise.reject.bind(Promise))
    }

    original._retry = true
    isRefreshing = true

    try {
      // Backend rotates both cookies in the response — no token handling needed here
      await api.post('/auth/refresh')
      processQueue(null)
      return api(original)
    } catch (refreshError) {
      processQueue(refreshError)
      // Refresh failed — redirect to login only from protected app pages
      const protectedPaths = ['/dashboard', '/admin']
      const isProtected = protectedPaths.some(p => window.location.pathname.startsWith(p))
      if (isProtected) {
        window.location.href = '/login'
      }
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
