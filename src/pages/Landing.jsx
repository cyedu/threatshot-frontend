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
  {
    name: 'Free',
    price: '₹0',
    scans: '10 IOC scans/day',
    features: ['Threat feed (read-only)', 'IOC scanner', 'Public blog', 'CVE search'],
    popular: false,
    cta: 'Get started',
    href: '/register',
  },
  {
    name: 'Starter',
    price: '₹999/mo',
    scans: '100 IOC scans/day',
    features: ['Everything in Free', 'Bulk IOC upload', 'Email digest', 'API access'],
    popular: false,
    cta: 'Get started',
    href: '/register',
  },
  {
    name: 'Professional',
    price: '₹2,999/mo',
    scans: '500 IOC scans/day',
    features: [
      'Everything in Starter',
      'PDF reports',
      'Priority support',
      'Custom feeds',
      'CERT-IN alerts via email (structured format)',
    ],
    popular: true,
    cta: 'Get started',
    href: '/register',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    scans: 'Unlimited access',
    features: [
      'Everything in Professional',
      'SOAR integration',
      'ITSM integration (Jira, ServiceNow)',
      'Dedicated account manager',
      'SLA-backed support',
      'Custom onboarding',
    ],
    popular: false,
    cta: 'Contact us',
    href: 'mailto:sales@threatshot.in',
  },
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
        <h2 className={`text-2xl font-bold text-center mb-2 ${t.text}`}>Simple, transparent pricing</h2>
        <p className={`text-center text-sm mb-10 ${t.muted}`}>Scale from free to enterprise — no surprise charges.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col border rounded-lg p-6 space-y-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                plan.popular
                  ? 'border-brand-accent ring-1 ring-brand-accent hover:shadow-brand-accent/20'
                  : plan.name === 'Enterprise'
                  ? `${light ? 'border-[#0550AE]/40 bg-[#F0F6FF]' : 'border-brand-accent2/40 bg-brand-accent2/5'}`
                  : `${light ? 'border-[#D0D7DE] bg-white hover:shadow-[#D0D7DE]/50' : 'border-brand-border bg-brand-surface'}`
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-brand-accent text-white px-3 py-0.5 rounded-full font-medium whitespace-nowrap">
                  Most popular
                </span>
              )}
              {plan.name === 'Enterprise' && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-0.5 rounded-full font-medium whitespace-nowrap ${light ? 'bg-[#0550AE] text-white' : 'bg-brand-accent2 text-white'}`}>
                  For teams
                </span>
              )}
              <div>
                <h3 className={`font-bold text-lg ${t.text}`}>{plan.name}</h3>
                <p className={`text-2xl font-bold mt-1 ${plan.name === 'Enterprise' ? 'text-brand-accent2' : 'text-brand-accent'}`}>
                  {plan.price}
                </p>
                <p className={`text-sm ${t.muted}`}>{plan.scans}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${t.muted}`}>
                    <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${plan.name === 'Enterprise' ? 'text-brand-accent2' : 'text-brand-success'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.href}
                className={`block text-center py-2 rounded-md text-sm font-medium transition-colors ${
                  plan.popular
                    ? 'bg-brand-accent hover:bg-red-700 text-white'
                    : plan.name === 'Enterprise'
                    ? `${light ? 'bg-[#0550AE] hover:bg-[#033D8B] text-white' : 'bg-brand-accent2 hover:bg-[#2d5f82] text-white'}`
                    : `border ${light ? 'border-[#D0D7DE] hover:border-brand-accent2' : 'border-brand-border hover:border-brand-accent2'} ${t.muted} hover:text-brand-accent2`
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${t.footer} px-6 py-12 mt-8`}>
        <div className="max-w-6xl mx-auto">
          {/* Top row — logo + columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-accent" />
                <span className="font-bold">
                  <span className="text-brand-accent">THREAT</span>
                  <span className={t.text}>SHOT</span>
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${t.muted}`}>
                Cyber threat intelligence built for Indian SMEs, NBFCs, and fintech.
              </p>
              <p className={`text-xs ${t.muted} italic`}>by MSInfo Services</p>
            </div>

            {/* Product */}
            <div className="space-y-3">
              <h3 className={`text-xs font-semibold uppercase tracking-wide ${t.text}`}>Product</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Threat News', to: '/threat-feed' },
                  { label: 'IOC Scanner', to: '/login' },
                  { label: 'CVE Search', to: '/cve' },
                  { label: 'Intelligence Blog', to: '/blog' },
                ].map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className={`text-xs hover:text-brand-accent2 transition-colors ${t.muted}`}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h3 className={`text-xs font-semibold uppercase tracking-wide ${t.text}`}>Company</h3>
              <ul className="space-y-2">
                {[
                  { label: 'About', to: '/about' },
                  { label: 'Contact', to: '/contact' },
                  { label: 'Blog', to: '/blog' },
                ].map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className={`text-xs hover:text-brand-accent2 transition-colors ${t.muted}`}>{l.label}</Link>
                  </li>
                ))}
                <li>
                  <a href="mailto:sales@threatshot.in" className={`text-xs hover:text-brand-accent2 transition-colors ${t.muted}`}>Enterprise Sales</a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h3 className={`text-xs font-semibold uppercase tracking-wide ${t.text}`}>Legal</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Privacy Policy', to: '/privacy' },
                  { label: 'Terms of Service', to: '/terms' },
                  { label: 'Refund Policy', to: '/refunds' },
                  { label: 'Cookie Policy', to: '/cookies' },
                  { label: 'Acceptable Use', to: '/aup' },
                  { label: 'Security Policy', to: '/security' },
                ].map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className={`text-xs hover:text-brand-accent2 transition-colors ${t.muted}`}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className={`border-t ${light ? 'border-[#D0D7DE]' : 'border-brand-border'} pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${t.muted}`}>
            <span>© {new Date().getFullYear()} MSInfo Services. All rights reserved.</span>
            <span className="italic">modernising cyber services</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
