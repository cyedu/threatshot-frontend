import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Zap, Globe, Lock, TrendingUp, CheckCircle, Menu, X } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import NewsTicker from '../components/NewsTicker'
import { useSEO } from '../hooks/useSEO'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useSEO({
    title: 'Cyber Threat Intelligence for Indian SMEs & Fintechs',
    description:
      'ThreatShot delivers real-time threat feeds, CVE search, IOC scanning, and DNS security tailored for Indian SMEs, NBFCs, and fintech companies. Stay ahead of attackers.',
    keywords:
      'cyber threat intelligence India, CVE database, IOC scanner, threat feed, CERT-IN, CISA KEV, vulnerability management, Indian cybersecurity, NBFC security, fintech security',
    canonical: 'https://threatshot.in/',
    structuredData: [
      {
        '@type': 'Organization',
        '@id': 'https://threatshot.in/#organization',
        name: 'ThreatShot',
        url: 'https://threatshot.in',
        logo: { '@type': 'ImageObject', url: 'https://threatshot.in/favicon.svg' },
        description:
          'Cyber threat intelligence platform for Indian SMEs, NBFCs, and fintech. Operated by MSInfo Services.',
        address: { '@type': 'PostalAddress', addressCountry: 'IN' },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://threatshot.in/#website',
        url: 'https://threatshot.in',
        name: 'ThreatShot',
        publisher: { '@id': 'https://threatshot.in/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: 'https://threatshot.in/cve?q={search_term_string}' },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  })

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text transition-colors duration-200">

      {/* Nav */}
      <nav className="border-b border-brand-border px-4 md:px-6 py-4 sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Shield className="w-6 h-6 text-brand-accent" />
            <span className="font-bold text-lg">
              <span className="text-brand-accent">THREAT</span>
              <span className="text-brand-text">SHOT</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/blog" className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors">Blog</Link>
            <Link to="/threat-feed" className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors">Threat News</Link>
            <Link to="/cve" className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors">CVE Search</Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="hidden sm:block text-sm text-brand-muted hover:text-brand-text transition-colors px-3 py-1.5">
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-brand-accent hover:bg-red-700 text-white px-3 md:px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
            >
              <span className="hidden sm:inline">Get started free</span>
              <span className="sm:hidden">Sign up</span>
            </Link>
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              className="md:hidden p-1.5 rounded-md text-brand-muted hover:text-brand-text hover:bg-brand-surface transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-brand-border mt-4 pt-4 space-y-1 max-w-6xl mx-auto">
            {[
              { to: '/blog', label: 'Blog' },
              { to: '/threat-feed', label: 'Threat News' },
              { to: '/cve', label: 'CVE Search' },
              { to: '/login', label: 'Sign in' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-md text-sm text-brand-muted hover:text-brand-text hover:bg-brand-surface transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* News ticker */}
      <NewsTicker />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-surface border border-brand-border rounded-full px-4 py-1.5 text-xs text-brand-accent2 mb-6">
          <Zap className="w-3 h-3" /> Built for Indian SMEs, NBFCs &amp; Fintech
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 md:mb-6 leading-tight">
          Cyber Threat Intelligence<br className="hidden sm:block" />{' '}
          <span className="text-brand-accent">That Works for You</span>
        </h1>
        <p className="text-brand-muted text-base md:text-lg max-w-2xl mx-auto mb-8">
          Stop drowning in global threat feeds. ThreatShot surfaces actionable intelligence
          relevant to Indian enterprises — in plain language, in real time.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
          <Link
            to="/register"
            className="bg-brand-accent hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start for free — no credit card
          </Link>
          <Link
            to="/login"
            className="border border-brand-border hover:border-brand-accent2 text-brand-muted hover:text-brand-accent2 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <h2 className="text-2xl font-bold text-center text-brand-text mb-10">
          Everything you need to stay ahead of threats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <Link
              key={f.title}
              to={f.href}
              className="group block bg-brand-surface border border-brand-border rounded-lg p-5 space-y-3 transition-all duration-200
                hover:border-brand-accent hover:shadow-lg hover:shadow-brand-accent/10 hover:-translate-y-1"
            >
              <f.icon className="w-6 h-6 text-brand-accent transition-transform duration-200 group-hover:scale-110" />
              <h3 className="font-semibold text-brand-text">{f.title}</h3>
              <p className="text-brand-muted text-sm">{f.desc}</p>
              <span className="inline-flex items-center gap-1 text-xs text-brand-accent2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <h2 className="text-2xl font-bold text-center text-brand-text mb-2">Simple, transparent pricing</h2>
        <p className="text-center text-sm text-brand-muted mb-10">Scale from free to enterprise — no surprise charges.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col border rounded-lg p-6 space-y-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                plan.popular
                  ? 'border-brand-accent ring-1 ring-brand-accent hover:shadow-brand-accent/20 bg-brand-surface'
                  : plan.name === 'Enterprise'
                  ? 'border-brand-accent2/40 bg-brand-accent2/5'
                  : 'border-brand-border bg-brand-surface'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-brand-accent text-white px-3 py-0.5 rounded-full font-medium whitespace-nowrap">
                  Most popular
                </span>
              )}
              {plan.name === 'Enterprise' && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-brand-accent2 text-white px-3 py-0.5 rounded-full font-medium whitespace-nowrap">
                  For teams
                </span>
              )}
              <div>
                <h3 className="font-bold text-lg text-brand-text">{plan.name}</h3>
                <p className={`text-2xl font-bold mt-1 ${plan.name === 'Enterprise' ? 'text-brand-accent2' : 'text-brand-accent'}`}>
                  {plan.price}
                </p>
                <p className="text-sm text-brand-muted">{plan.scans}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-brand-muted">
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
                    ? 'bg-brand-accent2 hover:bg-[#2d5f82] text-white'
                    : 'border border-brand-border hover:border-brand-accent2 text-brand-muted hover:text-brand-accent2'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-border px-4 md:px-6 py-10 md:py-12 mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-accent" />
                <span className="font-bold text-brand-text">
                  <span className="text-brand-accent">THREAT</span>SHOT
                </span>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed">
                Cyber threat intelligence built for Indian SMEs, NBFCs, and fintech.
              </p>
              <p className="text-xs text-brand-muted italic">by MSInfo Services</p>
            </div>

            {/* Product */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-text">Product</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Threat News', to: '/threat-feed' },
                  { label: 'IOC Scanner', to: '/login' },
                  { label: 'CVE Search', to: '/cve' },
                  { label: 'Intelligence Blog', to: '/blog' },
                ].map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-xs text-brand-muted hover:text-brand-accent2 transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-text">Company</h3>
              <ul className="space-y-2">
                {[
                  { label: 'About', to: '/about' },
                  { label: 'Contact', to: '/contact' },
                  { label: 'Blog', to: '/blog' },
                ].map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-xs text-brand-muted hover:text-brand-accent2 transition-colors">{l.label}</Link>
                  </li>
                ))}
                <li>
                  <a href="mailto:sales@threatshot.in" className="text-xs text-brand-muted hover:text-brand-accent2 transition-colors">Enterprise Sales</a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-text">Legal</h3>
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
                    <Link to={l.to} className="text-xs text-brand-muted hover:text-brand-accent2 transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-brand-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-muted">
            <span>© {new Date().getFullYear()} MSInfo Services. All rights reserved.</span>
            <span className="italic">Modernising Secure Digital Future</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
