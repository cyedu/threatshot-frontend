import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import {
  Upload, FileText, X, ShieldAlert, Package,
  AlertTriangle, CheckCircle2, Hash, Cpu
} from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import { Card, Button, Spinner } from '../../components/ui'
import api from '../../lib/api'

// ─── Constants ──────────────────────────────────────────────────────────────

const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10MB

const ACCEPTED_EXTENSIONS = {
  'application/json': ['.json'],
  'application/xml':  ['.xml'],
  'text/xml':         ['.xml'],
  'text/plain':       ['.xml', '.json'],
}

const FORMAT_CONFIG = {
  'CycloneDX JSON': {
    label: 'CycloneDX JSON',
    badge: 'bg-blue-900/40 border-blue-700 text-blue-300',
  },
  'CycloneDX XML': {
    label: 'CycloneDX XML',
    badge: 'bg-blue-900/40 border-blue-700 text-blue-300',
  },
  'SPDX JSON': {
    label: 'SPDX JSON',
    badge: 'bg-purple-900/40 border-purple-700 text-purple-300',
  },
  'POM.xml': {
    label: 'Maven POM',
    badge: 'bg-orange-900/40 border-orange-700 text-orange-300',
  },
}

const SUPPORTED_FORMATS = [
  { name: 'CycloneDX',  ext: 'JSON · XML', color: 'text-blue-400' },
  { name: 'SPDX',       ext: 'JSON',       color: 'text-purple-400' },
  { name: 'Maven POM',  ext: 'XML',        color: 'text-orange-400' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Detect SBOM format from file content (first 2KB peek).
 * Returns format string or null if unrecognised.
 */
function detectFormat(filename, bytes) {
  const peek = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(0, 2048))
  const lower = peek.toLowerCase()
  const name  = filename.toLowerCase()

  // CycloneDX JSON: must have bomFormat + CycloneDX
  if (name.endsWith('.json') && lower.includes('"bomformat"') && lower.includes('"cyclonedx"')) {
    return 'CycloneDX JSON'
  }
  // SPDX JSON: must have spdxVersion
  if (name.endsWith('.json') && lower.includes('"spdxversion"')) {
    return 'SPDX JSON'
  }
  // CycloneDX XML: CycloneDX namespace in xmlns
  if (name.endsWith('.xml') && lower.includes('cyclonedx.org/schema/bom')) {
    return 'CycloneDX XML'
  }
  // POM.xml: Maven project structure
  if (name.endsWith('.xml') && lower.includes('<project') && lower.includes('<dependencies')) {
    return 'POM.xml'
  }

  return null
}

/**
 * Compute SHA-256 of a File using the Web Crypto API.
 * Returns lowercase hex string.
 */
async function computeSHA256(file) {
  const buffer     = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function formatBytes(bytes) {
  if (bytes < 1024)       return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FormatBadge({ format }) {
  const cfg = FORMAT_CONFIG[format]
  if (!cfg) return null
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded border ${cfg.badge}`}>
      {cfg.label}
    </span>
  )
}

function SupportedBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
      {SUPPORTED_FORMATS.map(f => (
        <span key={f.name} className="flex items-center gap-1 text-xs bg-brand-bg border border-brand-border rounded px-2 py-0.5">
          <span className={`font-semibold ${f.color}`}>{f.name}</span>
          <span className="text-brand-muted">{f.ext}</span>
        </span>
      ))}
    </div>
  )
}

function FileCard({ file, format, sha256, onRemove }) {
  const cfg = FORMAT_CONFIG[format]

  return (
    <div className="border border-brand-border bg-brand-bg rounded-lg p-4 space-y-3">
      {/* File info row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-9 h-9 rounded-md bg-brand-surface border border-brand-border flex items-center justify-center">
            <FileText className="w-4 h-4 text-brand-accent2" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-brand-text truncate">{file.name}</p>
            <p className="text-xs text-brand-muted">{formatBytes(file.size)}</p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="shrink-0 text-brand-muted hover:text-brand-text transition-colors"
          aria-label="Remove file"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Detected format */}
      <div className="flex items-center gap-2 text-xs">
        <Cpu className="w-3.5 h-3.5 text-brand-muted shrink-0" />
        <span className="text-brand-muted">Detected format:</span>
        {cfg
          ? <FormatBadge format={format} />
          : <span className="text-brand-danger text-xs">Unrecognised — please upload CycloneDX, SPDX, or POM.xml</span>
        }
      </div>

      {/* SHA-256 hash */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-brand-muted">
          <Hash className="w-3.5 h-3.5 shrink-0" />
          <span>File integrity hash (SHA-256)</span>
        </div>
        {sha256
          ? (
            <div className="font-mono text-[11px] text-brand-muted bg-brand-surface border border-brand-border rounded px-3 py-1.5 break-all select-all">
              {sha256}
            </div>
          )
          : (
            <div className="flex items-center gap-2 text-xs text-brand-muted">
              <Spinner className="w-3 h-3" /> Computing…
            </div>
          )
        }
      </div>
    </div>
  )
}

function ErrorBanner({ message, onDismiss }) {
  return (
    <div className="flex items-start gap-3 bg-red-950/30 border border-red-800 rounded-lg p-3">
      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
      <p className="text-sm text-red-300 flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-400 hover:text-red-200 shrink-0">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SBOMScanner() {
  const navigate = useNavigate()
  const [state, setState]     = useState('idle')      // idle | file_selected | scanning | error
  const [file, setFile]       = useState(null)
  const [format, setFormat]   = useState(null)
  const [sha256, setSha256]   = useState(null)
  const [error, setError]     = useState(null)

  // ── File processing after drop/select ─────────────────────────────────────
  const processFile = useCallback(async (accepted, rejected) => {
    setError(null)

    // react-dropzone size rejection
    if (rejected?.length > 0) {
      const err = rejected[0].errors?.[0]
      if (err?.code === 'file-too-large') {
        setError('File too large. Maximum size is 10MB.')
      } else {
        setError('Unsupported file type. Please upload a .json or .xml file.')
      }
      return
    }

    if (!accepted?.length) return

    const picked = accepted[0]

    // Guard: double-check size
    if (picked.size > MAX_FILE_BYTES) {
      setError('File too large. Maximum size is 10MB.')
      return
    }

    // Read first 2KB for format detection
    const slice      = picked.slice(0, 2048)
    const sliceBytes = new Uint8Array(await slice.arrayBuffer())
    const detected   = detectFormat(picked.name, sliceBytes)

    if (!detected) {
      setError(
        'Unsupported file format. Please upload a CycloneDX (JSON or XML), SPDX (JSON), or Maven POM.xml file.'
      )
      return
    }

    setFile(picked)
    setFormat(detected)
    setSha256(null)
    setState('file_selected')

    // Compute SHA-256 asynchronously (doesn't block UI)
    computeSHA256(picked)
      .then(hash => setSha256(hash))
      .catch(() => setSha256('(hash unavailable)'))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop:       processFile,
    accept:       ACCEPTED_EXTENSIONS,
    maxSize:      MAX_FILE_BYTES,
    multiple:     false,
    disabled:     state === 'scanning',
  })

  // ── Remove selected file ───────────────────────────────────────────────────
  const handleRemove = () => {
    setFile(null)
    setFormat(null)
    setSha256(null)
    setError(null)
    setState('idle')
  }

  // ── Trigger scan ──────────────────────────────────────────────────────────
  const handleScan = async () => {
    if (!file || !format) return
    setError(null)
    setState('scanning')

    try {
      const form = new FormData()
      form.append('file', file)

      const { data } = await api.post('/sbom/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      navigate(`/sbom/scan/${data.scan_id}`)
    } catch (err) {
      const msg = err.response?.data?.detail
        || err.response?.data?.message
        || 'Unable to reach scan service. Please try again.'
      setError(msg)
      setState('file_selected')
    }
  }

  // ── Drop zone border style ─────────────────────────────────────────────────
  const dropBorder = isDragActive
    ? 'border-brand-accent bg-red-950/10'
    : state === 'file_selected'
      ? 'border-brand-border'
      : 'border-brand-border hover:border-brand-accent2 hover:bg-brand-surface/50'

  return (
    <PageWrapper title="SBOM Scanner">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Package className="w-6 h-6 text-brand-accent" />
          <h1 className="text-xl font-bold text-brand-text">SBOM Scanner</h1>
        </div>
        <p className="text-sm text-brand-muted ml-9">
          Upload any Software Bill of Materials for instant vulnerability intelligence.
          No account required to scan.
        </p>
      </div>

      <div className="max-w-2xl space-y-4">

        {/* ── Format support badges ─────────────────────────────────────── */}
        <Card className="py-3">
          <p className="text-xs text-brand-muted text-center mb-1">Supported formats</p>
          <SupportedBadges />
        </Card>

        {/* ── Upload zone ───────────────────────────────────────────────── */}
        {state !== 'file_selected' && state !== 'scanning' && (
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-lg p-10
              flex flex-col items-center justify-center gap-3
              cursor-pointer transition-all duration-150 select-none
              ${dropBorder}
            `}
          >
            <input {...getInputProps()} />

            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
              ${isDragActive ? 'bg-red-900/30' : 'bg-brand-surface'}`}>
              <Upload className={`w-6 h-6 transition-colors
                ${isDragActive ? 'text-brand-accent' : 'text-brand-muted'}`} />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-brand-text">
                {isDragActive ? 'Drop your SBOM file here' : 'Drop your SBOM file here or click to browse'}
              </p>
              <p className="text-xs text-brand-muted mt-1">
                CycloneDX or SPDX (JSON / XML) · Maven POM.xml · Max 10MB
              </p>
            </div>
          </div>
        )}

        {/* ── Error banner ─────────────────────────────────────────────── */}
        {error && (
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        )}

        {/* ── File selected state ───────────────────────────────────────── */}
        {(state === 'file_selected' || state === 'scanning') && file && (
          <FileCard
            file={file}
            format={format}
            sha256={sha256}
            onRemove={state === 'scanning' ? undefined : handleRemove}
          />
        )}

        {/* ── Scan button / loading ─────────────────────────────────────── */}
        {state === 'file_selected' && (
          <Button
            onClick={handleScan}
            disabled={!format}
            className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            Scan for Vulnerabilities
          </Button>
        )}

        {state === 'scanning' && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Spinner className="w-8 h-8 text-brand-accent" />
            <p className="text-sm text-brand-muted">Analysing your SBOM…</p>
            <p className="text-xs text-brand-muted opacity-60">
              Matching components against CVE database
            </p>
          </div>
        )}

        {/* ── Info footer ─────────────────────────────────────────────────── */}
        {state === 'idle' && (
          <div className="flex items-start gap-2 text-xs text-brand-muted px-1">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-brand-success" />
            <span>
              Your SBOM is never shared. Files are stored encrypted and automatically
              deleted within 24 hours for free scans.
            </span>
          </div>
        )}

      </div>
    </PageWrapper>
  )
}
