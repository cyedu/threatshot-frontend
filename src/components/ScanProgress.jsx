import { useEffect, useRef } from 'react'
import { Progress, Card } from './ui'
import useScanStore from '../store/scanStore'

export default function ScanProgress({ jobId }) {
  const { progress, setProgress, setResult } = useScanStore()
  const wsRef = useRef(null)

  useEffect(() => {
    if (!jobId) return
    // access_token is an httpOnly cookie — browser sends it automatically on WS handshake
    const wsBase = window.location.origin.replace(/^http/, 'ws')
    const ws = new WebSocket(`${wsBase}/api/v1/ioc/job/${jobId}/stream`)
    wsRef.current = ws

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      if (msg.type === 'progress') setProgress(msg)
      if (msg.type === 'completed') setResult(msg)
    }
    return () => ws.close()
  }, [jobId])

  if (!progress) return null

  const { processed, total, percent, counts = {} } = progress
  return (
    <Card className="space-y-3">
      <div className="flex justify-between text-sm text-brand-muted">
        <span>Scanning {processed} / {total} IOCs</span>
        <span>{percent?.toFixed(1)}%</span>
      </div>
      <Progress value={percent} />
      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {[['critical','red'],['high','orange'],['medium','yellow'],['low','blue'],['clean','green']].map(([k, c]) => (
          <div key={k} className={`text-${c}-400`}>
            <div className="font-bold text-lg">{counts[k] ?? 0}</div>
            <div className="capitalize">{k}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
