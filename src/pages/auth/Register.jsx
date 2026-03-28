import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, Loader2, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import api from '../../lib/api'
import ThemeToggle from '../../components/ThemeToggle'

const TERMS_VERSION = 'v1.0-2026-03-19'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPurpose, setShowPurpose] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  const [consent, setConsent] = useState({
    terms: false,      // Terms + Privacy + AUP
    cookies: false,    // Essential cookies
    marketing: false,  // Optional — threat news, product updates
  })

  const requiredConsented = consent.terms && consent.cookies

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const toggleConsent = (key) => {
    setConsent(prev => ({ ...prev, [key]: !prev[key] }))
    setError('')
  }

  const validate = () => {
    if (!form.email.trim()) return 'Email address is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.'
    if (!form.password) return 'Password is required.'
    if (form.password.length < 10) return 'Password must be at least 10 characters.'
    if (!consent.terms) return 'You must accept the Terms of Service, Privacy Policy, and Acceptable Use Policy.'
    if (!consent.cookies) return 'You must acknowledge essential cookie use.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setIsLoading(true)
    setError('')

    try {
      await api.post('/auth/register', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        terms_accepted: true,
      })

      const normalizedEmail = form.email.trim().toLowerCase()
      const consentCalls = [
        api.post('/auth/consent', {
          consent_type: 'register_terms',
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
      ]
      if (consent.marketing) {
        consentCalls.push(
          api.post('/auth/consent', {
            consent_type: 'marketing_communications',
            accepted: true,
            terms_version: TERMS_VERSION,
            email: normalizedEmail,
          })
        )
      }
      await Promise.allSettled(consentCalls)

      setSuccess(true)
    } catch (err) {
      const detail = err.response?.data?.detail
      if (typeof detail === 'string') {
        setError(detail)
      } else if (Array.isArray(detail)) {
        setError(detail[0]?.msg || 'Validation error. Please check your input.')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
          <h2 className="text-xl font-bold text-brand-text">Check your inbox</h2>
          <p className="text-sm text-brand-muted">
            We've sent a verification link to{' '}
            <span className="text-brand-text font-medium">{form.email}</span>.
            Click it to activate your account.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-brand-accent hover:underline"
          >
            Back to sign in
          </button>
        </div>
      </div>
    )
  }

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
        <div className="w-full max-w-sm space-y-5">

          <div>
            <h1 className="text-2xl font-bold text-brand-text">Create account</h1>
            <p className="text-sm text-brand-muted mt-1">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-accent hover:underline">Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-brand-muted mb-1.5">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-accent transition-colors"
              />
              <p className="text-xs text-brand-muted mt-1">
                Used for account access and security alerts only.
              </p>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-brand-muted mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 10 characters"
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
              {form.password && form.password.length < 10 && (
                <p className="text-xs text-amber-500 mt-1">
                  {10 - form.password.length} more character{10 - form.password.length !== 1 ? 's' : ''} needed
                </p>
              )}
            </div>

            {/* ── Collapsibles ── */}
            <div className="space-y-2">
              <Collapsible
                label="Why we collect your email"
                open={showPurpose}
                onToggle={() => setShowPurpose(v => !v)}
              >
                <p>
                  ThreatShot collects <strong className="text-brand-text">only your email address</strong> — no name, phone, or location data.
                  Your email is used for:
                </p>
                <ul className="list-disc pl-4 space-y-1 mt-1">
                  <li>Account login and password recovery</li>
                  <li>Security alerts related to your account</li>
                  <li>Email verification to prevent abuse</li>
                </ul>
                <p className="mt-1">
                  Your password is hashed with bcrypt before storage and is never accessible to anyone, including our team.
                </p>
              </Collapsible>

              <Collapsible
                label="Disclaimer"
                open={showDisclaimer}
                onToggle={() => setShowDisclaimer(v => !v)}
              >
                <p>
                  ThreatShot aggregates threat intelligence from public sources (CERT-IN, CISA, NVD, and others)
                  for <strong className="text-brand-text">defensive and informational purposes only</strong>.
                </p>
                <ul className="list-disc pl-4 space-y-1 mt-1">
                  <li>Data may not be complete, real-time, or error-free.</li>
                  <li>ThreatShot is not liable for decisions made based on this information.</li>
                  <li>This platform must not be used for offensive security operations.</li>
                  <li>Misuse violates our Acceptable Use Policy and may result in account termination.</li>
                </ul>
              </Collapsible>
            </div>

            {/* ── Consent Checkboxes ── */}
            <div className="space-y-3 pt-1">
              {/* 1. Terms */}
              <ConsentCheck
                checked={consent.terms}
                onChange={() => toggleConsent('terms')}
                required
                label={
                  <>
                    I agree to ThreatShot's{' '}
                    <PolicyLink to="/terms-and-conditions">Terms of Service</PolicyLink>,{' '}
                    <PolicyLink to="/privacy">Privacy Policy</PolicyLink>, and{' '}
                    <PolicyLink to="/aup">Acceptable Use Policy</PolicyLink>.
                  </>
                }
              />

              {/* 2. Cookies */}
              <ConsentCheck
                checked={consent.cookies}
                onChange={() => toggleConsent('cookies')}
                required
                label={
                  <>
                    I accept essential cookies used for authentication (session token, CSRF protection) and
                    preference storage (theme). See our{' '}
                    <PolicyLink to="/cookies">Cookie Policy</PolicyLink> for the full list.
                  </>
                }
              />

              {/* 3. Marketing — optional */}
              <ConsentCheck
                checked={consent.marketing}
                onChange={() => toggleConsent('marketing')}
                optional
                label="I'd like to receive threat intelligence updates, security advisories, and product news from ThreatShot. (Optional — you can unsubscribe at any time.)"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !requiredConsented}
              className="w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg px-4 py-2.5 transition-colors mt-2"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Footer links */}
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

/* ── Sub-components ── */

function Collapsible({ label, open, onToggle, children }) {
  return (
    <div className="border border-brand-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-brand-surface/50 transition-colors"
      >
        <span className="text-xs font-semibold text-brand-text uppercase tracking-wide">{label}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-brand-muted shrink-0" />
          : <ChevronDown className="w-4 h-4 text-brand-muted shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-xs text-brand-muted space-y-2 border-t border-brand-border pt-3">
          {children}
        </div>
      )}
    </div>
  )
}

function ConsentCheck({ checked, onChange, label, required, optional }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative mt-0.5 shrink-0">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <div
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
            checked
              ? 'bg-brand-accent border-brand-accent'
              : 'bg-brand-surface border-brand-border group-hover:border-brand-accent'
          }`}
        >
          {checked && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-xs text-brand-muted leading-relaxed">
        {label}{' '}
        {required && <span className="text-red-500">*</span>}
        {optional && <span className="text-brand-muted/60">(optional)</span>}
      </span>
    </label>
  )
}

function PolicyLink({ to, children }) {
  return (
    <Link
      to={to}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-accent hover:underline font-medium"
      onClick={e => e.stopPropagation()}
    >
      {children}
    </Link>
  )
}
