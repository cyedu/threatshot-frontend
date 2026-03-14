import { useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft } from 'lucide-react'
import ThemeToggle from '../ThemeToggle'

export default function LegalLayout({ title, subtitle, lastUpdated, children }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.state?.idx > 0) navigate(-1)
    else navigate('/')
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      {/* Nav */}
      <nav className="border-b border-brand-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Shield className="w-5 h-5 text-brand-accent" />
            <span className="font-bold text-base">
              <span className="text-brand-accent">THREAT</span>SHOT
            </span>
          </button>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-text transition-colors px-3 py-1.5 rounded-md hover:bg-brand-surface"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="border-b border-brand-border bg-brand-surface">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-text">{title}</h1>
          {subtitle && <p className="text-brand-muted mt-2">{subtitle}</p>}
          {lastUpdated && (
            <p className="text-xs text-brand-muted mt-3">Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose-legal space-y-8 text-brand-muted leading-relaxed">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-brand-border px-6 py-6 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <span>© {new Date().getFullYear()} MSInfo Services. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/privacy')} className="hover:text-brand-accent2 transition-colors">Privacy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-brand-accent2 transition-colors">Terms</button>
            <button onClick={() => navigate('/contact')} className="hover:text-brand-accent2 transition-colors">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-brand-text mb-3 pb-2 border-b border-brand-border">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

export function P({ children }) {
  return <p className="text-sm text-brand-muted leading-relaxed">{children}</p>
}

export function UL({ items }) {
  return (
    <ul className="space-y-1.5 pl-4">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-brand-muted flex gap-2">
          <span className="text-brand-accent mt-1 shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
