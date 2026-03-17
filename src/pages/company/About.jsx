import { Link } from 'react-router-dom'
import { Shield, Zap, Globe, Users, Target, ArrowLeft } from 'lucide-react'

const VALUES = [
  {
    icon: Shield,
    title: 'Security-First',
    desc: 'We build every feature with security as a first-class requirement, not an afterthought.',
  },
  {
    icon: Target,
    title: 'India-Focused',
    desc: 'Global threat intel filtered for Indian enterprise context — CERT-In, RBI, SEBI, and sectoral compliance built in.',
  },
  {
    icon: Zap,
    title: 'Actionable Intelligence',
    desc: 'Raw data is noise. We surface what matters — in plain language, with remediation guidance.',
  },
  {
    icon: Globe,
    title: 'Open Ecosystem',
    desc: 'We integrate with the tools your team already uses: SIEMs, ticketing systems, and threat intel platforms.',
  },
  {
    icon: Users,
    title: 'Community-Driven',
    desc: 'Threat intelligence improves when defenders share. Our blog and feed are open to the security community.',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">

      {/* Nav */}
      <nav className="border-b border-brand-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
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

      {/* Hero */}
      <div className="border-b border-brand-border bg-brand-surface">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs text-brand-accent2 uppercase tracking-widest mb-3 font-medium">MSInfo Services</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text mb-4">
            Modernising Secure Digital Future<br />
            <span className="text-brand-accent">for Indian Enterprises</span>
          </h1>
          <p className="text-brand-muted max-w-2xl mx-auto text-base leading-relaxed">
            ThreatShot is built by MSInfo Services — a cybersecurity product company focused on making enterprise-grade
            threat intelligence accessible to Indian SMEs, NBFCs, fintechs, and critical infrastructure operators.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14 space-y-16">

        {/* Mission */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-text border-b border-brand-border pb-2">Our Mission</h2>
          <p className="text-brand-muted leading-relaxed">
            Indian enterprises face the same sophisticated adversaries as Fortune 500 companies — but often without the
            security budgets or dedicated threat intelligence teams to respond. MSInfo Services exists to close that gap.
          </p>
          <p className="text-brand-muted leading-relaxed">
            ThreatShot aggregates intelligence from CISA, NVD, CERT-In, OTX, VirusTotal, AbuseIPDB, and 10+ other
            sources — then filters, contextualises, and delivers it in a format that a 5-person security team can act on
            without a SIEM engineer on staff.
          </p>
          <p className="text-brand-muted leading-relaxed">
            We are built for the CISOs of mid-market banks, the IT managers of fintech startups, and the security
            analysts of NBFC compliance teams who need real intelligence, not dashboards full of noise.
          </p>
        </section>

        {/* Values */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-brand-text border-b border-brand-border pb-2">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map(v => (
              <div key={v.title} className="bg-brand-surface border border-brand-border rounded-xl p-5 space-y-2">
                <v.icon className="w-5 h-5 text-brand-accent" />
                <h3 className="font-semibold text-brand-text text-sm">{v.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Company */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-text border-b border-brand-border pb-2">About MSInfo Services</h2>
          <p className="text-brand-muted leading-relaxed">
            MSInfo Services is a registered Indian company building cybersecurity products and managed security services.
            Our tagline — <em className="text-brand-text font-medium">Modernising Secure Digital Future</em> — reflects our belief
            that cybersecurity tooling in India must evolve to match the speed of the threat landscape.
          </p>
          <p className="text-brand-muted leading-relaxed">
            ThreatShot is our flagship SaaS product. We also offer consulting engagements, compliance advisory (RBI,
            SEBI, DPDP Act), and managed threat intelligence for enterprise clients.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-brand-surface border border-brand-border rounded-xl p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-brand-text">Ready to get started?</h2>
          <p className="text-brand-muted text-sm">Free plan. No credit card. Setup in under 2 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="bg-brand-accent hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Start for free
            </Link>
            <Link
              to="/contact"
              className="border border-brand-border hover:border-brand-accent2 text-brand-muted hover:text-brand-accent2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Talk to us
            </Link>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-brand-border px-6 py-6 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
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
