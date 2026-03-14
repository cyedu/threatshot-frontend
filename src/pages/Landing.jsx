import { Link } from 'react-router-dom'
import { Shield, Zap, Globe, Lock, TrendingUp, CheckCircle } from 'lucide-react'

const FEATURES = [
  {
    icon: Shield,
    title: 'Threat Intelligence Feed',
    desc: 'Real-time threat data from 7+ sources including CISA, NVD, and OTX — filtered for Indian enterprise context.',
  },
  {
    icon: Zap,
    title: 'IOC Scanner',
    desc: 'Lookup IPs, domains, hashes, and URLs against VirusTotal, AbuseIPDB, and 10+ intel sources instantly.',
  },
  {
    icon: Globe,
    title: 'DNS & Email Security',
    desc: 'Validate SPF, DKIM, DMARC, and DNSSEC with actionable remediation steps. Coming soon.',
  },
  {
    icon: Lock,
    title: 'SBOM Vulnerability Scan',
    desc: 'Upload your software bill of materials and get a CVE risk report in seconds. Coming soon.',
  },
  {
    icon: TrendingUp,
    title: 'Vendor Scorecards',
    desc: 'Assess third-party risk with RBI/SEBI-compliant questionnaires and scoring. Coming soon.',
  },
  {
    icon: CheckCircle,
    title: 'AI Intelligence Blog',
    desc: 'Daily AI-written security briefings relevant to Indian SMEs, NBFCs, and fintech companies.',
  },
]

const PLANS = [
  { name: 'Free', price: '₹0', scans: '10 IOC scans/day', features: ['Threat feed (read-only)', 'IOC scanner', 'Public blog'] },
  { name: 'Starter', price: '₹999/mo', scans: '100 IOC scans/day', features: ['Everything in Free', 'Bulk IOC upload', 'Email digest', 'API access'] },
  { name: 'Professional', price: '₹2,999/mo', scans: '500 IOC scans/day', features: ['Everything in Starter', 'PDF reports', 'Priority support', 'Custom feeds'] },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      {/* Nav */}
      <nav className="border-b border-brand-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand-accent" />
            <span className="font-bold text-lg"><span className="text-brand-accent">THREAT</span>SHOT</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-brand-muted hover:text-brand-text text-sm transition-colors">Sign in</Link>
            <Link
              to="/register"
              className="bg-brand-accent hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-surface border border-brand-border rounded-full px-4 py-1.5 text-xs text-brand-accent2 mb-6">
          <Zap className="w-3 h-3" /> Built for Indian SMEs, NBFCs & Fintech
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Cyber Threat Intelligence<br />
          <span className="text-brand-accent">That Works for You</span>
        </h1>
        <p className="text-brand-muted text-lg max-w-2xl mx-auto mb-8">
          Stop drowning in global threat feeds. ThreatShot surfaces actionable intelligence
          relevant to Indian enterprises — in plain language, in real time.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register"
            className="bg-brand-accent hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start for free — no credit card
          </Link>
          <Link
            to="/login"
            className="border border-brand-border hover:border-brand-accent2 text-brand-muted hover:text-brand-text px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Everything you need to stay ahead of threats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-brand-surface border border-brand-border rounded-lg p-5 space-y-3">
              <f.icon className="w-6 h-6 text-brand-accent" />
              <h3 className="font-semibold text-brand-text">{f.title}</h3>
              <p className="text-brand-muted text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Simple, transparent pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`bg-brand-surface border rounded-lg p-6 space-y-4 ${
                i === 1 ? 'border-brand-accent ring-1 ring-brand-accent' : 'border-brand-border'
              }`}
            >
              {i === 1 && (
                <span className="text-xs bg-brand-accent text-white px-2 py-0.5 rounded-full font-medium">
                  Most popular
                </span>
              )}
              <div>
                <h3 className="font-bold text-brand-text text-lg">{plan.name}</h3>
                <p className="text-2xl font-bold text-brand-accent mt-1">{plan.price}</p>
                <p className="text-brand-muted text-sm">{plan.scans}</p>
              </div>
              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-brand-muted">
                    <CheckCircle className="w-4 h-4 text-brand-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`block text-center py-2 rounded-md text-sm font-medium transition-colors ${
                  i === 1
                    ? 'bg-brand-accent hover:bg-red-700 text-white'
                    : 'border border-brand-border hover:border-brand-accent2 text-brand-muted hover:text-brand-text'
                }`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-border px-6 py-8 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-brand-muted">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-accent" />
            <span><span className="text-brand-accent font-semibold">THREAT</span>SHOT</span>
          </div>
          <p>© {new Date().getFullYear()} ThreatShot. Built for Indian cyber defenders.</p>
        </div>
      </footer>
    </div>
  )
}
