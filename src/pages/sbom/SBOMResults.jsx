import { useEffect, useState, useCallback } from 'react'
import useAuthStore from '../../store/authStore'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Shield, ShieldAlert, ShieldX, AlertTriangle,
  Package, ExternalLink, ChevronDown, ChevronUp,
  Flame, Activity, Clock, StopCircle, Download,
  Skull, Lock, FileText, Info, Zap, BookOpen, X,
} from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import { Card, Badge, Button, Spinner } from '../../components/ui'
import ScanProgressCard from '../../components/sbom/ScanProgressCard'
import SignupPromptModal from '../../components/SignupPromptModal'
import useSBOMScan from '../../hooks/useSBOMScan'
import api from '../../lib/api'

// ─── Constants ───────────────────────────────────────────────────────────────

const SEVERITY_ORDER = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NONE']
const PAGE_SIZE = 50

// ─── Severity config (uses CSS-var-backed sev-* tokens) ──────────────────────

const SEVERITY_CFG = {
  CRITICAL: { label: 'Critical', cls: 'critical', Icon: ShieldX },
  HIGH:     { label: 'High',     cls: 'high',     Icon: ShieldAlert },
  MEDIUM:   { label: 'Medium',   cls: 'medium',   Icon: Shield },
  LOW:      { label: 'Low',      cls: 'low',       Icon: Shield },
  NONE:     { label: 'None',     cls: 'clean',     Icon: Shield },
}

const SEV_BAR_COLOR = {
  CRITICAL: 'bg-sev-critical-text',
  HIGH:     'bg-sev-high-text',
  MEDIUM:   'bg-sev-medium-text',
  LOW:      'bg-sev-low-text',
  NONE:     'bg-sev-clean-text',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sevCfg(s) {
  return SEVERITY_CFG[(s || '').toUpperCase()] || SEVERITY_CFG.NONE
}

function fmtScore(n) {
  return n != null ? Number(n).toFixed(1) : '—'
}

function fmtEpss(n) {
  return n != null ? `${(n * 100).toFixed(1)}%` : '—'
}

function riskColor(score) {
  if (score >= 75) return 'text-sev-critical-text'
  if (score >= 50) return 'text-sev-high-text'
  if (score >= 25) return 'text-sev-medium-text'
  return 'text-brand-success'
}

// ─── SEBI CSCRF controls section ─────────────────────────────────────────────

const CATEGORY_COLORS = {
  'Vulnerability Management':    'border-blue-500/30 bg-blue-500/8 text-blue-300',
  'Patch Management':            'border-purple-500/30 bg-purple-500/8 text-purple-300',
  'Asset Management':            'border-yellow-500/30 bg-yellow-500/8 text-yellow-300',
  'Identity & Access Management':'border-green-500/30 bg-green-500/8 text-green-300',
  'Encryption & Key Management': 'border-cyan-500/30 bg-cyan-500/8 text-cyan-300',
  'Application Security':        'border-red-500/30 bg-red-500/8 text-red-300',
  'Technology Controls':         'border-slate-400/30 bg-slate-400/8 text-slate-300',
  'Incident Management':         'border-orange-500/30 bg-orange-500/8 text-orange-300',
  'Business Continuity & DR':    'border-pink-500/30 bg-pink-500/8 text-pink-300',
}

function SebiControlsSection({ controls, sbomTier }) {
  // Teaser for anon / free users
  if (sbomTier !== 'individual' && sbomTier !== 'org') {
    return (
      <div className="relative rounded-lg border border-brand-accent2/30 overflow-hidden">
        {/* blurred preview of what controls would look like */}
        <div className="blur-sm pointer-events-none select-none p-3 space-y-1.5" aria-hidden>
          {['VM.2 — Vulnerability Risk Rating', 'PM.3 — Patch Deployment', 'IM.1 — Incident Detection'].map(l => (
            <div key={l} className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300">{l.split(' — ')[0]}</span>
              <span className="text-[10px] text-brand-muted">{l.split(' — ')[1]}</span>
            </div>
          ))}
        </div>
        {/* overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-brand-bg/70 backdrop-blur-[1px]">
          <Lock className="w-4 h-4 text-brand-accent2" />
          <p className="text-xs font-semibold text-brand-text">SEBI CSCRF Mapping</p>
          <p className="text-[10px] text-brand-muted text-center px-4">
            Maps CVEs to regulatory controls for SEBI-regulated entities.
          </p>
          <a
            href="/sbom/pricing"
            className="text-[10px] font-semibold text-brand-accent2 hover:underline"
          >
            Individual plan required →
          </a>
        </div>
      </div>
    )
  }

  if (!controls || controls.length === 0) return null

  // Group by category
  const byCategory = controls.reduce((acc, c) => {
    const cat = c.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(c)
    return acc
  }, {})

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold text-brand-accent2 uppercase tracking-wide flex items-center gap-1">
        <BookOpen className="w-3 h-3" /> SEBI CSCRF Applicable Controls
      </p>
      <div className="flex flex-wrap gap-1.5">
        {controls.map(c => {
          const colorCls = CATEGORY_COLORS[c.category] || 'border-brand-border text-brand-muted'
          return (
            <div
              key={c.id}
              title={`${c.name} — ${c.desc}`}
              className={`group relative flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border cursor-help ${colorCls}`}
            >
              {c.id}
              {/* tooltip */}
              <div className="absolute bottom-full left-0 mb-1.5 w-64 p-2 rounded-lg bg-brand-surface border border-brand-border shadow-xl text-[9px] text-brand-muted leading-relaxed z-50 hidden group-hover:block pointer-events-none">
                <p className="font-semibold text-brand-text mb-0.5">{c.id} — {c.name}</p>
                <p className="text-brand-muted/80">{c.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-[9px] text-brand-muted/50">
        Per SEBI CSCRF 2023 (Circular SEBI/HO/ITD-1/ITD_CSC_EXT/P/CIR/2023/131). Hover a control ID for description.
      </p>
    </div>
  )
}

// ─── Ransomware warning banner ────────────────────────────────────────────────

function RansomwareBanner({ count }) {
  if (!count || count === 0) return null
  return (
    <div className="flex items-start gap-3 rounded-lg border border-orange-500/40 bg-orange-500/10 px-4 py-3">
      <Skull className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-orange-300">
          {count} Ransomware-Linked {count === 1 ? 'CVE' : 'CVEs'} Detected
        </p>
        <p className="text-xs text-orange-400/80 mt-0.5">
          These vulnerabilities are actively exploited by ransomware groups targeting Indian enterprises
          (LockBit 3.0, Cl0p, BlackCat/ALPHV, Akira and others). Immediate remediation is strongly advised.
        </p>
      </div>
    </div>
  )
}

// ─── Data retention warning banner ───────────────────────────────────────────

function DataRetentionBanner({ tier }) {
  if (!tier || tier === 'individual' || tier === 'org') return null

  const msg = tier === 'anon'
    ? 'Anonymous scans are deleted after 24 hours. Sign in to retain results for 7 days.'
    : 'Free plan scans are retained for 7 days. Upgrade your SBOM subscription to keep results longer.'

  return (
    <div className="flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/8 px-4 py-3">
      <Info className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
      <p className="text-xs text-yellow-400/90">{msg}</p>
    </div>
  )
}

// ─── Top 5 Fix These Now card ─────────────────────────────────────────────────

function Top5FixCard({ fixes }) {
  if (!fixes || fixes.length === 0) return null

  return (
    <Card className="border-brand-accent/30 bg-brand-surface">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-brand-accent" />
        <p className="text-sm font-semibold text-brand-text">Top 5 — Fix These Now</p>
        <span className="ml-auto text-[10px] text-brand-muted">Priority: KEV → Ransomware → CVSS → EPSS</span>
      </div>
      <div className="space-y-2">
        {fixes.map((fix, i) => {
          const cfg = sevCfg(fix.severity)
          return (
            <div
              key={fix.cve_id}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 border border-sev-${cfg.cls}-border/40 bg-brand-bg`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center bg-brand-surface text-[10px] font-bold text-brand-muted shrink-0">
                {i + 1}
              </span>
              <span className="font-mono text-xs font-semibold text-brand-text w-32 shrink-0">
                {fix.cve_id}
              </span>
              <span className="text-xs text-brand-muted truncate flex-1">
                {fix.component_name}
                {fix.component_version && <span className="opacity-60"> @{fix.component_version}</span>}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {fix.is_kev && (
                  <span className="flex items-center gap-0.5 text-[9px] font-bold px-1 py-0.5 rounded bg-sev-kev-bg border border-sev-kev-border text-sev-kev-text">
                    <Flame className="w-2 h-2" /> KEV
                  </span>
                )}
                {fix.is_ransomware && (
                  <span className="flex items-center gap-0.5 text-[9px] font-bold px-1 py-0.5 rounded bg-orange-500/15 border border-orange-500/30 text-orange-400">
                    <Skull className="w-2 h-2" /> Ransomware
                  </span>
                )}
                <Badge variant={cfg.cls} className="text-[9px] px-1 py-0.5">{cfg.label}</Badge>
                <span className="text-[10px] text-brand-muted tabular-nums w-8 text-right">{fmtScore(fix.cvss_v3_score)}</span>
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-[10px] text-brand-muted mt-3 px-1">
        {fixes[0]?.fix_reason && (
          <span className="text-brand-muted/70">Priority #1 reason: {fixes[0].fix_reason}</span>
        )}
      </p>
    </Card>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({ label, value, valueClass = 'text-brand-text', sub }) {
  return (
    <Card className="flex flex-col items-center py-4 gap-0.5 text-center">
      <span className={`text-3xl font-bold tabular-nums ${valueClass}`}>{value}</span>
      <span className="text-xs text-brand-muted">{label}</span>
      {sub && <span className="text-[10px] text-brand-muted/60 mt-0.5">{sub}</span>}
    </Card>
  )
}

function SeverityBreakdown({ breakdown, total }) {
  if (!breakdown || total === 0) return null
  return (
    <Card>
      <p className="text-xs font-semibold text-brand-muted mb-3 uppercase tracking-wide">Severity Breakdown</p>
      <div className="space-y-2">
        {SEVERITY_ORDER.filter(s => breakdown[s] > 0).map(s => {
          const pct = Math.round((breakdown[s] / total) * 100)
          return (
            <div key={s} className="flex items-center gap-2 text-xs">
              <span className="w-16 text-right text-brand-muted">{sevCfg(s).label}</span>
              <div className="flex-1 bg-brand-border/40 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${SEV_BAR_COLOR[s]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 tabular-nums text-brand-muted">{breakdown[s]}</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function CVERow({ result, sbomTier }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = sevCfg(result.cvss_v3_severity)
  const { Icon } = cfg

  return (
    <div className={`border rounded-lg overflow-hidden border-sev-${cfg.cls}-border border-opacity-60 bg-brand-bg`}>
      <button
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-brand-surface/60 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <Icon className="w-4 h-4 shrink-0 text-brand-muted" />
        <span className="w-36 shrink-0 font-mono text-xs font-semibold text-brand-text">
          {result.cve_id}
        </span>
        <span className="flex-1 text-xs text-brand-muted truncate">
          {result.component_name}
          {result.component_version && (
            <span className="opacity-60"> @{result.component_version}</span>
          )}
        </span>
        <Badge variant={cfg.cls} className="shrink-0">{cfg.label}</Badge>
        <span className="w-10 text-right text-xs text-brand-muted tabular-nums shrink-0">
          {fmtScore(result.cvss_v3_score)}
        </span>
        {result.is_kev && (
          <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-sev-kev-bg border border-sev-kev-border text-sev-kev-text">
            <Flame className="w-2.5 h-2.5" /> KEV
          </span>
        )}
        {result.is_ransomware && (
          <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/15 border border-orange-500/30 text-orange-400">
            <Skull className="w-2.5 h-2.5" /> RW
          </span>
        )}
        {expanded
          ? <ChevronUp className="w-3.5 h-3.5 text-brand-muted shrink-0" />
          : <ChevronDown className="w-3.5 h-3.5 text-brand-muted shrink-0" />
        }
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-brand-border space-y-3 text-xs">
          {result.description && (
            <p className="text-brand-muted leading-relaxed">{result.description}</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <p className="text-brand-muted/60 mb-0.5">CVSS v3</p>
              <p className="font-semibold text-brand-text">{fmtScore(result.cvss_v3_score)}</p>
            </div>
            <div>
              <p className="text-brand-muted/60 mb-0.5">EPSS Score</p>
              <p className="font-semibold text-brand-text">{fmtEpss(result.epss_score)}</p>
            </div>
            <div>
              <p className="text-brand-muted/60 mb-0.5">EPSS Percentile</p>
              <p className="font-semibold text-brand-text">{fmtEpss(result.epss_percentile)}</p>
            </div>
            <div>
              <p className="text-brand-muted/60 mb-0.5">Component EOL</p>
              <p className={`font-semibold ${result.component_eol ? 'text-sev-critical-text' : 'text-brand-success'}`}>
                {result.component_eol
                  ? `Yes${result.component_eol_date ? ` (${result.component_eol_date})` : ''}`
                  : 'No'}
              </p>
            </div>
          </div>

          {result.is_kev && (
            <div className="bg-sev-kev-bg border border-sev-kev-border rounded p-2 space-y-0.5">
              <p className="text-sev-kev-text font-semibold flex items-center gap-1">
                <Flame className="w-3 h-3" /> CISA Known Exploited Vulnerability
              </p>
              {result.kev_date_added && (
                <p className="text-sev-kev-text opacity-80">
                  Added: {result.kev_date_added} · Due: {result.kev_due_date || 'N/A'}
                </p>
              )}
            </div>
          )}

          {result.is_ransomware && (
            <div className="rounded p-2 space-y-0.5 bg-orange-500/10 border border-orange-500/30">
              <p className="text-orange-300 font-semibold flex items-center gap-1">
                <Skull className="w-3 h-3" /> Ransomware-Linked CVE
              </p>
              {result.ransomware_group && (
                <p className="text-orange-400/80">Group: {result.ransomware_group}</p>
              )}
              {result.ransomware_india_context && (
                <p className="text-orange-400/70">{result.ransomware_india_context}</p>
              )}
            </div>
          )}

          {result.cwe_ids?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {result.cwe_ids.map(c => (
                <span key={c} className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-brand-surface border border-brand-border text-brand-muted">
                  {c}
                </span>
              ))}
            </div>
          )}

          {result.cvss_v3_vector && (
            <p className="font-mono text-[10px] text-brand-muted/60 break-all">{result.cvss_v3_vector}</p>
          )}

          <SebiControlsSection
            controls={result.sebi_controls}
            sbomTier={sbomTier}
          />

          <a
            href={`https://nvd.nist.gov/vuln/detail/${result.cve_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-brand-accent2 hover:text-brand-accent transition-colors"
          >
            View on NVD <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  )
}

// ─── Results panel (fetched separately once scan is complete) ─────────────────

function ResultsPanel({ scanId, sbomTier }) {
  const [results,         setResults]         = useState([])
  const [total,           setTotal]           = useState(0)
  const [page,            setPage]            = useState(1)
  const [severity,        setSeverity]        = useState('')
  const [kevOnly,         setKevOnly]         = useState(false)
  const [ransomwareOnly,  setRansomwareOnly]  = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [error,           setError]           = useState(null)

  const fetchResults = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, page_size: PAGE_SIZE }
      if (severity)       params.severity        = severity
      if (kevOnly)        params.kev_only        = true
      if (ransomwareOnly) params.ransomware_only = true
      const { data } = await api.get(`/sbom/scan/${scanId}/results`, { params })
      setResults(data.results)
      setTotal(data.total)
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to load results.')
    } finally {
      setLoading(false)
    }
  }, [scanId, page, severity, kevOnly, ransomwareOnly])

  useEffect(() => { fetchResults() }, [fetchResults])

  if (total === 0 && !loading) {
    return (
      <Card className="flex flex-col items-center gap-3 py-10">
        <Shield className="w-8 h-8 text-brand-success" />
        <p className="text-sm font-medium text-brand-text">No known vulnerabilities found</p>
        <p className="text-xs text-brand-muted text-center">
          All components were checked — none matched our CVE database.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-brand-muted">Filter:</span>
        {['', ...SEVERITY_ORDER.slice(0, 4)].map(s => (
          <button
            key={s}
            onClick={() => { setSeverity(s); setPage(1) }}
            className={`text-xs px-2.5 py-1 rounded border transition-colors ${
              severity === s
                ? 'bg-brand-accent border-brand-accent text-white'
                : 'border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-muted'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
        <button
          onClick={() => { setKevOnly(k => !k); setRansomwareOnly(false); setPage(1) }}
          className={`text-xs px-2.5 py-1 rounded border transition-colors flex items-center gap-1 ${
            kevOnly
              ? 'bg-sev-kev-bg border-sev-kev-border text-sev-kev-text'
              : 'border-brand-border text-brand-muted hover:text-brand-text'
          }`}
        >
          <Flame className="w-3 h-3" /> KEV
        </button>
        <button
          onClick={() => { setRansomwareOnly(r => !r); setKevOnly(false); setPage(1) }}
          className={`text-xs px-2.5 py-1 rounded border transition-colors flex items-center gap-1 ${
            ransomwareOnly
              ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
              : 'border-brand-border text-brand-muted hover:text-brand-text'
          }`}
        >
          <Skull className="w-3 h-3" /> Ransomware
        </button>
        <span className="ml-auto text-xs text-brand-muted">
          {loading ? 'Loading…' : `${total} result${total !== 1 ? 's' : ''}`}
        </span>
      </div>

      {error && (
        <p className="text-xs text-brand-danger">{error}</p>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner className="w-6 h-6 text-brand-accent" />
        </div>
      ) : results.length === 0 ? (
        <Card className="py-8 text-center text-sm text-brand-muted">
          No results match the selected filters.
        </Card>
      ) : (
        <div className="space-y-2">
          {results.map(r => <CVERow key={r._id} result={r} sbomTier={sbomTier} />)}
        </div>
      )}

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-xs px-3 py-1.5"
          >
            Previous
          </Button>
          <span className="text-xs text-brand-muted">
            Page {page} of {Math.ceil(total / PAGE_SIZE)}
          </span>
          <Button
            variant="secondary"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / PAGE_SIZE)}
            className="text-xs px-3 py-1.5"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

// ─── PDF metadata modal ───────────────────────────────────────────────────────

const PURPOSES = [
  'Security Assessment',
  'Internal Audit',
  'Compliance Review',
  'Vendor Assessment',
  'Regulatory Filing',
  'Executive Briefing',
]

const CLASSIFICATIONS = [
  'Internal Use Only',
  'Confidential',
  'Restricted',
  'Public',
]

function PDFMetadataModal({ isOpen, onClose, onSubmit, isFreeTier, loading }) {
  const [form, setForm] = useState({
    product_name:   '',
    org_name:       '',
    assessor_name:  '',
    report_purpose: 'Security Assessment',
    classification: 'Internal Use Only',
  })

  if (!isOpen) return null

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-accent" />
            <p className="text-sm font-semibold text-brand-text">PDF Report Details</p>
          </div>
          <button onClick={onClose} className="text-brand-muted hover:text-brand-text">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-4 space-y-3">
          {isFreeTier && (
            <div className="flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/8 px-3 py-2">
              <Info className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-yellow-400/90">
                Free plan — PDF will include a watermark.{' '}
                <a href="/sbom/pricing" className="underline">Upgrade</a> for clean reports.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-[10px] font-semibold text-brand-muted uppercase tracking-wide mb-1">
                Product / System Name
              </label>
              <input
                type="text"
                value={form.product_name}
                onChange={e => set('product_name', e.target.value)}
                placeholder="e.g. Banking App v2.1"
                maxLength={120}
                className="w-full bg-brand-bg border border-brand-border rounded-md text-brand-text text-xs px-3 py-2 focus:outline-none focus:border-brand-accent2 placeholder:text-brand-muted/50"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-semibold text-brand-muted uppercase tracking-wide mb-1">
                Organisation
              </label>
              <input
                type="text"
                value={form.org_name}
                onChange={e => set('org_name', e.target.value)}
                placeholder="e.g. ACME Bank Ltd"
                maxLength={120}
                className="w-full bg-brand-bg border border-brand-border rounded-md text-brand-text text-xs px-3 py-2 focus:outline-none focus:border-brand-accent2 placeholder:text-brand-muted/50"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-semibold text-brand-muted uppercase tracking-wide mb-1">
                Prepared By <span className="text-brand-muted/50 normal-case">(optional)</span>
              </label>
              <input
                type="text"
                value={form.assessor_name}
                onChange={e => set('assessor_name', e.target.value)}
                placeholder="e.g. Jane Smith, CISSP"
                maxLength={120}
                className="w-full bg-brand-bg border border-brand-border rounded-md text-brand-text text-xs px-3 py-2 focus:outline-none focus:border-brand-accent2 placeholder:text-brand-muted/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-brand-muted uppercase tracking-wide mb-1">
                Report Purpose
              </label>
              <select
                value={form.report_purpose}
                onChange={e => set('report_purpose', e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-md text-brand-text text-xs px-3 py-2 focus:outline-none focus:border-brand-accent2"
              >
                {PURPOSES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-brand-muted uppercase tracking-wide mb-1">
                Classification
              </label>
              <select
                value={form.classification}
                onChange={e => set('classification', e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-md text-brand-text text-xs px-3 py-2 focus:outline-none focus:border-brand-accent2"
              >
                {CLASSIFICATIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <p className="text-[9px] text-brand-muted/60">
            These details appear on the PDF cover page. Leave blank to omit.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 text-xs py-2 rounded-md border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-accent2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(form)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-md bg-brand-accent hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-60"
          >
            {loading ? <Spinner className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            {loading ? 'Generating…' : 'Generate & Download'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Download section ─────────────────────────────────────────────────────────

function DownloadSection({ scanId, scanTier, sbomTier, onLoginRequired }) {
  const user = useAuthStore(state => state.user)
  const [csvLoading,    setCsvLoading]    = useState(false)
  const [pdfLoading,    setPdfLoading]    = useState(false)
  const [showPdfModal,  setShowPdfModal]  = useState(false)

  const isFreeTier = sbomTier === 'anon' || sbomTier === 'free'

  const triggerDownload = async (format, params = {}) => {
    const setLoading = format === 'pdf' ? setPdfLoading : setCsvLoading
    setLoading(true)
    try {
      const resp = await api.get(`/sbom/scan/${scanId}/download`, {
        params: { format, ...params },
        responseType: 'blob',
      })
      const ext      = format === 'pdf' ? 'pdf' : 'csv'
      const mimeType = format === 'pdf' ? 'application/pdf' : 'text/csv'
      const blob     = new Blob([resp.data], { type: mimeType })
      const url      = URL.createObjectURL(blob)
      const a        = document.createElement('a')
      a.href         = url
      a.download     = `sbom-report-${scanId.slice(0, 8)}${isFreeTier ? '-sample' : ''}.${ext}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      const msg = e.response?.data?.detail || `Failed to download ${format.toUpperCase()}.`
      alert(msg)
    } finally {
      setLoading(false)
      setShowPdfModal(false)
    }
  }

  const handleCsvClick = () => {
    if (!user) { onLoginRequired(); return }
    triggerDownload('csv')
  }

  const handlePdfClick = () => {
    if (!user) { onLoginRequired(); return }
    setShowPdfModal(true)
  }

  if (!user) {
    return (
      <div className="pt-2 flex flex-col items-center gap-2">
        <Button
          variant="secondary"
          onClick={onLoginRequired}
          className="flex items-center gap-2 text-xs py-1.5 px-4"
        >
          <Lock className="w-3.5 h-3.5" />
          Login to Download Report
        </Button>
        <p className="text-[10px] text-brand-muted">Free account · CSV + PDF available after sign-in</p>
      </div>
    )
  }

  return (
    <>
      <div className="pt-2 flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="secondary"
            onClick={handleCsvClick}
            disabled={csvLoading}
            className="flex items-center gap-1.5 text-xs py-1.5 px-3"
          >
            {csvLoading ? <Spinner className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            Export CSV
          </Button>
          <div className="relative">
            <Button
              variant="secondary"
              onClick={handlePdfClick}
              disabled={pdfLoading}
              className="flex items-center gap-1.5 text-xs py-1.5 px-3"
            >
              {pdfLoading ? <Spinner className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              Download PDF Report
            </Button>
            {isFreeTier && (
              <span className="absolute -top-2 -right-2 text-[9px] font-bold px-1 py-0.5 rounded bg-brand-surface border border-brand-border text-brand-muted">
                Watermarked
              </span>
            )}
          </div>
        </div>
        {isFreeTier && (
          <p className="text-[10px] text-brand-muted text-center">
            Free plan — PDF includes a watermark.{' '}
            <a href="/sbom/pricing" className="text-brand-accent hover:underline">Upgrade</a>{' '}
            for clean reports + SEBI CSCRF mapping.
          </p>
        )}
      </div>

      <PDFMetadataModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        onSubmit={(meta) => triggerDownload('pdf', meta)}
        isFreeTier={isFreeTier}
        loading={pdfLoading}
      />
    </>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SBOMResults() {
  const { scanId } = useParams()
  const navigate   = useNavigate()

  const {
    scan,
    progress,
    timeRemaining,
    sendToBackground,
    stopPolling,
    error,
    loading,
    timedOut,
  } = useSBOMScan(scanId, {
    onComplete: () => {},   // results panel self-fetches via its own useEffect
  })

  const isProcessing = !timedOut && (scan?.status === 'pending' || scan?.status === 'processing')
  const isFailed     = timedOut || scan?.status === 'failed'
  const isComplete   = scan?.status === 'complete'

  const [showSignupModal, setShowSignupModal] = useState(false)
  const [sbomTier, setSbomTier] = useState('anon')

  // Fetch current user's SBOM tier once on mount (reads JWT claims server-side)
  useEffect(() => {
    api.get('/sbom/tier')
      .then(({ data }) => setSbomTier(data.tier || 'anon'))
      .catch(() => setSbomTier('anon'))
  }, [])

  // ── Loading splash ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <PageWrapper title="SBOM Results">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spinner className="w-8 h-8 text-brand-accent" />
          <p className="text-sm text-brand-muted">Loading scan…</p>
        </div>
      </PageWrapper>
    )
  }

  if (error && !scan) {
    return (
      <PageWrapper title="SBOM Results">
        <div className="flex flex-col items-center gap-4 py-16">
          <AlertTriangle className="w-8 h-8 text-brand-danger" />
          <p className="text-sm text-brand-muted">{error}</p>
          <Button variant="secondary" onClick={() => navigate('/sbom')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> New Scan
          </Button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="SBOM Scan Results">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/sbom')}
          className="text-brand-muted hover:text-brand-text transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Package className="w-5 h-5 text-brand-accent" />
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-brand-text truncate">
            {scan?.original_filename || 'SBOM Scan'}
          </h1>
          <p className="text-xs text-brand-muted font-mono">{scanId}</p>
        </div>
      </div>

      <div className="max-w-3xl space-y-5">

        {/* ── Progress card (pending / processing) ──────────────────────── */}
        {(isProcessing || isFailed) && (
          <>
            <ScanProgressCard
              filename={scan?.original_filename || 'SBOM file'}
              status={timedOut ? 'failed' : scan?.status}
              progress={progress}
              componentCount={scan?.component_count}
              processedCount={scan?.processed_count}
              timeRemaining={timeRemaining}
              errorMessage={timedOut ? 'Scan timed out — the worker may be busy. Try again.' : scan?.error_message}
              onBackground={isProcessing ? () => {
                sendToBackground()
                navigate('/dashboard')
              } : null}
            />
            {isProcessing && (
              <button
                onClick={stopPolling}
                className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-danger transition-colors mx-auto"
              >
                <StopCircle className="w-3.5 h-3.5" />
                Stop checking for updates
              </button>
            )}
          </>
        )}

        {/* ── Complete: summary ──────────────────────────────────────────── */}
        {isComplete && (
          <>
            {/* Ransomware warning — shown prominently at top */}
            <RansomwareBanner count={scan.ransomware_count} />

            {/* Data retention warning */}
            <DataRetentionBanner tier={scan.user_tier} />

            {/* Summary metric cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <SummaryCard
                label="Risk Score"
                value={scan.risk_score != null ? `${scan.risk_score.toFixed(0)}` : '—'}
                valueClass={riskColor(scan.risk_score ?? 0)}
                sub="/ 100"
              />
              <SummaryCard
                label="Components"
                value={scan.component_count ?? 0}
              />
              <SummaryCard
                label="CVE Matches"
                value={scan.vuln_count ?? 0}
                valueClass={(scan.vuln_count ?? 0) > 0 ? 'text-sev-critical-text' : 'text-brand-text'}
              />
              <SummaryCard
                label="KEV Entries"
                value={scan.kev_count ?? 0}
                valueClass={(scan.kev_count ?? 0) > 0 ? 'text-sev-kev-text' : 'text-brand-text'}
                sub={(scan.kev_count ?? 0) > 0 ? 'Actively exploited' : ''}
              />
              <SummaryCard
                label="Ransomware"
                value={scan.ransomware_count ?? 0}
                valueClass={(scan.ransomware_count ?? 0) > 0 ? 'text-orange-400' : 'text-brand-text'}
                sub={(scan.ransomware_count ?? 0) > 0 ? 'India threat intel' : ''}
              />
            </div>

            <SeverityBreakdown
              breakdown={scan.severity_breakdown}
              total={scan.vuln_count ?? 0}
            />

            {/* Top 5 Fix These Now — above the CVE table */}
            <Top5FixCard fixes={scan.top_fixes} />

            {/* Scan meta */}
            <div className="flex flex-wrap gap-4 text-xs text-brand-muted px-1">
              {scan.uploaded_at && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(scan.uploaded_at).toLocaleString()}
                </span>
              )}
              {scan.file_format && (
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  {scan.file_format}
                </span>
              )}
              {scan.file_size_bytes && (
                <span>{(scan.file_size_bytes / 1024).toFixed(1)} KB</span>
              )}
            </div>

            <ResultsPanel scanId={scanId} sbomTier={sbomTier} />

            <DownloadSection
              scanId={scanId}
              scanTier={scan.user_tier}
              sbomTier={sbomTier}
              onLoginRequired={() => setShowSignupModal(true)}
            />

            <div className="flex justify-center pt-1">
              <Button variant="secondary" onClick={() => navigate('/sbom')} className="text-xs">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Scan another file
              </Button>
            </div>
          </>
        )}

      </div>

      <SignupPromptModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        feature="download SBOM reports"
      />
    </PageWrapper>
  )
}
