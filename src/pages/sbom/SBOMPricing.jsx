import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Package, CheckCircle, X, ArrowLeft, Zap, Shield,
  Skull, FileText, Clock, Users, Lock, Info,
} from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import useAuthStore from '../../store/authStore'

// ─── Plan definitions ─────────────────────────────────────────────────────────

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    badge: null,
    monthlyPrice: '₹0',
    yearlyPrice: '₹0',
    period: 'forever',
    desc: 'Try the scanner, no account needed.',
    cta: 'Start scanning',
    ctaHref: '/sbom',
    accent: false,
    features: [
      { label: '1 scan (anonymous) or 5/month (signed in)', ok: true },
      { label: 'Full CVE results view', ok: true },
      { label: 'CISA KEV + EPSS enrichment', ok: true },
      { label: 'Ransomware India threat intel', ok: true },
      { label: 'Component EOL tracking', ok: true },
      { label: 'CSV export', ok: false, note: 'Login required' },
      { label: 'PDF report', ok: false, note: 'Not available' },
      { label: 'SEBI CSCRF control mapping', ok: false, note: 'Individual+' },
      { label: 'Scan history', ok: false, note: 'Not available' },
      { label: 'Data retained for', ok: null, note: 'Anon: 24h · Free: 7 days' },
    ],
  },
  {
    id: 'individual',
    name: 'Individual',
    badge: 'Most popular',
    badgeColor: 'bg-brand-accent',
    monthlyPrice: '₹699',
    yearlyPrice: '₹6,990',
    period: '/month',
    yearlyPeriod: '/year',
    yearlyNote: '2 months free',
    desc: 'For analysts, consultants, and freelancers.',
    cta: 'Get started',
    ctaHref: '/register',
    accent: true,
    features: [
      { label: 'Unlimited scans', ok: true },
      { label: 'Full CVE results view', ok: true },
      { label: 'CISA KEV + EPSS enrichment', ok: true },
      { label: 'Ransomware India threat intel', ok: true },
      { label: 'Component EOL tracking', ok: true },
      { label: 'CSV export (with ransomware columns)', ok: true },
      { label: 'Clean PDF report (no watermark)', ok: true },
      { label: 'SEBI CSCRF control mapping', ok: true },
      { label: 'Scan history (90 days)', ok: true },
      { label: 'Data retained for 90 days', ok: true },
    ],
  },
  {
    id: 'org',
    name: 'Organisation',
    badge: 'For teams',
    badgeColor: 'bg-brand-accent2',
    monthlyPrice: '₹2,499',
    yearlyPrice: '₹24,990',
    period: '/month',
    yearlyPeriod: '/year',
    yearlyNote: '2 months free',
    desc: 'For security teams and enterprises.',
    cta: 'Get started',
    ctaHref: '/register',
    accent: false,
    team: true,
    features: [
      { label: 'Everything in Individual', ok: true },
      { label: 'Up to 10 team members', ok: true },
      { label: 'Shared scan workspace', ok: true, note: 'Phase 2' },
      { label: 'Org logo on PDF reports', ok: true, note: 'Phase 2' },
      { label: 'Scan history (1 year)', ok: true },
      { label: 'Data retained for 1 year', ok: true },
      { label: 'Priority support', ok: true },
      { label: 'Custom SEBI/RBI control templates', ok: true, note: 'Phase 2' },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    badge: 'Custom',
    badgeColor: 'bg-slate-600',
    monthlyPrice: 'Custom',
    yearlyPrice: null,
    period: '',
    desc: 'NBFCs, banks, and large enterprises.',
    cta: 'Contact sales',
    ctaHref: 'mailto:sales@threatshot.in',
    accent: false,
    enterprise: true,
    features: [
      { label: 'Everything in Organisation', ok: true },
      { label: 'Unlimited team members', ok: true },
      { label: 'SSO / SAML integration', ok: true, note: 'Phase 2' },
      { label: 'SIEM / SOAR export', ok: true, note: 'Phase 2' },
      { label: 'Custom data retention SLA', ok: true },
      { label: 'Dedicated account manager', ok: true },
      { label: 'RBI/SEBI audit-ready reports', ok: true },
      { label: 'SLA-backed support', ok: true },
    ],
  },
]

// ─── Feature comparison table rows ───────────────────────────────────────────

const COMPARE_ROWS = [
  { label: 'Scans per month',          anon: '1 (ever)',     free: '5',            ind: 'Unlimited',   org: 'Unlimited' },
  { label: 'CVE results view',         anon: '✓',            free: '✓',            ind: '✓',           org: '✓' },
  { label: 'CISA KEV enrichment',      anon: '✓',            free: '✓',            ind: '✓',           org: '✓' },
  { label: 'EPSS enrichment',          anon: '✓',            free: '✓',            ind: '✓',           org: '✓' },
  { label: 'Ransomware India intel',   anon: '✓',            free: '✓',            ind: '✓',           org: '✓' },
  { label: 'Component EOL tracking',   anon: '✓',            free: '✓',            ind: '✓',           org: '✓' },
  { label: 'CSV export',               anon: '—',            free: '✓',            ind: '✓',           org: '✓' },
  { label: 'PDF report',               anon: '—',            free: 'Watermarked',  ind: 'Clean',       org: 'Clean + logo' },
  { label: 'SEBI CSCRF mapping',       anon: '—',            free: 'Teaser',       ind: '✓',           org: '✓' },
  { label: 'Scan history',             anon: '—',            free: '—',            ind: '90 days',     org: '1 year' },
  { label: 'Data retention',           anon: '24 hours',     free: '7 days',       ind: '90 days',     org: '1 year' },
  { label: 'Team workspace',           anon: '—',            free: '—',            ind: '—',           org: 'Up to 10' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlanFeature({ feature }) {
  if (feature.ok === true) {
    return (
      <li className="flex items-start gap-2 text-sm text-brand-muted">
        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-brand-success" />
        <span>
          {feature.label}
          {feature.note && (
            <span className="ml-1 text-[10px] text-brand-muted/60 italic">({feature.note})</span>
          )}
        </span>
      </li>
    )
  }
  if (feature.ok === false) {
    return (
      <li className="flex items-start gap-2 text-sm text-brand-muted/50">
        <X className="w-4 h-4 shrink-0 mt-0.5 text-brand-border" />
        <span>
          {feature.label}
          {feature.note && (
            <span className="ml-1 text-[10px] text-brand-muted/50 italic">({feature.note})</span>
          )}
        </span>
      </li>
    )
  }
  // ok === null — informational row
  return (
    <li className="flex items-start gap-2 text-sm text-brand-muted/60">
      <Info className="w-4 h-4 shrink-0 mt-0.5 text-brand-border" />
      <span>
        {feature.label}
        {feature.note && <span className="ml-1 text-[10px] italic">({feature.note})</span>}
      </span>
    </li>
  )
}

function PlanCard({ plan, yearly }) {
  const price   = yearly && plan.yearlyPrice ? plan.yearlyPrice : plan.monthlyPrice
  const period  = yearly && plan.yearlyPeriod ? plan.yearlyPeriod : plan.period
  const isAccent = plan.accent
  const isTeam   = plan.team
  const isEnt    = plan.enterprise

  return (
    <div
      className={`relative flex flex-col rounded-lg p-6 space-y-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border ${
        isAccent
          ? 'border-brand-accent ring-1 ring-brand-accent hover:shadow-brand-accent/20 bg-brand-surface'
          : isTeam
          ? 'border-brand-accent2/50 bg-brand-accent2/5 hover:shadow-brand-accent2/15'
          : isEnt
          ? 'border-slate-600/40 bg-slate-900/20'
          : 'border-brand-border bg-brand-surface'
      }`}
    >
      {/* Badge */}
      {plan.badge && (
        <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-white px-3 py-0.5 rounded-full font-medium whitespace-nowrap ${plan.badgeColor}`}>
          {plan.badge}
        </span>
      )}

      {/* Header */}
      <div>
        <h3 className="font-bold text-lg text-brand-text">{plan.name}</h3>
        <div className="mt-1 flex items-end gap-1">
          <span className={`text-3xl font-extrabold ${isAccent ? 'text-brand-accent' : isTeam ? 'text-brand-accent2' : 'text-brand-text'}`}>
            {price}
          </span>
          {period && <span className="text-sm text-brand-muted mb-0.5">{period}</span>}
        </div>
        {yearly && plan.yearlyNote && (
          <span className="text-[10px] text-brand-success font-medium">{plan.yearlyNote}</span>
        )}
        <p className="text-xs text-brand-muted mt-1.5">{plan.desc}</p>
      </div>

      {/* Features */}
      <ul className="space-y-2 flex-1">
        {plan.features.map((f, i) => <PlanFeature key={i} feature={f} />)}
      </ul>

      {/* CTA */}
      <Link
        to={plan.ctaHref}
        className={`block text-center py-2.5 rounded-md text-sm font-medium transition-colors ${
          isAccent
            ? 'bg-brand-accent hover:bg-red-700 text-white'
            : isTeam
            ? 'bg-brand-accent2 hover:bg-[#2d5f82] text-white'
            : isEnt
            ? 'border border-slate-500 hover:border-slate-400 text-brand-muted hover:text-brand-text'
            : 'border border-brand-border hover:border-brand-accent2 text-brand-muted hover:text-brand-accent2'
        }`}
      >
        {plan.cta}
      </Link>
    </div>
  )
}

// ─── Comparison table cell helper ────────────────────────────────────────────

function CompareCell({ val }) {
  if (val === '✓') return <span className="text-brand-success font-bold">✓</span>
  if (val === '—') return <span className="text-brand-border">—</span>
  return <span className="text-xs text-brand-muted">{val}</span>
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SBOMPricing() {
  const [yearly, setYearly] = useState(false)
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)

  return (
    <PageWrapper title="SBOM Scanner Pricing">
      {/* Back nav */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/sbom')}
          className="text-brand-muted hover:text-brand-text transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Package className="w-5 h-5 text-brand-accent" />
        <div>
          <h1 className="text-lg font-bold text-brand-text">SBOM Scanner — Pricing</h1>
          <p className="text-xs text-brand-muted">Per-module subscription · cancel anytime</p>
        </div>
      </div>

      {/* Value prop banner */}
      <div className="max-w-4xl mx-auto mb-10 rounded-xl border border-brand-accent/20 bg-brand-surface p-6 space-y-3">
        <p className="text-sm font-semibold text-brand-text">
          Why ThreatShot SBOM beats generic scanners
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Skull className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-brand-text">India Ransomware Intel</p>
              <p className="text-xs text-brand-muted">CVEs linked to LockBit, Cl0p, Akira and other groups actively targeting Indian BFSI, IT/ITES sectors.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-brand-accent2 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-brand-text">SEBI CSCRF Mapping</p>
              <p className="text-xs text-brand-muted">Every finding mapped to SEBI Cyber Security and Cyber Resilience Framework controls. Audit-ready for Indian regulated entities.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-brand-text">Top 5 Fix These Now</p>
              <p className="text-xs text-brand-muted">Prioritised action list sorted by KEV → Ransomware → CVSS → EPSS. No more guessing what to patch first.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className={`text-sm ${!yearly ? 'text-brand-text font-medium' : 'text-brand-muted'}`}>Monthly</span>
        <button
          onClick={() => setYearly(y => !y)}
          className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? 'bg-brand-accent' : 'bg-brand-border'}`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${yearly ? 'translate-x-6' : ''}`}
          />
        </button>
        <span className={`text-sm ${yearly ? 'text-brand-text font-medium' : 'text-brand-muted'}`}>
          Yearly
          <span className="ml-1.5 text-[10px] bg-brand-success/20 text-brand-success px-1.5 py-0.5 rounded font-medium">
            Save 2 months
          </span>
        </span>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-14">
        {PLANS.map(plan => (
          <PlanCard key={plan.id} plan={plan} yearly={yearly} />
        ))}
      </div>

      {/* Feature comparison table */}
      <div className="max-w-4xl mx-auto mb-14">
        <h2 className="text-lg font-bold text-brand-text mb-4 text-center">Full feature comparison</h2>
        <div className="overflow-x-auto rounded-lg border border-brand-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-surface border-b border-brand-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide w-1/3">Feature</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Free</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Free (signed in)</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-brand-accent uppercase tracking-wide">Individual</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-brand-accent2 uppercase tracking-wide">Org</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row, i) => (
                <tr key={i} className={`border-b border-brand-border/50 ${i % 2 === 0 ? '' : 'bg-brand-surface/40'}`}>
                  <td className="px-4 py-2.5 text-xs text-brand-muted">{row.label}</td>
                  <td className="px-3 py-2.5 text-center"><CompareCell val={row.anon} /></td>
                  <td className="px-3 py-2.5 text-center"><CompareCell val={row.free} /></td>
                  <td className="px-3 py-2.5 text-center"><CompareCell val={row.ind} /></td>
                  <td className="px-3 py-2.5 text-center"><CompareCell val={row.org} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ / notes */}
      <div className="max-w-2xl mx-auto mb-14 space-y-4">
        <h2 className="text-lg font-bold text-brand-text mb-5 text-center">Common questions</h2>
        {[
          {
            q: 'Do I need to buy the whole platform?',
            a: 'No. ThreatShot uses per-module pricing. You only pay for the SBOM scanner here — other modules like IOC Scanner have their own plans.',
          },
          {
            q: 'What counts as a "scan"?',
            a: 'Each SBOM file upload is one scan. Re-downloading results or viewing the same scan ID does not count against your quota.',
          },
          {
            q: 'What formats are supported?',
            a: 'CycloneDX JSON (1.4+) and SPDX JSON. XML variants of both are on the roadmap.',
          },
          {
            q: 'What is SEBI CSCRF mapping?',
            a: 'Every CVE finding is mapped to relevant controls in the SEBI Cyber Security and Cyber Resilience Framework — the regulatory baseline for Indian stock brokers, depositories, and market infrastructure.',
          },
          {
            q: 'Can I cancel anytime?',
            a: 'Yes. Monthly plans cancel at end of the billing period. Yearly plans are non-refundable but you can cancel renewal. See our Refund Policy.',
          },
          {
            q: 'Is this compliant with DPDP Act 2023?',
            a: 'Yes. We store only the scan metadata and CVE results — not the SBOM file itself after processing. Data is deleted at the end of your retention period with a verifiable deletion certificate on paid plans.',
          },
        ].map(({ q, a }) => (
          <div key={q} className="border border-brand-border rounded-lg p-4 space-y-1.5">
            <p className="text-sm font-semibold text-brand-text">{q}</p>
            <p className="text-xs text-brand-muted leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center pb-10 space-y-3">
        <p className="text-sm text-brand-muted">
          Questions? Email us at{' '}
          <a href="mailto:sales@threatshot.in" className="text-brand-accent2 hover:underline">
            sales@threatshot.in
          </a>
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/sbom"
            className="border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-accent2 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Try free first
          </Link>
          {!user && (
            <Link
              to="/register"
              className="bg-brand-accent hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Create free account
            </Link>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
