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
  const [termsAcknowledged, setTermsAcknowledged] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!termsAcknowledged) {
      setLocalError('Please acknowledge the Terms of Service and Privacy Policy to continue.')
      return
    }

    const ok = await login(email.trim().toLowerCase(), password)
    if (ok) {
      // Record login acknowledgment — fire-and-forget, non-blocking
      api.post('/auth/consent', {
        consent_type: 'login_ack',
        accepted: true,
        terms_version: TERMS_VERSION,
        email: email.trim().toLowerCase(),
      }).catch(() => {})

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
        <div className="w-full max-w-sm">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-brand-text">Sign in</h1>
            <p className="text-sm text-brand-muted mt-1">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-accent hover:underline">
                Create one
              </Link>
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

            {/* Terms acknowledgment — required to log in */}
            <div className="pt-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={termsAcknowledged}
                    onChange={e => { setTermsAcknowledged(e.target.checked); setLocalError('') }}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      termsAcknowledged
                        ? 'bg-brand-accent border-brand-accent'
                        : 'bg-brand-surface border-brand-border group-hover:border-brand-accent'
                    }`}
                  >
                    {termsAcknowledged && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-brand-muted leading-relaxed">
                  I acknowledge ThreatShot's{' '}
                  <Link to="/terms-and-conditions" target="_blank" rel="noopener noreferrer"
                    className="text-brand-accent hover:underline font-medium" onClick={e => e.stopPropagation()}>
                    Terms of Service
                  </Link>
                  ,{' '}
                  <Link to="/privacy" target="_blank" rel="noopener noreferrer"
                    className="text-brand-accent hover:underline font-medium" onClick={e => e.stopPropagation()}>
                    Privacy Policy
                  </Link>
                  , and{' '}
                  <Link to="/aup" target="_blank" rel="noopener noreferrer"
                    className="text-brand-accent hover:underline font-medium" onClick={e => e.stopPropagation()}>
                    Acceptable Use Policy
                  </Link>
                  . My acknowledgment is recorded with a timestamp per DPDP Act, 2023.{' '}
                  <span className="text-red-500">*</span>
                </span>
              </label>
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
              disabled={isLoading || !termsAcknowledged}
              className="w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg px-4 py-2.5 transition-colors mt-2"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="text-xs text-brand-muted text-center mt-6">
            Your login acknowledgment is recorded electronically with your IP address and
            timestamp as a tamper-evident consent record.
          </p>
        </div>
      </div>
    </div>
  )
}
