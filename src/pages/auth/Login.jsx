import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import ThemeToggle from '../../components/ThemeToggle'
import api from '../../lib/api'

const TERMS_VERSION = 'v1.0-2026-03-19'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    const ok = await login(email.trim().toLowerCase(), password)
    if (ok) {
      const normalizedEmail = email.trim().toLowerCase()
      // Silent consent record — no user action needed, already captured at registration
      Promise.allSettled([
        api.post('/auth/consent', {
          consent_type: 'login_ack',
          accepted: true,
          terms_version: TERMS_VERSION,
          email: normalizedEmail,
        }),
        api.post('/auth/consent', {
          consent_type: 'cookie_essential',
          accepted: true,
          terms_version: TERMS_VERSION,
          email: normalizedEmail,
        }),
      ])
      navigate('/dashboard')
    }
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Nav */}
      <nav className="border-b border-brand-border px-6 py-4">
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="w-5 h-5 text-brand-accent" />
            <span className="font-bold text-base">
              <span className="text-brand-accent">THREAT</span>SHOT
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">

          <div>
            <h1 className="text-2xl font-bold text-brand-text">Sign in</h1>
            <p className="text-sm text-brand-muted mt-1">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-accent hover:underline">Create one</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-brand-muted mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => { setEmail(e.target.value); setLocalError('') }}
                placeholder="you@company.com"
                className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-brand-muted">
                  Password <span className="text-red-500">*</span>
                </label>
                <Link to="/forgot-password" className="text-xs text-brand-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => { setPassword(e.target.value); setLocalError('') }}
                  placeholder="••••••••••"
                  className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2.5 pr-10 text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-brand-muted hover:text-brand-text transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {displayError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                {displayError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg px-4 py-2.5 transition-colors"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Policy links — compact footer */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
            {[
              { to: '/privacy', label: 'Privacy Policy' },
              { to: '/terms-and-conditions', label: 'Terms' },
              { to: '/cookies', label: 'Cookie Policy' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-brand-muted hover:text-brand-accent transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
