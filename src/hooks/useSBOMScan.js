/**
 * useSBOMScan — reusable hook for polling SBOM scan status.
 *
 * Features:
 *  - Polls GET /api/v1/sbom/scan/{scanId} at configurable interval
 *  - Reports real-time progress (0-100) from backend + client-side estimate
 *  - Estimates time remaining based on elapsed time + current progress
 *  - Persists active scans in localStorage so polling survives navigation
 *  - Exposes `sendToBackground()` to let user navigate away without losing state
 *
 * @param {string} scanId
 * @param {object} options
 * @param {number}  [options.pollInterval=3000]   ms between polls
 * @param {number}  [options.maxAttempts=40]       stop polling after N attempts (~2 min)
 * @param {function} [options.onComplete]          called when scan.status === 'complete'
 * @param {function} [options.onFailed]            called when scan.status === 'failed'
 *
 * @returns {{
 *   scan: object|null,
 *   progress: number,        // 0-100
 *   timeRemaining: number|null,  // seconds, null while estimating
 *   isBackground: boolean,
 *   sendToBackground: () => void,
 *   bringToForeground: () => void,
 *   stopPolling: () => void,  // cancel polling manually
 *   error: string|null,
 *   loading: boolean,
 *   timedOut: boolean,        // true when maxAttempts exceeded with no terminal state
 * }}
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import api from '../lib/api'

const LS_KEY = 'sbom-active-scans'

// ── localStorage helpers ──────────────────────────────────────────────────────

function loadActiveScans() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveActiveScan(scanId, meta) {
  const all = loadActiveScans()
  all[scanId] = { ...all[scanId], ...meta, updatedAt: Date.now() }
  localStorage.setItem(LS_KEY, JSON.stringify(all))
}

function removeActiveScan(scanId) {
  const all = loadActiveScans()
  delete all[scanId]
  localStorage.setItem(LS_KEY, JSON.stringify(all))
}

export { removeActiveScan }

export function getActiveScans() {
  const all = loadActiveScans()
  // Prune entries older than 2 hours (likely stale)
  const now = Date.now()
  return Object.entries(all)
    .filter(([, v]) => now - (v.updatedAt || 0) < 2 * 60 * 60 * 1000)
    .map(([scanId, meta]) => ({ scanId, ...meta }))
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export default function useSBOMScan(scanId, {
  pollInterval  = 3000,
  maxAttempts   = 40,
  onComplete    = null,
  onFailed      = null,
} = {}) {
  const [scan,          setScan]          = useState(null)
  const [progress,      setProgress]      = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [isBackground,  setIsBackground]  = useState(false)
  const [error,         setError]         = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [timedOut,      setTimedOut]      = useState(false)

  const attemptsRef    = useRef(0)
  const timerRef       = useRef(null)
  const startTimeRef   = useRef(null)     // when status first became 'processing'
  const lastProgressRef = useRef(0)
  const stoppedRef     = useRef(false)    // set true to cancel polling

  // ── Estimate time remaining ──────────────────────────────────────────────────
  const estimateTimeRemaining = useCallback((pct) => {
    if (!startTimeRef.current || pct <= 0) return null
    const elapsed = (Date.now() - startTimeRef.current) / 1000   // seconds
    if (pct >= 100) return 0
    // Linear extrapolation: elapsed maps to pct%, so total = elapsed / (pct/100)
    const estimatedTotal = elapsed / (pct / 100)
    const remaining = Math.max(0, Math.ceil(estimatedTotal - elapsed))
    return remaining
  }, [])

  // ── Fetch one poll ────────────────────────────────────────────────────────────
  const fetchScan = useCallback(async () => {
    if (!scanId) return null
    try {
      const { data } = await api.get(`/sbom/scan/${scanId}`)
      return data.scan
    } catch (e) {
      const err = new Error(e.response?.data?.detail || 'Failed to load scan.')
      err.status = e.response?.status
      throw err
    }
  }, [scanId])

  // ── Polling loop ─────────────────────────────────────────────────────────────
  const poll = useCallback(async () => {
    if (stoppedRef.current) return
    attemptsRef.current += 1

    try {
      const s = await fetchScan()
      if (!s || stoppedRef.current) return

      setScan(s)
      setLoading(false)

      const pct = s.progress ?? 0
      setProgress(pct)
      lastProgressRef.current = pct

      // Track when processing begins for time estimation
      if (s.status === 'processing' && !startTimeRef.current) {
        startTimeRef.current = Date.now()
      }

      setTimeRemaining(estimateTimeRemaining(pct))

      // Persist to localStorage (for background mode)
      saveActiveScan(scanId, {
        filename:  s.original_filename,
        status:    s.status,
        progress:  pct,
        format:    s.file_format,
      })

      // Terminal states — stop polling
      if (s.status === 'complete') {
        removeActiveScan(scanId)
        onComplete?.(s)
        return   // don't reschedule
      }
      if (s.status === 'failed') {
        removeActiveScan(scanId)
        onFailed?.(s)
        return
      }

      // Exceeded attempt cap — treat as timed out
      if (attemptsRef.current >= maxAttempts) {
        removeActiveScan(scanId)
        setTimedOut(true)
        setLoading(false)
        return
      }

      timerRef.current = setTimeout(poll, pollInterval)
    } catch (e) {
      // Scan not found — remove from localStorage so banner stops polling it
      if (e.status === 404) {
        removeActiveScan(scanId)
      }
      setError(e.message)
      setLoading(false)
      // no setTimeout — polling stops here
    }
  }, [fetchScan, scanId, pollInterval, maxAttempts, estimateTimeRemaining, onComplete, onFailed])

  // ── Start polling on mount / scanId change ───────────────────────────────────
  useEffect(() => {
    if (!scanId) return
    attemptsRef.current = 0
    startTimeRef.current = null
    stoppedRef.current = false
    setTimedOut(false)
    poll()
    return () => {
      stoppedRef.current = true
      clearTimeout(timerRef.current)
    }
  }, [scanId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Background mode controls ─────────────────────────────────────────────────
  const sendToBackground = useCallback(() => {
    setIsBackground(true)
    // Polling continues — only the UI "detaches"
  }, [])

  const bringToForeground = useCallback(() => {
    setIsBackground(false)
  }, [])

  // ── Manual cancel ────────────────────────────────────────────────────────────
  const stopPolling = useCallback(() => {
    stoppedRef.current = true
    clearTimeout(timerRef.current)
    removeActiveScan(scanId)
    setTimedOut(true)
    setLoading(false)
  }, [scanId])

  return {
    scan,
    progress,
    timeRemaining,
    isBackground,
    sendToBackground,
    bringToForeground,
    stopPolling,
    error,
    loading,
    timedOut,
  }
}
