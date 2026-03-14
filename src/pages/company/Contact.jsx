import { Link } from 'react-router-dom'
import { Shield, ArrowLeft, Mail, MessageSquare, AlertTriangle, CreditCard } from 'lucide-react'

const CONTACTS = [
  {
    icon: Mail,
    title: 'General Enquiries',
    email: 'hello@threatshot.in',
    desc: 'Product questions, partnerships, and anything else.',
  },
  {
    icon: CreditCard,
    title: 'Sales & Billing',
    email: 'sales@threatshot.in',
    desc: 'Enterprise plans, invoices, and billing issues.',
  },
  {
    icon: AlertTriangle,
    title: 'Security Reports',
    email: 'security@threatshot.in',
    desc: 'Responsible disclosure of vulnerabilities. See our Security Policy.',
    link: '/security',
    linkLabel: 'Security Policy',
  },
  {
    icon: MessageSquare,
    title: 'Support',
    email: 'support@threatshot.in',
    desc: 'Technical issues, account help, and feature requests.',
  },
]

export default function Contact() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">

      {/* Nav */}
      <nav className="border-b border-brand-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-accent" />
            <span className="font-bold text-base">
              <span className="text-brand-accent">THREAT</span>SHOT
            </span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-text transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="border-b border-brand-border bg-brand-surface">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-text">Contact Us</h1>
          <p className="text-brand-muted mt-2">
            We're a small team — we read every email and respond as fast as we can (typically within one business day).
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CONTACTS.map(c => (
            <div key={c.title} className="bg-brand-surface border border-brand-border rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2">
                <c.icon className="w-5 h-5 text-brand-accent" />
                <h2 className="font-semibold text-brand-text">{c.title}</h2>
              </div>
              <p className="text-brand-muted text-sm leading-relaxed">{c.desc}</p>
              {c.link && (
                <Link to={c.link} className="text-xs text-brand-accent2 hover:underline block">
                  {c.linkLabel} →
                </Link>
              )}
              <a
                href={`mailto:${c.email}`}
                className="inline-flex items-center gap-1.5 text-sm text-brand-accent2 hover:underline font-medium"
              >
                <Mail className="w-3.5 h-3.5" />
                {c.email}
              </a>
            </div>
          ))}
        </div>

        {/* Enterprise */}
        <div className="bg-brand-accent2/5 border border-brand-accent2/30 rounded-xl p-6 space-y-3">
          <h2 className="font-semibold text-brand-text">Enterprise & Custom Deployments</h2>
          <p className="text-brand-muted text-sm leading-relaxed">
            Looking for SOAR integration, ITSM connectivity, custom threat feeds, or an on-premise deployment? Our
            enterprise team works directly with your security and procurement teams to scope and deliver a tailored
            solution.
          </p>
          <a
            href="mailto:sales@threatshot.in"
            className="inline-block bg-brand-accent2 hover:bg-[#2d5f82] text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Contact enterprise sales
          </a>
        </div>

        {/* Company address */}
        <div className="border-t border-brand-border pt-8 space-y-2">
          <h2 className="font-semibold text-brand-text text-sm">MSInfo Services</h2>
          <p className="text-brand-muted text-sm">India</p>
          <p className="text-brand-muted text-xs mt-1 italic">Modernising cyber services</p>
        </div>

        {/* Legal quick links */}
        <div className="flex flex-wrap gap-4 text-xs text-brand-muted border-t border-brand-border pt-6">
          <Link to="/privacy" className="hover:text-brand-accent2 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-brand-accent2 transition-colors">Terms of Service</Link>
          <Link to="/security" className="hover:text-brand-accent2 transition-colors">Security Policy</Link>
          <Link to="/aup" className="hover:text-brand-accent2 transition-colors">Acceptable Use</Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-brand-border px-6 py-6 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <span>© {new Date().getFullYear()} MSInfo Services. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-brand-accent2 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-brand-accent2 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-brand-accent2 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
