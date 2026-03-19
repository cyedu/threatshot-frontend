import { useState, useEffect } from 'react'
import { X, Cookie } from 'lucide-react'
import api from '../lib/api'

const STORAGE_KEY = 'ts-cookie-consent'
const TERMS_VERSION = 'v1.0-2026-03-19'

/**
 * CookieBanner — shown once per browser on first visit.
 *
 * Essential cookies (auth session, theme preference) cannot be declined — they
 * are strictly necessary for the service to function.
 *
 * Analytics cookies are optional. The user's choice is stored in localStorage
 * and recorded as a permanent tamper-evident consent entry via POST /auth/consent.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Show only if the user has never made a choice
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Small delay so it doesn't flash on initial render
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  if (!visible) return null

  const recordAndClose = async (consentType, accepted) => {
    setSaving(true)
    localStorage.setItem(STORAGE_KEY, consentType)
    setVisible(false)

    // Record in the backend tamper-evident ledger — fire-and-forget
    api.post('/auth/consent', {
      consent_type: consentType,
      accepted,
      terms_version: TERMS_VERSION,
      // no email — user may not be logged in yet
    }).catch(() => {})

    setSaving(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
    >
      <div className="max-w-3xl mx-auto bg-brand-surface border border-brand-border rounded-xl shadow-2xl p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="shrink-0 mt-0.5">
            <Cookie className="w-5 h-5 text-brand-accent" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-brand-text mb-1">
              Cookies &amp; Privacy
            </h2>
            <p className="text-xs text-brand-muted leading-relaxed">
              ThreatShot uses <strong className="text-brand-text">essential cookies</strong> only —
              for your login session and theme preference. We do not use advertising,
              tracking, or fingerprinting cookies. We collect only your email address
              for account purposes and nothing else.{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent hover:underline"
              >
                Privacy Policy
              </a>
              .
            </p>

            {/* Cookie details */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-brand-bg border border-brand-border rounded-lg px-3 py-2">
                <p className="font-medium text-brand-text mb-0.5">Essential (required)</p>
                <p className="text-brand-muted">Login session, CSRF token, theme preference. Cannot be disabled — required for the service to work.</p>
              </div>
              <div className="bg-brand-bg border border-brand-border rounded-lg px-3 py-2">
                <p className="font-medium text-brand-text mb-0.5">Analytics (optional)</p>
                <p className="text-brand-muted">Anonymous page-view counts via Cloudflare Web Analytics. No cross-site tracking or personal data.</p>
              </div>
            </div>
          </div>

          {/* Dismiss — same as "essential only" */}
          <button
            type="button"
            onClick={() => recordAndClose('cookie_essential', true)}
            className="shrink-0 text-brand-muted hover:text-brand-text transition-colors"
            aria-label="Accept essential cookies and close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4 sm:justify-end">
          <button
            type="button"
            onClick={() => recordAndClose('cookie_essential', true)}
            disabled={saving}
            className="px-4 py-2 text-xs font-medium border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-accent transition-colors rounded-lg disabled:opacity-50"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => recordAndClose('cookie_analytics', true)}
            disabled={saving}
            className="px-4 py-2 text-xs font-medium bg-brand-accent hover:bg-brand-accent/90 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            Accept all cookies
          </button>
        </div>

        <p className="text-xs text-brand-muted mt-3 text-center sm:text-right">
          Your choice is recorded as a tamper-evident consent entry under the DPDP Act, 2023.
        </p>
      </div>
    </div>
  )
}
