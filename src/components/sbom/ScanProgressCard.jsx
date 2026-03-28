/**
 * ScanProgressCard — reusable progress UI for any async file scan.
 *
 * Props:
 *   filename       {string}       displayed file name
 *   status         {string}       'pending' | 'processing' | 'complete' | 'failed'
 *   progress       {number}       0-100
 *   componentCount {number|null}  total components (if known)
 *   processedCount {number|null}  components processed so far
 *   timeRemaining  {number|null}  seconds remaining (null = still estimating)
 *   errorMessage   {string|null}
 *   onBackground   {function|null}  called when user clicks "Run in background"
 *   className      {string}
 */

import { Loader2, MinusCircle, Clock, Package, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Card } from '../ui'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtTime(secs) {
  if (secs == null || secs < 0) return null
  if (secs === 0)              return 'Almost done…'
  if (secs < 60)               return `~${secs}s remaining`
  const m = Math.ceil(secs / 60)
  return `~${m} min remaining`
}

function statusLabel(status) {
  if (status === 'pending')    return 'Queued — waiting for worker…'
  if (status === 'processing') return 'Analysing SBOM…'
  if (status === 'complete')   return 'Scan complete'
  if (status === 'failed')     return 'Scan failed'
  return 'Unknown status'
}

// ── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ value, failed }) {
  const width = Math.min(Math.max(value, 0), 100)
  const barColor = failed
    ? 'bg-red-500'
    : value < 30
      ? 'bg-brand-accent2'
      : value < 70
        ? 'bg-amber-500 dark:bg-amber-400'
        : 'bg-brand-success'

  return (
    <div className="relative h-2.5 rounded-full overflow-hidden bg-brand-border">
      {/* Animated shimmer on pending/processing */}
      {!failed && value < 100 && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite] -translate-x-full" />
      )}
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out ${barColor}`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ScanProgressCard({
  filename       = 'SBOM file',
  status         = 'pending',
  progress       = 0,
  componentCount = null,
  processedCount = null,
  timeRemaining  = null,
  errorMessage   = null,
  onBackground   = null,
  className      = '',
}) {
  const isProcessing = status === 'pending' || status === 'processing'
  const isComplete   = status === 'complete'
  const isFailed     = status === 'failed'

  const timeLabel = fmtTime(timeRemaining)

  return (
    <Card className={`space-y-4 ${className}`}>
      {/* ── File + status header ───────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {isProcessing && (
            <Loader2 className="w-5 h-5 shrink-0 text-brand-accent2 animate-spin" />
          )}
          {isComplete && (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-brand-success" />
          )}
          {isFailed && (
            <AlertTriangle className="w-5 h-5 shrink-0 text-brand-danger" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-brand-text truncate">{filename}</p>
            <p className="text-xs text-brand-muted mt-0.5">{statusLabel(status)}</p>
          </div>
        </div>

        {/* Percentage badge */}
        <span className={`shrink-0 text-lg font-bold tabular-nums transition-colors ${
          isFailed ? 'text-brand-danger' :
          isComplete ? 'text-brand-success' :
          'text-brand-accent2'
        }`}>
          {isFailed ? '—' : `${progress}%`}
        </span>
      </div>

      {/* ── Progress bar ───────────────────────────────────────────────── */}
      <ProgressBar value={progress} failed={isFailed} />

      {/* ── Stats row ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-muted">
        {/* Component progress */}
        {componentCount != null && componentCount > 0 && (
          <span className="flex items-center gap-1">
            <Package className="w-3.5 h-3.5" />
            {processedCount != null
              ? `${processedCount} / ${componentCount} components`
              : `${componentCount} components`
            }
          </span>
        )}

        {/* Time remaining */}
        {isProcessing && timeLabel && (
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {timeLabel}
          </span>
        )}

        {/* Still estimating */}
        {isProcessing && !timeLabel && progress > 0 && (
          <span className="flex items-center gap-1 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            Estimating time…
          </span>
        )}

        {/* Error */}
        {isFailed && errorMessage && (
          <span className="text-brand-danger">{errorMessage}</span>
        )}
      </div>

      {/* ── Background button ──────────────────────────────────────────── */}
      {isProcessing && onBackground && (
        <button
          onClick={onBackground}
          className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-accent2 transition-colors"
        >
          <MinusCircle className="w-3.5 h-3.5" />
          Continue in background — I'll notify you when done
        </button>
      )}
    </Card>
  )
}
