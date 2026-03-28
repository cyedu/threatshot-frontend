import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Shield, ShieldAlert, ShieldX, AlertTriangle,
  Package, ExternalLink, ChevronDown, ChevronUp,
  Flame, Activity, Clock, StopCircle
} from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import { Card, Badge, Button, Spinner } from '../../components/ui'
import ScanProgressCard from '../../components/sbom/ScanProgressCard'
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

function CVERow({ result }) {
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

function ResultsPanel({ scanId }) {
  const [results,    setResults]    = useState([])
  const [total,      setTotal]      = useState(0)
  const [page,       setPage]       = useState(1)
  const [severity,   setSeverity]   = useState('')
  const [kevOnly,    setKevOnly]    = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)

  const fetchResults = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, page_size: PAGE_SIZE }
      if (severity) params.severity = severity
      if (kevOnly)  params.kev_only = true
      const { data } = await api.get(`/sbom/scan/${scanId}/results`, { params })
      setResults(data.results)
      setTotal(data.total)
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to load results.')
    } finally {
      setLoading(false)
    }
  }, [scanId, page, severity, kevOnly])

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
          onClick={() => { setKevOnly(k => !k); setPage(1) }}
          className={`text-xs px-2.5 py-1 rounded border transition-colors flex items-center gap-1 ${
            kevOnly
              ? 'bg-sev-kev-bg border-sev-kev-border text-sev-kev-text'
              : 'border-brand-border text-brand-muted hover:text-brand-text'
          }`}
        >
          <Flame className="w-3 h-3" /> KEV Only
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
          {results.map(r => <CVERow key={r._id} result={r} />)}
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
            </div>

            <SeverityBreakdown
              breakdown={scan.severity_breakdown}
              total={scan.vuln_count ?? 0}
            />

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

            <ResultsPanel scanId={scanId} />

            <div className="pt-2 flex justify-center">
              <Button variant="secondary" onClick={() => navigate('/sbom')} className="text-xs">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Scan another file
              </Button>
            </div>
          </>
        )}

      </div>
    </PageWrapper>
  )
}
