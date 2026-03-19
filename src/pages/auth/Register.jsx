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

  // Three separate consent checkboxes
  const [consent, setConsent] = useState({
    terms: false,       // Terms + Privacy + AUP
    dataPurpose: false, // Minimal data collection acknowledgment
    dpdp: false,        // DPDP Act 2023 explicit consent
  })

  const allConsented = consent.terms && consent.dataPurpose && consent.dpdp

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
    if (!consent.dataPurpose) return 'You must acknowledge how your data is used.'
    if (!consent.dpdp) return 'You must provide explicit consent under the DPDP Act, 2023.'
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

      // Record consent permanently — fire and await for UX confirmation
      await api.post('/auth/consent', {
        consent_type: 'register_terms',
        accepted: true,
        terms_version: TERMS_VERSION,
        email: form.email.trim().toLowerCase(),
      })

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
          <p className="text-xs text-brand-muted border border-brand-border rounded-lg px-4 py-3 text-left">
            Your consent has been recorded as a tamper-evident record under the DPDP Act, 2023.
            ThreatShot stores only your email address — no name or other personal data was collected.
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
        <div className="w-full max-w-sm space-y-6">

          <div>
            <h1 className="text-2xl font-bold text-brand-text">Create account</h1>
            <p className="text-sm text-brand-muted mt-1">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-accent hover:underline">Sign in</Link>
            </p>
          </div>

          {/* ── Purpose Disclosure ── */}
          <div className="border border-brand-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPurpose(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-brand-surface/50 transition-colors"
            >
              <span className="text-xs font-semibold text-brand-text uppercase tracking-wide">
                Why we collect your data
              </span>
              {showPurpose
                ? <ChevronUp className="w-4 h-4 text-brand-muted shrink-0" />
                : <ChevronDown className="w-4 h-4 text-brand-muted shrink-0" />}
            </button>
            {showPurpose && (
              <div className="px-4 pb-4 text-xs text-brand-muted space-y-2 border-t border-brand-border">
                <p className="pt-3">
                  ThreatShot collects <strong className="text-brand-text">only your email address</strong>.
                  We do not collect your name, phone number, location, or any other personal data.
                </p>
                <p>Your email is used exclusively for:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Account authentication and password recovery</li>
                  <li>Security alerts directly related to your account</li>
                  <li>Email verification to prevent account abuse</li>
                </ul>
                <p>
                  We do not use your email for marketing, advertising, or share it with
                  third parties. Your password is hashed using bcrypt before storage —
                  we never store it in plaintext.
                </p>
              </div>
            )}
          </div>

          {/* ── Disclaimer ── */}
          <div className="border border-brand-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowDisclaimer(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-brand-surface/50 transition-colors"
            >
              <span className="text-xs font-semibold text-brand-text uppercase tracking-wide">
                Disclaimer
              </span>
              {showDisclaimer
                ? <ChevronUp className="w-4 h-4 text-brand-muted shrink-0" />
                : <ChevronDown className="w-4 h-4 text-brand-muted shrink-0" />}
            </button>
            {showDisclaimer && (
              <div className="px-4 pb-4 text-xs text-brand-muted space-y-2 border-t border-brand-border">
                <p className="pt-3">
                  ThreatShot aggregates threat intelligence from public sources (CERT-IN, CISA,
                  NVD, and others) for <strong className="text-brand-text">defensive and informational purposes only</strong>.
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Data may not be complete, real-time, or free from errors.</li>
                  <li>ThreatShot is not liable for decisions made based on this information.</li>
                  <li>This platform must not be used to conduct offensive security operations.</li>
                  <li>Misuse violates our Acceptable Use Policy and may result in account termination.</li>
                </ul>
                <p>
                  MSInfo Services Pvt. Ltd. operates ThreatShot and is subject to Indian law,
                  including the IT Act 2000 and DPDP Act 2023.
                </p>
              </div>
            )}
          </div>

          {/* ── Registration Form ── */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email — the only personal data we collect */}
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
                This is the only personal data ThreatShot collects.
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

            {/* ── Consent Checkboxes ── */}
            <div className="space-y-3 pt-1">
              <p className="text-xs font-semibold text-brand-text uppercase tracking-wide">
                Required consents
              </p>

              {/* 1. Terms + Privacy + AUP */}
              <ConsentCheck
                checked={consent.terms}
                onChange={() => toggleConsent('terms')}
                label={
                  <>
                    I have read and agree to ThreatShot's{' '}
                    <PolicyLink to="/terms-and-conditions">Terms of Service</PolicyLink>,{' '}
                    <PolicyLink to="/privacy">Privacy Policy</PolicyLink>, and{' '}
                    <PolicyLink to="/aup">Acceptable Use Policy</PolicyLink>.
                  </>
                }
              />

              {/* 2. Data purpose */}
              <ConsentCheck
                checked={consent.dataPurpose}
                onChange={() => toggleConsent('dataPurpose')}
                label="I understand ThreatShot collects only my email address for authentication and account security. No other personal data is collected."
              />

              {/* 3. DPDP explicit consent */}
              <ConsentCheck
                checked={consent.dpdp}
                onChange={() => toggleConsent('dpdp')}
                label="I give explicit consent to ThreatShot (MSInfo Services Pvt. Ltd.) to process my email address for the stated purposes under the Digital Personal Data Protection Act, 2023. I understand I may withdraw consent by deleting my account."
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
              disabled={isLoading || !allConsented}
              className="w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg px-4 py-2.5 transition-colors mt-2"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="text-xs text-brand-muted text-center">
            Your consent is recorded as a tamper-evident, permanent ledger entry with your
            IP address and timestamp under the DPDP Act, 2023.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Shared sub-components ── */

function ConsentCheck({ checked, onChange, label }) {
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
        {label} <span className="text-red-500">*</span>
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
