import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Zap, Globe, Lock, TrendingUp, CheckCircle, Sun, Moon } from 'lucide-react'

const FEATURES = [
  {
    icon: Shield,
    title: 'Threat Intelligence Feed',
    desc: 'Real-time threat data from 7+ sources including CISA, NVD, and OTX — filtered for Indian enterprise context.',
    href: '/threat-feed',
  },
  {
    icon: Zap,
    title: 'IOC Scanner',
    desc: 'Lookup IPs, domains, hashes, and URLs against VirusTotal, AbuseIPDB, and 10+ intel sources instantly.',
    href: '/login',
  },
  {
    icon: Globe,
    title: 'DNS & Email Security',
    desc: 'Validate SPF, DKIM, DMARC, and DNSSEC with actionable remediation steps. Coming soon.',
    href: '/login',
  },
  {
    icon: Lock,
    title: 'SBOM Vulnerability Scan',
    desc: 'Upload your software bill of materials and get a CVE risk report in seconds. Coming soon.',
    href: '/login',
  },
  {
    icon: TrendingUp,
    title: 'Vendor Scorecards',
    desc: 'Assess third-party risk with RBI/SEBI-compliant questionnaires and scoring. Coming soon.',
    href: '/login',
  },
  {
    icon: CheckCircle,
    title: 'Intelligence Blog',
    desc: 'Security briefings relevant to Indian SMEs, NBFCs, and fintech companies.',
    href: '/blog',
  },
]

const PLANS = [
  { name: 'Free', price: '₹0', scans: '10 IOC scans/day', features: ['Threat feed (read-only)', 'IOC scanner', 'Public blog'] },
  { name: 'Starter', price: '₹999/mo', scans: '100 IOC scans/day', features: ['Everything in Free', 'Bulk IOC upload', 'Email digest', 'API access'] },
  { name: 'Professional', price: '₹2,999/mo', scans: '500 IOC scans/day', features: ['Everything in Starter', 'PDF reports', 'Priority support', 'Custom feeds'] },
]

export default function Landing() {
  const [light, setLight] = useState(false)

  // Theme-aware class helpers
  const t = {
    page:    light ? 'bg-[#F6F8FA] text-[#1F2328]'    : 'bg-brand-bg text-brand-text',
    nav:     light ? 'border-[#D0D7DE]'                : 'border-brand-border',
    surface: light ? 'bg-white border-[#D0D7DE]'       : 'bg-brand-surface border-brand-border',
    muted:   light ? 'text-[#656D76]'                  : 'text-brand-muted',
    text:    light ? 'text-[#1F2328]'                  : 'text-brand-text',
    navLink: light ? 'text-[#656D76] hover:text-[#1F2328]' : 'text-brand-muted hover:text-brand-text',
    heroBg:  light ? 'bg-white border-[#D0D7DE]'       : 'bg-brand-surface border-brand-border',
    toggle:  light ? 'bg-[#E8ECEF] hover:bg-[#D0D7DE] text-[#1F2328]' : 'bg-brand-surface hover:bg-brand-border text-brand-muted',
    footer:  light ? 'border-[#D0D7DE] text-[#656D76]' : 'border-brand-border text-brand-muted',
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${t.page}`}>

      {/* Nav */}
      <nav className={`border-b ${t.nav} px-6 py-4 sticky top-0 z-50 backdrop-blur-sm ${light ? 'bg-[#F6F8FA]/90' : 'bg-brand-bg/90'}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand-accent" />
            <span className="font-bold text-lg">
              <span className="text-brand-accent">THREAT</span>
              <span className={t.text}>SHOT</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/blog" className={`text-sm font-medium transition-colors ${t.navLink}`}>Blog</Link>
            <Link to="/threat-feed" className={`text-sm font-medium transition-colors ${t.navLink}`}>Threat News</Link>
            <Link to="/cve" className={`text-sm font-medium transition-colors ${t.navLink}`}>CVE Search</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => setLight(l => !l)}
              title={light ? 'Switch to dark mode' : 'Switch to light mode'}
              className={`p-2 rounded-md transition-colors ${t.toggle}`}
              aria-label="Toggle theme"
            >
              {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <Link to="/login" className={`text-sm transition-colors px-3 py-1.5 ${t.navLink}`}>
              Sign in
            </Link>
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
        <div className={`inline-flex items-center gap-2 ${t.heroBg} border rounded-full px-4 py-1.5 text-xs text-brand-accent2 mb-6`}>
          <Zap className="w-3 h-3" /> Built for Indian SMEs, NBFCs &amp; Fintech
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Cyber Threat Intelligence<br />
          <span className="text-brand-accent">That Works for You</span>
        </h1>
        <p className={`${t.muted} text-lg max-w-2xl mx-auto mb-8`}>
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
            className={`border ${light ? 'border-[#D0D7DE] hover:border-[#0550AE]' : 'border-brand-border hover:border-brand-accent2'} ${t.muted} hover:text-brand-accent2 px-6 py-3 rounded-lg font-medium transition-colors`}
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className={`text-2xl font-bold text-center mb-10 ${t.text}`}>
          Everything you need to stay ahead of threats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <Link
              key={f.title}
              to={f.href}
              className={`group block border rounded-lg p-5 space-y-3 transition-all duration-200
                ${t.surface}
                hover:border-brand-accent hover:shadow-lg hover:shadow-brand-accent/10
                hover:-translate-y-1`}
            >
              <f.icon className="w-6 h-6 text-brand-accent transition-transform duration-200 group-hover:scale-110" />
              <h3 className={`font-semibold ${t.text}`}>{f.title}</h3>
              <p className={`${t.muted} text-sm`}>{f.desc}</p>
              <span className="inline-flex items-center gap-1 text-xs text-brand-accent2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className={`text-2xl font-bold text-center mb-10 ${t.text}`}>Simple, transparent pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`border rounded-lg p-6 space-y-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                i === 1
                  ? 'border-brand-accent ring-1 ring-brand-accent hover:shadow-brand-accent/20'
                  : `${light ? 'border-[#D0D7DE] hover:shadow-[#D0D7DE]/50' : 'border-brand-border hover:shadow-brand-border/50'}`
              } ${light ? 'bg-white' : 'bg-brand-surface'}`}
            >
              {i === 1 && (
                <span className="text-xs bg-brand-accent text-white px-2 py-0.5 rounded-full font-medium">
                  Most popular
                </span>
              )}
              <div>
                <h3 className={`font-bold text-lg ${t.text}`}>{plan.name}</h3>
                <p className="text-2xl font-bold text-brand-accent mt-1">{plan.price}</p>
                <p className={`text-sm ${t.muted}`}>{plan.scans}</p>
              </div>
              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-center gap-2 text-sm ${t.muted}`}>
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
                    : `border ${light ? 'border-[#D0D7DE] hover:border-brand-accent2' : 'border-brand-border hover:border-brand-accent2'} ${t.muted} hover:text-brand-accent2`
                }`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${t.footer} px-6 py-8 mt-8`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-accent" />
            <span><span className="text-brand-accent font-semibold">THREAT</span>SHOT</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/blog" className={`hover:text-brand-accent2 transition-colors ${t.muted}`}>Blog</Link>
            <Link to="/threat-feed" className={`hover:text-brand-accent2 transition-colors ${t.muted}`}>Threat News</Link>
            <Link to="/cve" className={`hover:text-brand-accent2 transition-colors ${t.muted}`}>CVE Search</Link>
          </div>
          <p className={t.muted}>© {new Date().getFullYear()} ThreatShot. Built for Indian cyber defenders.</p>
        </div>
      </footer>
    </div>
  )
}
