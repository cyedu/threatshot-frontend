import { useState, useEffect, useCallback, useRef } from 'react'
import useAuthStore from '../../store/authStore'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Search, Shield, Zap, AlertTriangle, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, ExternalLink, Download, Package, X,
  Database, Lock,
} from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import { Card, Badge, Spinner, Input, Button, Textarea, Alert } from '../../components/ui'
import SignupPromptModal from '../../components/SignupPromptModal'
import api from '../../lib/api'
import { cn } from '../../lib/utils'
import { useSEO } from '../../hooks/useSEO'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SEVERITIES = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NONE']

const SEVERITY_COLOR = {
  CRITICAL: '#dc2626',
  HIGH: '#ea580c',
  MEDIUM: '#ca8a04',
  LOW: '#2563eb',
  NONE: '#64748b',
}

const SEVERITY_BADGE_CLASS = {
  CRITICAL: 'bg-red-900/40 border-red-700 text-red-300',
  HIGH: 'bg-orange-900/40 border-orange-700 text-orange-300',
  MEDIUM: 'bg-yellow-900/40 border-yellow-700 text-yellow-300',
  LOW: 'bg-blue-900/40 border-blue-700 text-blue-300',
  NONE: 'bg-slate-900/40 border-slate-700 text-slate-300',
}

const TABS = ['search', 'sbom']

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function severityColor(sev) {
  return SEVERITY_COLOR[(sev || '').toUpperCase()] ?? SEVERITY_COLOR.NONE
}

function severityBadgeClass(sev) {
  return SEVERITY_BADGE_CLASS[(sev || '').toUpperCase()] ?? SEVERITY_BADGE_CLASS.NONE
}

function formatDate(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

function isLoggedIn() {
  return !!useAuthStore.getState().user
}

// ---------------------------------------------------------------------------
// CVSSGauge — colored arc showing CVSS score
// ---------------------------------------------------------------------------

function CVSSGauge({ score, severity }) {
  const safeScore = score ?? 0
  const max = 10
  const pct = safeScore / max
  const color = severityColor(severity)

  // SVG arc parameters
  const r = 22
  const cx = 28
  const cy = 28
  const circumference = Math.PI * r  // half circle
  const dash = pct * circumference
  const gap = circumference - dash

  return (
    <div className="flex flex-col items-center gap-0.5 shrink-0">
      <svg width="56" height="34" viewBox="0 0 56 38" className="overflow-visible">
        {/* Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#1e293b"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap + 999}`}
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy + 2}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={color}
        >
          {score != null ? safeScore.toFixed(1) : 'N/A'}
        </text>
      </svg>
      <span className="text-[10px] text-brand-muted leading-none">
        {(severity || 'NONE').toUpperCase()}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CVSSVectorBreakdown — parse AV:N/AC:L/... strings
// ---------------------------------------------------------------------------

const VECTOR_LABELS = {
  AV: { label: 'Attack Vector', map: { N: 'Network', A: 'Adjacent', L: 'Local', P: 'Physical' } },
  AC: { label: 'Attack Complexity', map: { L: 'Low', H: 'High' } },
  PR: { label: 'Privileges Required', map: { N: 'None', L: 'Low', H: 'High' } },
  UI: { label: 'User Interaction', map: { N: 'None', R: 'Required' } },
  S: { label: 'Scope', map: { U: 'Unchanged', C: 'Changed' } },
  C: { label: 'Confidentiality', map: { N: 'None', L: 'Low', H: 'High' } },
  I: { label: 'Integrity', map: { N: 'None', L: 'Low', H: 'High' } },
  A: { label: 'Availability', map: { N: 'None', L: 'Low', H: 'High' } },
}

function CVSSVector({ vector }) {
  if (!vector) return null

  // Strip prefix like CVSS:3.1/
  const clean = vector.replace(/^CVSS:\d+\.\d+\//, '')
  const parts = clean.split('/')

  const parsed = parts.map(part => {
    const [key, val] = part.split(':')
    const meta = VECTOR_LABELS[key]
    return {
      key,
      val,
      label: meta?.label ?? key,
      readable: meta?.map?.[val] ?? val,
    }
  })

  return (
    <div className="mt-3">
      <p className="text-xs text-brand-muted font-medium mb-2">CVSS v3 Vector Breakdown</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {parsed.map(({ key, val, label, readable }) => (
          <div key={key} className="bg-brand-bg rounded p-2">
            <p className="text-[10px] text-brand-muted">{label}</p>
            <p className="text-xs text-brand-text font-medium">{readable}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-brand-muted mt-1.5 font-mono">{vector}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CVECard — individual result card
// ---------------------------------------------------------------------------

function CVECard({ item }) {
  const [expanded, setExpanded] = useState(false)

  const sev = (item.cvss_v3_severity || 'NONE').toUpperCase()
  const hasExploit = item.exploit_available
  const inKev = item.in_cisa_kev
  const products = item.affected_products || []
  const cwes = item.cwe_ids || []
  const refs = item.references || []

  return (
    <Card className="transition-all duration-150">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <CVSSGauge score={item.cvss_v3_score} severity={sev} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setExpanded(e => !e)}
              className="font-mono font-bold text-sm text-brand-accent2 hover:text-brand-text transition-colors"
            >
              {item.cve_id}
            </button>

            <span className={cn(
              'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border',
              severityBadgeClass(sev)
            )}>
              {sev}
            </span>

            {hasExploit && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border bg-red-900/50 border-red-600 text-red-300">
                <Zap className="w-2.5 h-2.5" /> EXPLOIT
              </span>
            )}
            {inKev && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border bg-purple-900/50 border-purple-600 text-purple-300">
                <AlertTriangle className="w-2.5 h-2.5" /> CISA KEV
              </span>
            )}
            {cwes.slice(0, 2).map(cwe => (
              <span key={cwe} className="text-[10px] text-brand-muted bg-brand-bg border border-brand-border px-1.5 py-0.5 rounded font-mono">
                {cwe}
              </span>
            ))}
          </div>

          <p className="text-brand-muted text-xs mt-1 line-clamp-2">
            {item.description || 'No description available.'}
          </p>

          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-brand-muted">
            {products.length > 0 && (
              <span className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                {products.length} product{products.length !== 1 ? 's' : ''}
              </span>
            )}
            <span>Published {formatDate(item.published_at)}</span>
            {item.last_modified_at && item.last_modified_at !== item.published_at && (
              <span>Modified {formatDate(item.last_modified_at)}</span>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpanded(e => !e)}
          className="shrink-0 text-brand-muted hover:text-brand-text transition-colors p-1"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-brand-border space-y-4">
          {/* Full description */}
          {item.description && (
            <div>
              <p className="text-xs text-brand-muted font-medium mb-1">Description</p>
              <p className="text-sm text-brand-text leading-relaxed">{item.description}</p>
            </div>
          )}

          {/* CVSS scores */}
          <div className="flex flex-wrap gap-4">
            {item.cvss_v3_score != null && (
              <div className="bg-brand-bg rounded p-3 min-w-[120px]">
                <p className="text-[10px] text-brand-muted mb-1">CVSS v3 Score</p>
                <p className="text-2xl font-bold" style={{ color: severityColor(sev) }}>
                  {item.cvss_v3_score.toFixed(1)}
                </p>
                <p className="text-[10px] text-brand-muted">{sev}</p>
              </div>
            )}
            {item.cvss_v2_score != null && (
              <div className="bg-brand-bg rounded p-3 min-w-[120px]">
                <p className="text-[10px] text-brand-muted mb-1">CVSS v2 Score</p>
                <p className="text-2xl font-bold text-brand-text">
                  {item.cvss_v2_score.toFixed(1)}
                </p>
                <p className="text-[10px] text-brand-muted">{item.cvss_v2_severity || '—'}</p>
              </div>
            )}
          </div>

          {/* CVSS vector breakdown */}
          <CVSSVector vector={item.cvss_v3_vector} />

          {/* CWE IDs */}
          {cwes.length > 0 && (
            <div>
              <p className="text-xs text-brand-muted font-medium mb-2">CWE Weakness IDs</p>
              <div className="flex flex-wrap gap-1.5">
                {cwes.map(cwe => (
                  <a
                    key={cwe}
                    href={`https://cwe.mitre.org/data/definitions/${cwe.replace('CWE-', '')}.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono bg-brand-bg border border-brand-border text-brand-accent2 hover:text-brand-text px-2 py-0.5 rounded transition-colors"
                  >
                    {cwe}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Affected products */}
          {products.length > 0 && (
            <div>
              <p className="text-xs text-brand-muted font-medium mb-2">
                Affected Products ({products.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto">
                {products.map((p, i) => (
                  <div key={i} className="bg-brand-bg rounded px-2 py-1.5 text-xs">
                    <span className="text-brand-text font-medium">{p.product}</span>
                    <span className="text-brand-muted"> by {p.vendor}</span>
                    {p.version && <span className="text-brand-muted"> v{p.version}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exploit refs */}
          {hasExploit && item.exploit_refs?.length > 0 && (
            <div>
              <p className="text-xs text-red-400 font-medium mb-2">Exploit References</p>
              <div className="space-y-1">
                {item.exploit_refs.map((ref, i) => (
                  <a
                    key={i}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{ref.url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {refs.length > 0 && (
            <div>
              <p className="text-xs text-brand-muted font-medium mb-2">
                References ({refs.length})
              </p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {refs.map((ref, i) => (
                  <a
                    key={i}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-1.5 text-xs text-brand-muted hover:text-brand-accent2 transition-colors group"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0 mt-0.5 group-hover:text-brand-accent2" />
                    <span className="truncate">{ref.url}</span>
                    {ref.tags?.length > 0 && (
                      <span className="shrink-0 text-[10px] text-brand-muted ml-auto">
                        {ref.tags.join(', ')}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* NVD link */}
          <a
            href={`https://nvd.nist.gov/vuln/detail/${item.cve_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-brand-accent2 hover:text-brand-text transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            View on NVD
          </a>
        </div>
      )}
    </Card>
  )
}

// ---------------------------------------------------------------------------
// StatsBar
// ---------------------------------------------------------------------------

function StatsBar({ total, critical, withExploit, inKev, loading,
  activeSeverity, activeExploit, activeKev,
  onCritical, onExploit, onKev,
}) {
  const fmt = (v) => v != null ? v.toLocaleString() : '—'

  const items = [
    {
      label: 'Matching CVEs', value: fmt(total),
      icon: Database, color: 'text-brand-accent2',
      active: false, onClick: null,
      activeBorder: '', activeBg: '',
    },
    {
      label: 'Critical', value: fmt(critical),
      icon: AlertTriangle, color: 'text-red-400',
      active: activeSeverity === 'CRITICAL', onClick: onCritical,
      activeBorder: 'border-red-600', activeBg: 'bg-red-950/40',
    },
    {
      label: 'With Exploit', value: fmt(withExploit),
      icon: Zap, color: 'text-orange-400',
      active: activeExploit, onClick: onExploit,
      activeBorder: 'border-orange-600', activeBg: 'bg-orange-950/40',
    },
    {
      label: 'CISA KEV', value: fmt(inKev),
      icon: Shield, color: 'text-purple-400',
      active: activeKev, onClick: onKev,
      activeBorder: 'border-purple-600', activeBg: 'bg-purple-950/40',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map(({ label, value, icon: Icon, color, active, onClick, activeBorder, activeBg }) => {
        const isClickable = !!onClick
        return (
          <Card
            key={label}
            onClick={onClick ?? undefined}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
            className={cn(
              'flex items-center gap-3 py-3 transition-all duration-150',
              isClickable && 'cursor-pointer hover:border-brand-muted select-none',
              active && activeBorder,
              active && activeBg,
            )}
          >
            <Icon className={cn('w-5 h-5 shrink-0', color)} />
            <div>
              <p className="text-xs text-brand-muted flex items-center gap-1">
                {label}
                {active && <span className="text-[9px] font-bold uppercase tracking-wide text-white bg-brand-accent px-1 rounded">ON</span>}
              </p>
              <p className={cn('text-lg font-bold', color)}>
                {loading ? <span className="opacity-40">…</span> : value}
              </p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SBOMChecker
// ---------------------------------------------------------------------------

function SBOMChecker() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const loggedIn = isLoggedIn()

  const mutation = useMutation({
    mutationFn: (packages) => api.post('/cve/sbom-check', { packages }).then(r => r.data),
    onSuccess: (data) => {
      setResults(data.data)
      setError(null)
    },
    onError: (err) => {
      setError(err.response?.data?.detail || 'SBOM check failed.')
    },
  })

  const parseInput = () => {
    const text = input.trim()
    if (!text) return []

    // Try JSON first
    try {
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed)) {
        return parsed.map(item => {
          if (typeof item === 'string') return { name: item, version: '' }
          return { name: item.name || item.package || '', version: item.version || '' }
        })
      }
    } catch {
      // Fallback: one package per line, optional @version
      return text.split('\n').map(line => {
        const parts = line.trim().split(/[@\s]+/)
        return { name: parts[0] || '', version: parts[1] || '' }
      }).filter(p => p.name)
    }
    return []
  }

  const handleCheck = () => {
    const packages = parseInput()
    if (!packages.length) {
      setError('Enter at least one package name.')
      return
    }
    mutation.mutate(packages)
  }

  if (!loggedIn) {
    return (
      <Card className="py-12 flex flex-col items-center gap-4 text-center">
        <Lock className="w-10 h-10 text-brand-muted" />
        <div>
          <p className="text-brand-text font-medium">Login required</p>
          <p className="text-brand-muted text-sm mt-1">SBOM checking requires an account. Sign in to use this feature.</p>
        </div>
        <Button variant="primary" onClick={() => window.location.href = '/login'}>
          Sign In
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm text-brand-text font-medium mb-1">Paste packages to check</p>
        <p className="text-xs text-brand-muted mb-3">
          One package per line (e.g. <code className="bg-brand-bg px-1 rounded">express@4.18.2</code>), or paste JSON array like{' '}
          <code className="bg-brand-bg px-1 rounded">[{'{'}name:"express",version:"4.18.2"{'}'}]</code>. Max 50 packages.
        </p>
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={'express@4.18.2\nlodash@4.17.15\nlog4j@2.14.1'}
          rows={8}
          className="font-mono text-sm"
        />
        <div className="flex justify-end mt-3">
          <Button
            variant="primary"
            onClick={handleCheck}
            disabled={mutation.isPending}
            className="flex items-center gap-2"
          >
            {mutation.isPending ? <Spinner className="w-4 h-4" /> : <Package className="w-4 h-4" />}
            Check Vulnerabilities
          </Button>
        </div>
      </Card>

      {error && <Alert variant="error">{error}</Alert>}

      {results !== null && (
        <Card>
          <p className="text-sm font-medium text-brand-text mb-3">
            {results.length === 0
              ? 'No critical/high/medium CVEs found for these packages.'
              : `${results.length} CVE match${results.length !== 1 ? 'es' : ''} found`}
          </p>
          {results.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-brand-muted border-b border-brand-border">
                    <th className="pb-2 pr-4">Package</th>
                    <th className="pb-2 pr-4">CVE ID</th>
                    <th className="pb-2 pr-4">CVSS v3</th>
                    <th className="pb-2 pr-4">Severity</th>
                    <th className="pb-2 pr-4">Exploit</th>
                    <th className="pb-2">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {results.map((row, i) => (
                    <tr key={i} className="text-xs">
                      <td className="py-2 pr-4 font-mono text-brand-text">
                        {row.package}{row.version ? `@${row.version}` : ''}
                      </td>
                      <td className="py-2 pr-4">
                        <a
                          href={`https://nvd.nist.gov/vuln/detail/${row.cve_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-brand-accent2 hover:text-brand-text transition-colors"
                        >
                          {row.cve_id}
                        </a>
                      </td>
                      <td className="py-2 pr-4 font-bold" style={{ color: severityColor(row.cvss_v3_severity) }}>
                        {row.cvss_v3_score?.toFixed(1) ?? '—'}
                      </td>
                      <td className="py-2 pr-4">
                        <span className={cn(
                          'px-1.5 py-0.5 rounded text-[10px] font-bold border',
                          severityBadgeClass(row.cvss_v3_severity)
                        )}>
                          {(row.cvss_v3_severity || 'N/A').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        {row.exploit_available ? (
                          <span className="text-red-400 font-bold">YES</span>
                        ) : (
                          <span className="text-brand-muted">No</span>
                        )}
                        {row.in_cisa_kev && (
                          <span className="ml-1.5 text-purple-400 text-[10px] font-bold">KEV</span>
                        )}
                      </td>
                      <td className="py-2 text-brand-muted max-w-xs truncate">{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main CVESearch page
// ---------------------------------------------------------------------------

export default function CVESearch() {
  const [tab, setTab] = useState('search')
  const [q, setQ] = useState('')
  const [qInput, setQInput] = useState('')
  const [severity, setSeverity] = useState('ALL')
  const [exploitOnly, setExploitOnly] = useState(false)
  const [kevOnly, setKevOnly] = useState(false)
  const [minScore, setMinScore] = useState('')
  const [maxScore, setMaxScore] = useState('')
  const [page, setPage] = useState(1)
  const [version, setVersion] = useState('')
  const [versionInput, setVersionInput] = useState('')
  const [downloadFormat, setDownloadFormat] = useState('csv')
  const [downloadError, setDownloadError] = useState(null)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const loggedIn = isLoggedIn()

  useSEO({
    title: 'CVE Vulnerability Database — Search CVEs with CVSS & Exploit Data',
    description:
      'Search the full CVE database with CVSS v3/v4 scores, exploit availability, CISA KEV status, and affected products. Export results as CSV or JSON. Free for Indian security teams.',
    keywords:
      'CVE search, CVSS score, CISA KEV, NVD vulnerability database, exploit database, vulnerability management, CVE lookup, security vulnerability India',
    canonical: 'https://threatshot.in/cve',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'ThreatShot CVE Vulnerability Database',
      description:
        'Searchable CVE database with CVSS v3/v4 scores, exploit availability flags, CISA Known Exploited Vulnerabilities (KEV) status, CWE classifications, and affected product listings. Sourced from NVD.',
      url: 'https://threatshot.in/cve',
      creator: { '@type': 'Organization', name: 'ThreatShot', url: 'https://threatshot.in' },
      license: 'https://nvd.nist.gov/vuln/data-feeds',
      keywords: ['CVE', 'CVSS', 'vulnerability', 'CISA KEV', 'NVD', 'exploit', 'cybersecurity'],
      inLanguage: 'en-IN',
    },
  })

  const hasFilters = q || severity !== 'ALL' || exploitOnly || kevOnly || minScore || maxScore || version

  // Build query params
  const params = new URLSearchParams({ page, per_page: 20 })
  if (q) params.set('q', q)
  if (severity !== 'ALL') params.set('severity', severity)
  if (exploitOnly) params.set('exploit_only', 'true')
  if (kevOnly) params.set('kev_only', 'true')
  if (minScore !== '') params.set('min_score', minScore)
  if (maxScore !== '') params.set('max_score', maxScore)
  if (version) params.set('version', version)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['cve-search', q, severity, exploitOnly, kevOnly, minScore, maxScore, version, page],
    queryFn: () => api.get(`/cve/?${params}`).then(r => r.data),
    keepPreviousData: true,
    staleTime: 60 * 1000,
  })

  const items = data?.data ?? []
  const meta = data?.meta ?? {}

  // Context-aware stats — only when filters/search are active, blank otherwise
  const baseFilterKey = [q, severity, exploitOnly, kevOnly, minScore, maxScore, version]

  const buildCountParams = (overrides = {}) => {
    const p = new URLSearchParams({ page: 1, per_page: 1 })
    if (q) p.set('q', q)
    if (severity !== 'ALL') p.set('severity', severity)
    if (exploitOnly) p.set('exploit_only', 'true')
    if (kevOnly) p.set('kev_only', 'true')
    if (minScore !== '') p.set('min_score', minScore)
    if (maxScore !== '') p.set('max_score', maxScore)
    if (version) p.set('version', version)
    Object.entries(overrides).forEach(([k, v]) => p.set(k, v))
    return p
  }

  const countQueryOpts = { enabled: !!hasFilters, staleTime: 60 * 1000 }

  const { data: criticalData, isFetching: critFetching } = useQuery({
    queryKey: ['cve-count-critical', ...baseFilterKey],
    queryFn: () => api.get(`/cve/?${buildCountParams({ severity: 'CRITICAL' })}`).then(r => r.data.meta?.total ?? 0),
    ...countQueryOpts,
  })
  const { data: exploitData, isFetching: exploitFetching } = useQuery({
    queryKey: ['cve-count-exploit', ...baseFilterKey],
    queryFn: () => api.get(`/cve/?${buildCountParams({ exploit_only: 'true' })}`).then(r => r.data.meta?.total ?? 0),
    ...countQueryOpts,
  })
  const { data: kevData, isFetching: kevFetching } = useQuery({
    queryKey: ['cve-count-kev', ...baseFilterKey],
    queryFn: () => api.get(`/cve/?${buildCountParams({ kev_only: 'true' })}`).then(r => r.data.meta?.total ?? 0),
    ...countQueryOpts,
  })

  const statsLoading = critFetching || exploitFetching || kevFetching

  const handleSearch = (e) => {
    e.preventDefault()
    setQ(qInput)
    setVersion(versionInput)
    setPage(1)
  }

  const handleSeverityChip = (sev) => {
    setSeverity(sev)
    setPage(1)
  }

  // StatsBar card click handlers — toggle filter on/off
  const handleCriticalCard = () => {
    setSeverity(prev => prev === 'CRITICAL' ? 'ALL' : 'CRITICAL')
    setPage(1)
  }
  const handleExploitCard = () => {
    setExploitOnly(prev => !prev)
    setPage(1)
  }
  const handleKevCard = () => {
    setKevOnly(prev => !prev)
    setPage(1)
  }

  const handleClearFilters = () => {
    setQ('')
    setQInput('')
    setVersion('')
    setVersionInput('')
    setSeverity('ALL')
    setExploitOnly(false)
    setKevOnly(false)
    setMinScore('')
    setMaxScore('')
    setPage(1)
  }

  const handleDownload = async () => {
    if (!loggedIn) {
      setShowSignupModal(true)
      return
    }
    setDownloadError(null)
    try {
      const dlParams = new URLSearchParams()
      if (q) dlParams.set('q', q)
      if (severity !== 'ALL') dlParams.set('severity', severity)
      if (exploitOnly) dlParams.set('exploit_only', 'true')
      if (kevOnly) dlParams.set('kev_only', 'true')
      if (minScore !== '') dlParams.set('min_score', minScore)
      if (maxScore !== '') dlParams.set('max_score', maxScore)
      dlParams.set('format', downloadFormat)

      // access_token is an httpOnly cookie — sent automatically with credentials
      const response = await fetch(`/api/v1/cve/download?${dlParams}`, {
        credentials: 'include',
      })
      if (!response.ok) {
        setDownloadError('Download failed. Please try again.')
        return
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cve-export-${new Date().toISOString().slice(0, 10)}.${downloadFormat}`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setDownloadError('Download failed. Please try again.')
    }
  }

  return (
    <PageWrapper title="CVE Intelligence">
      <div className="space-y-5">

        {/* SEO heading */}
        <div>
          <h1 className="text-xl font-bold text-brand-text">CVE Search</h1>
          <p className="text-brand-muted text-sm mt-0.5">
            Search vulnerabilities from NVD. Updated daily. Filter by severity, CVSS score, exploit availability, and CISA KEV status.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-brand-border">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
                tab === t
                  ? 'border-brand-accent text-brand-text'
                  : 'border-transparent text-brand-muted hover:text-brand-text'
              )}
            >
              {t === 'search' ? 'Search CVEs' : 'SBOM Check'}
            </button>
          ))}
        </div>

        {/* SBOM Tab */}
        {tab === 'sbom' && <SBOMChecker />}

        {/* Search Tab */}
        {tab === 'search' && (
          <div className="space-y-4">
            {/* Search input — always at the top */}
            <form onSubmit={handleSearch} className="space-y-2">
              {/* Row 1: search input + search/clear buttons */}
              <div className="flex gap-2">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
                  <Input
                    value={qInput}
                    onChange={e => setQInput(e.target.value)}
                    placeholder="CVE-2021-44228, log4j, openssl…"
                    className="pl-9"
                  />
                </div>
                <Button type="submit" variant="primary" className="shrink-0">
                  <Search className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
                {hasFilters && (
                  <Button type="button" variant="ghost" onClick={handleClearFilters} className="shrink-0">
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Row 2: version filter (full width on mobile) */}
              <div
                className="relative"
                title="Filter by specific affected version (e.g. 3.9, 2.14.1). Press Enter or Search to apply."
              >
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-brand-muted font-medium pointer-events-none select-none">
                  v
                </span>
                <input
                  value={versionInput}
                  onChange={e => setVersionInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setQ(qInput); setVersion(versionInput); setPage(1) } }}
                  placeholder="Filter by version (optional, e.g. 3.9, 2.14.1)"
                  className={cn(
                    'w-full pl-6 pr-3 py-2 bg-brand-bg border rounded-md text-brand-text text-xs focus:outline-none focus:border-brand-accent2 placeholder:text-brand-muted',
                    version && versionInput === version ? 'border-brand-accent2' : 'border-brand-border'
                  )}
                />
              </div>

              {/* Version hint */}
              {versionInput && (
                <p className="text-[11px] pl-0.5">
                  {versionInput !== version
                    ? <span className="text-brand-muted">Press <kbd className="bg-brand-surface border border-brand-border rounded px-1 text-[10px]">Enter</kbd> or <span className="font-medium text-brand-text">Search</span> to filter by version <span className="font-mono text-brand-accent2">{versionInput}</span></span>
                    : <span className="text-brand-muted">Showing CVEs with explicit <span className="font-mono text-brand-accent2">v{version}</span> in NVD data · <button type="button" onClick={() => { setVersion(''); setVersionInput(''); setPage(1) }} className="text-brand-accent hover:text-brand-text underline">clear</button></span>
                  }
                </p>
              )}
            </form>

            {/* Filters row */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* Severity chips */}
              <div className="flex gap-1.5 flex-wrap">
                {SEVERITIES.map(sev => (
                  <button
                    key={sev}
                    onClick={() => handleSeverityChip(sev)}
                    className={cn(
                      'px-2.5 py-1 rounded text-xs font-medium border transition-colors',
                      severity === sev
                        ? sev === 'ALL'
                          ? 'bg-brand-accent border-brand-accent text-white'
                          : `border-transparent text-white`
                        : 'bg-brand-bg border-brand-border text-brand-muted hover:text-brand-text'
                    )}
                    style={severity === sev && sev !== 'ALL' ? {
                      backgroundColor: severityColor(sev) + '33',
                      borderColor: severityColor(sev),
                      color: severityColor(sev),
                    } : {}}
                  >
                    {sev}
                  </button>
                ))}
              </div>

              {/* Toggle badges */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => { setExploitOnly(e => !e); setPage(1) }}
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors',
                    exploitOnly
                      ? 'bg-red-900/50 border-red-600 text-red-300'
                      : 'bg-brand-bg border-brand-border text-brand-muted hover:text-brand-text'
                  )}
                >
                  <Zap className="w-3 h-3" />
                  Exploit Available
                </button>
                <button
                  onClick={() => { setKevOnly(e => !e); setPage(1) }}
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors',
                    kevOnly
                      ? 'bg-purple-900/50 border-purple-600 text-purple-300'
                      : 'bg-brand-bg border-brand-border text-brand-muted hover:text-brand-text'
                  )}
                >
                  <Shield className="w-3 h-3" />
                  CISA KEV
                </button>
              </div>

              {/* CVSS range */}
              <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                <span>Score:</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={minScore}
                  onChange={e => { setMinScore(e.target.value); setPage(1) }}
                  placeholder="0"
                  className="w-14 bg-brand-bg border border-brand-border rounded px-2 py-1 text-brand-text text-xs focus:outline-none focus:border-brand-accent2"
                />
                <span>–</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={maxScore}
                  onChange={e => { setMaxScore(e.target.value); setPage(1) }}
                  placeholder="10"
                  className="w-14 bg-brand-bg border border-brand-border rounded px-2 py-1 text-brand-text text-xs focus:outline-none focus:border-brand-accent2"
                />
              </div>
            </div>

            {/* Stats — only shown when a search/filter is active; counts reflect current query */}
            {hasFilters && (
              <StatsBar
                total={meta.total}
                critical={criticalData}
                withExploit={exploitData}
                inKev={kevData}
                loading={isFetching || statsLoading}
                activeSeverity={severity}
                activeExploit={exploitOnly}
                activeKev={kevOnly}
                onCritical={handleCriticalCard}
                onExploit={handleExploitCard}
                onKev={handleKevCard}
              />
            )}

            {/* Results meta + download */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-brand-muted text-sm">
                {isLoading ? 'Searching…' : (
                  meta.total != null
                    ? `${meta.total.toLocaleString()} CVE${meta.total !== 1 ? 's' : ''} found`
                    : ''
                )}
                {isFetching && !isLoading && (
                  <span className="ml-2 text-xs text-brand-muted">(updating…)</span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <select
                  value={downloadFormat}
                  onChange={e => setDownloadFormat(e.target.value)}
                  className="text-xs bg-brand-bg border border-brand-border rounded px-2 py-1 text-brand-text focus:outline-none"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
                <Button
                  variant="secondary"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-xs py-1.5 px-3"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </Button>
              </div>
            </div>

            {downloadError && <Alert variant="error">{downloadError}</Alert>}

            {/* Results */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-3">
                {items.map(item => (
                  <CVECard key={item.id} item={item} />
                ))}
                {items.length === 0 && (
                  <Card className="text-center py-16">
                    <p className="text-brand-muted text-sm">
                      {q || hasFilters
                        ? 'No CVEs match your search filters.'
                        : 'CVE database is empty. Run a sync from the admin panel to populate.'}
                    </p>
                    {hasFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="mt-3 text-brand-accent2 text-sm hover:text-brand-text transition-colors"
                      >
                        Clear filters
                      </button>
                    )}
                  </Card>
                )}
              </div>
            )}

            {/* Pagination */}
            {meta.pages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-brand-muted hover:text-brand-text disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="text-brand-muted text-sm">
                  Page {page} of {meta.pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
                  disabled={page === meta.pages}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-brand-muted hover:text-brand-text disabled:opacity-40 transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <SignupPromptModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        feature="download CVE reports"
      />
    </PageWrapper>
  )
}
