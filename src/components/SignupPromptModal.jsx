/**
 * SignupPromptModal — shown when anonymous users try to download reports.
 * Offers two CTAs: Sign Up (primary) and Log In (secondary).
 */

import { useNavigate } from 'react-router-dom'
import { X, Lock, Zap } from 'lucide-react'

export default function SignupPromptModal({ isOpen, onClose, feature = 'download reports' }) {
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-sm bg-brand-surface border border-brand-border rounded-2xl shadow-2xl p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-muted hover:text-brand-text transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-accent2/15 border border-brand-accent2/30 mx-auto mb-4">
          <Lock className="w-5 h-5 text-brand-accent2" />
        </div>

        <h2 className="text-base font-semibold text-brand-text text-center mb-1">
          Create a free account to {feature}
        </h2>
        <p className="text-xs text-brand-muted text-center mb-5">
          Sign up in seconds — no credit card required.
        </p>

        {/* Benefits */}
        <ul className="space-y-2 mb-6">
          {[
            'Download CSV & PDF reports',
            'Unlimited CVE searches',
            'IOC scanning history',
            'SBOM vulnerability reports',
          ].map(item => (
            <li key={item} className="flex items-center gap-2 text-xs text-brand-muted">
              <Zap className="w-3.5 h-3.5 text-brand-accent2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <button
          onClick={() => { onClose(); navigate('/register') }}
          className="w-full py-2.5 rounded-lg bg-brand-accent2 hover:bg-brand-accent2/90 text-white text-sm font-semibold transition-colors mb-2"
        >
          Create free account
        </button>
        <button
          onClick={() => { onClose(); navigate('/login') }}
          className="w-full py-2 rounded-lg border border-brand-border hover:border-brand-accent2/60 text-brand-muted hover:text-brand-text text-sm transition-colors"
        >
          Log in
        </button>
      </div>
    </div>
  )
}
