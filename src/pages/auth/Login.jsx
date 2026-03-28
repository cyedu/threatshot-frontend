import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, Loader2, Cookie, MapPin, Clock, Monitor } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import ThemeToggle from '../../components/ThemeToggle'
import api from '../../lib/api'

const TERMS_VERSION = 'v1.0-2026-03-19'

const COLLECTED_ITEMS = [
  { icon: Cookie,  label: 'Session cookie',    desc: 'httpOnly, secure — keeps you signed in' },
  { icon: MapPin,  label: 'IP address',        desc: 'Logged with each consent event' },
  { icon: Clock,   label: 'Timestamp',         desc: 'Date & time of sign-in recorded' },
  { icon: Monitor, label: 'Browser metadata',  desc: 'User-agent for security audit trail' },
]

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!acknowledged) {
      setLocalError('Please acknowledge the data collection notice to continue.')
      return
    }

    const ok = await login(email.trim().toLowerCase(), password)
    if (ok) {
      const normalizedEmail = email.trim().toLowerCase()
      // Record login acknowledgment + cookie consent — both fire-and-forget
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

            {/* ── Data collection notice card ── */}
            <div className="rounded-xl border border-brand-border bg-brand-surface overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-brand-border flex items-center gap-2">
                <Cookie className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                <span className="text-xs font-semibold text-brand-text uppercase tracking-wide">
                  What we collect when you sign in
                </span>
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-2 gap-px bg-brand-border">
                {COLLECTED_ITEMS.map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="bg-brand-surface px-3 py-2.5 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3 h-3 text-brand-accent shrink-0" />
                      <span className="text-xs font-medium text-brand-text">{label}</span>
                    </div>
                    <p className="text-[11px] text-brand-muted leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Policy links */}
              <div className="px-4 py-2.5 border-t border-brand-border flex flex-wrap gap-x-3 gap-y-1">
                {[
                  { to: '/cookies', label: 'Cookie Policy' },
                  { to: '/privacy', label: 'Privacy Policy' },
                  { to: '/terms-and-conditions', label: 'Terms of Service' },
                  { to: '/aup', label: 'Acceptable Use' },
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-[11px] text-brand-accent hover:underline"
                  >
                    {label} ↗
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Single acknowledgment checkbox ── */}
            <label className="flex items-start gap-3 cursor-pointer group pt-1">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={e => { setAcknowledged(e.target.checked); setLocalError('') }}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  acknowledged
                    ? 'bg-brand-accent border-brand-accent'
                    : 'bg-brand-surface border-brand-border group-hover:border-brand-accent'
                }`}>
                  {acknowledged && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-brand-muted leading-relaxed">
                I acknowledge the above data collection and agree to ThreatShot's policies.
                This acknowledgment — along with my IP address and timestamp — is permanently
                recorded per the <span className="text-brand-text font-medium">DPDP Act, 2023</span>.{' '}
                <span className="text-red-500">*</span>
              </span>
            </label>

            {/* Error */}
            {displayError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                {displayError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !acknowledged}
              className="w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg px-4 py-2.5 transition-colors"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}
