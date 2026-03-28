/**
 * ActiveScanBanner — compact scan-in-progress indicator in the TopBar.
 *
 * Reads active scans from localStorage and polls for status.
 * Clicking the banner navigates to the results page.
 * Disappears automatically when the scan completes or fails.
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle2, AlertTriangle, X } from 'lucide-react'
import { getActiveScans } from '../../hooks/useSBOMScan'
import api from '../../lib/api'

const POLL_MS = 4000

export default function ActiveScanBanner() {
  const navigate = useNavigate()
  const [scans,    setScans]    = useState([])
  const [dismissed, setDismissed] = useState(new Set())

  // Poll all active scans
  useEffect(() => {
    let timer = null

    const refresh = async () => {
      const active = getActiveScans().filter(s => !dismissed.has(s.scanId))
      if (active.length === 0) {
        setScans([])
        return
      }

      const updated = await Promise.all(
        active.map(async (a) => {
          try {
            const { data } = await api.get(`/sbom/scan/${a.scanId}`)
            const s = data.scan
            return {
              scanId:   a.scanId,
              filename: s.original_filename || a.filename || 'SBOM',
              status:   s.status,
              progress: s.progress ?? a.progress ?? 0,
            }
          } catch {
            return a
          }
        })
      )

      // Keep only in-flight scans in banner (complete/failed show briefly then go)
      setScans(updated)
      const stillActive = updated.filter(s => s.status === 'pending' || s.status === 'processing')
      if (stillActive.length > 0) {
        timer = setTimeout(refresh, POLL_MS)
      } else {
        // Show result for 5s then clear
        timer = setTimeout(() => setScans([]), 5000)
      }
    }

    refresh()
    return () => clearTimeout(timer)
  }, [dismissed]) // eslint-disable-line react-hooks/exhaustive-deps

  if (scans.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      {scans.map(s => {
        const isActive   = s.status === 'pending' || s.status === 'processing'
        const isComplete = s.status === 'complete'
        const isFailed   = s.status === 'failed'

        return (
          <div
            key={s.scanId}
            className={`flex items-center gap-2 rounded-md px-2.5 py-1 text-xs border cursor-pointer transition-colors ${
              isActive
                ? 'bg-brand-surface border-brand-accent2/40 text-brand-text hover:border-brand-accent2'
                : isComplete
                  ? 'bg-sev-clean-bg border-sev-clean-border text-sev-clean-text'
                  : 'bg-sev-critical-bg border-sev-critical-border text-sev-critical-text'
            }`}
            onClick={() => navigate(`/sbom/scan/${s.scanId}`)}
            title="Click to view scan results"
          >
            {isActive && <Loader2 className="w-3 h-3 animate-spin shrink-0" />}
            {isComplete && <CheckCircle2 className="w-3 h-3 shrink-0" />}
            {isFailed   && <AlertTriangle className="w-3 h-3 shrink-0" />}

            <span className="max-w-[140px] truncate font-medium">{s.filename}</span>

            {isActive && (
              <span className="tabular-nums font-semibold shrink-0">{s.progress}%</span>
            )}
            {isComplete && <span className="shrink-0">Done</span>}
            {isFailed   && <span className="shrink-0">Failed</span>}

            <button
              onClick={(e) => { e.stopPropagation(); setDismissed(d => new Set([...d, s.scanId])) }}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-0.5"
              aria-label="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
