import { useState, useCallback, useRef } from 'react'
import useAuthStore from '../../store/authStore'
import { useDropzone } from 'react-dropzone'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Search, Upload, X, Copy, Download, Globe, Server,
  ShieldAlert, ShieldCheck, ShieldX, AlertTriangle, Info,
  ChevronDown, ChevronUp, FileText, Database, Activity,
  Tag, Ban, ThumbsUp, Send, Clock, Clipboard, Filter,
  AlertCircle, CheckCircle2, BarChart2, MapPin
} from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import { Card, Button, Spinner, Alert, Progress } from '../../components/ui'
import SignupPromptModal from '../../components/SignupPromptModal'
import ScanProgress from '../../components/ScanProgress'
import useScanStore from '../../store/scanStore'
import api from '../../lib/api'
import { formatRelativeTime } from '../../lib/utils'

// ─── Severity config ───────────────────────────────────────────────────────
const SEV = {
  critical: { label:'CRITICAL', icon:ShieldX,      ring:'#dc2626', bar:'bg-red-600',    badge:'bg-red-900/40 border-red-700 text-red-300',       bg:'border-red-800/60 bg-red-950/20' },
  high:     { label:'HIGH',     icon:ShieldAlert,   ring:'#ea580c', bar:'bg-orange-500', badge:'bg-orange-900/40 border-orange-700 text-orange-300', bg:'border-orange-800/60 bg-orange-950/20' },
  medium:   { label:'MEDIUM',   icon:AlertTriangle, ring:'#ca8a04', bar:'bg-yellow-500', badge:'bg-yellow-900/40 border-yellow-700 text-yellow-300', bg:'border-yellow-800/60 bg-yellow-950/20' },
  low:      { label:'LOW',      icon:Info,          ring:'#2563eb', bar:'bg-blue-600',   badge:'bg-blue-900/40 border-blue-700 text-blue-300',     bg:'border-blue-800/60 bg-blue-950/20' },
  clean:    { label:'CLEAN',    icon:ShieldCheck,   ring:'#16a34a', bar:'bg-green-600',  badge:'bg-green-900/40 border-green-700 text-green-300',   bg:'border-green-800/60 bg-green-950/20' },
}
const getSev = s => SEV[s] ?? SEV.clean

const SOURCES = [
  { value:'manual',  label:'Manual' },
  { value:'cert-in', label:'CERT-IN' },
  { value:'bulk',    label:'Bulk' },
  { value:'others',  label:'Others' },
]

const TAG_ACTORS = {
  'tor':'TOR Network','via-tor':'TOR Network','botnet':'Botnet C2',
  'ransomware':'Ransomware Group','known-distributor':'Malware Distributor',
  'phishing':'Phishing Campaign','rat':'RAT Operator','cobalt-strike':'Cobalt Strike C2',
  'abuse-reported':'Reported for Abuse','cryptominer':'Cryptominer',
}

// ─── Risk gauge ────────────────────────────────────────────────────────────
function RiskGauge({ score=0, severity='clean', size=130 }) {
  const r=46, cx=60, cy=60, circ=2*Math.PI*r, arc=circ*0.75
  const fill = arc * (Math.min(score,100)/100)
  const color = getSev(severity).ring
  return (
    <svg viewBox="0 0 120 100" style={{width:size,height:size*0.84}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="10"
        strokeLinecap="round" strokeDasharray={`${arc} ${circ}`} transform={`rotate(135 ${cx} ${cy})`}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeLinecap="round" strokeDasharray={`${fill} ${circ}`} transform={`rotate(135 ${cx} ${cy})`}
        style={{transition:'stroke-dasharray 0.5s ease'}}/>
      <text x={cx} y={cy+8} textAnchor="middle" fill="white" fontSize="26" fontWeight="700" fontFamily="monospace">
        {Math.round(score)}
      </text>
      <text x={cx} y={cy+22} textAnchor="middle" fill="#64748b" fontSize="10">/ 100</text>
    </svg>
  )
}

// ─── Detection bar ─────────────────────────────────────────────────────────
function DetBar({ label, count, total, color, sub }) {
  const pct = total>0 ? (count/total)*100 : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-brand-muted">{label}{sub && <span className="text-[10px] opacity-60 ml-1">{sub}</span>}</span>
        <span className="font-mono font-semibold" style={{color}}>{count}{total?` / ${total}`:''}</span>
      </div>
      <div className="h-1.5 bg-brand-bg rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{width:`${pct}%`,backgroundColor:color}}/>
      </div>
    </div>
  )
}

// ─── Source badge ──────────────────────────────────────────────────────────
function SourceBadge({ source }) {
  const cfg = {
    'cert-in': 'bg-purple-900/40 border-purple-700 text-purple-300',
    'manual':  'bg-brand-bg border-brand-border text-brand-muted',
    'bulk':    'bg-blue-900/30 border-blue-800 text-blue-300',
    'others':  'bg-gray-800 border-gray-700 text-gray-400',
  }
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${cfg[source] ?? cfg.manual}`}>
      {source}
    </span>
  )
}

// ─── Action buttons ────────────────────────────────────────────────────────
function ActionButtons({ scanId, isFP, actionStatus, onUpdate, compact=false }) {
  const [loading, setLoading] = useState(null)

  const markFP = async () => {
    setLoading('fp')
    try {
      const res = await api.patch(`/ioc/scan/${scanId}/mark-fp`, { note:'' })
      onUpdate?.({ is_false_positive: res.data.is_false_positive, action_status: res.data.action_status })
    } catch(e){ console.error(e) } finally { setLoading(null) }
  }

  const sendBlock = async () => {
    setLoading('block')
    try {
      await api.post('/ioc/bulk-action', { scan_ids:[scanId], action:'block' })
      onUpdate?.({ action_status:'blocked' })
    } catch(e){ console.error(e) } finally { setLoading(null) }
  }

  const base = compact
    ? 'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition-all'
    : 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all'

  return (
    <div className="flex flex-wrap gap-2">
      {/* Block button */}
      <button onClick={sendBlock} disabled={!!loading || actionStatus==='blocked'}
        className={`${base} ${actionStatus==='blocked'
          ? 'bg-red-900/60 border-red-700 text-red-300 opacity-60 cursor-default'
          : 'bg-red-950/30 border-red-800/60 text-red-400 hover:bg-red-900/40 hover:border-red-600'}`}>
        {loading==='block' ? <Spinner className="w-3 h-3"/> : <Ban className="w-3.5 h-3.5"/>}
        {actionStatus==='blocked' ? 'Blocked' : 'Send for Blocking'}
      </button>

      {/* FP button */}
      <button onClick={markFP} disabled={!!loading}
        className={`${base} ${isFP
          ? 'bg-blue-900/40 border-blue-700 text-blue-300'
          : 'bg-brand-bg border-brand-border text-brand-muted hover:border-brand-accent2 hover:text-brand-text'}`}>
        {loading==='fp' ? <Spinner className="w-3 h-3"/> : <ThumbsUp className="w-3.5 h-3.5"/>}
        {isFP ? 'Marked FP' : 'False Positive'}
      </button>
    </div>
  )
}

// ─── Full scan detail ──────────────────────────────────────────────────────
function ScanDetail({ result: initialResult, onClose }) {
  const [result, setResult] = useState(initialResult)
  const sev    = getSev(result.severity)
  const Icon   = sev.icon
  const vt     = result.vt ?? {}
  const abuse  = result.abuseipdb ?? {}
  const vtTotal = vt.total ?? 0
  const actors = [...new Set((result.tags||[]).map(t=>TAG_ACTORS[t]).filter(Boolean))]

  const handleUpdate = (patch) => setResult(r => ({...r, ...patch}))

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(result,null,2)],{type:'application/json'})
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href=url; a.download=`threatshot-${result.ioc.replace(/[^a-z0-9]/gi,'_')}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Verdict banner */}
      <div className={`rounded-2xl border p-4 ${sev.bg}`}>
        <div className="flex items-start gap-3">
          <Icon className="w-6 h-6 shrink-0 mt-0.5" style={{color:sev.ring}}/>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${sev.badge}`}>
                {sev.label} RISK
              </span>
              <SourceBadge source={result.source || 'manual'}/>
              {result.is_false_positive && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border bg-blue-900/30 border-blue-700 text-blue-300">
                  FALSE POSITIVE
                </span>
              )}
              {result.action_status==='blocked' && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border bg-red-900/40 border-red-700 text-red-300">
                  BLOCKED
                </span>
              )}
            </div>
            <p className="font-mono text-brand-text text-sm break-all">{result.ioc}</p>
            <p className="text-xs text-brand-muted mt-0.5 font-mono uppercase">{result.ioc_type}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={()=>navigator.clipboard.writeText(result.ioc)}
              className="p-2 rounded-xl hover:bg-white/10 text-brand-muted hover:text-brand-text transition-colors">
              <Copy className="w-4 h-4"/>
            </button>
            {onClose && (
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-brand-muted hover:text-brand-text transition-colors">
                <X className="w-4 h-4"/>
              </button>
            )}
          </div>
        </div>

        {/* Action buttons inline in banner */}
        {result.id && (
          <div className="mt-3 pl-9">
            <ActionButtons scanId={result.id} isFP={result.is_false_positive}
              actionStatus={result.action_status} onUpdate={handleUpdate}/>
          </div>
        )}
      </div>

      {/* Score + VT + AbuseIPDB + Geo grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

        {/* Risk score */}
        <Card className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-4 gap-2">
          <p className="text-[10px] text-brand-muted uppercase tracking-widest font-medium">Risk Score</p>
          <RiskGauge score={result.risk_score} severity={result.severity} size={110}/>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${sev.badge}`}>
            {sev.label}
          </span>
        </Card>

        {/* VirusTotal */}
        <Card className="space-y-3">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-[#394EFF]/20 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-[#394EFF]">VT</span>
            </div>
            <p className="text-xs font-semibold text-brand-text">VirusTotal</p>
          </div>
          {vtTotal>0 ? (
            <>
              <DetBar label="Malicious"  count={vt.malicious??0} total={vtTotal} color="#ef4444"/>
              <DetBar label="Suspicious" count={vt.suspicious??0} total={vtTotal} color="#f97316"/>
              <DetBar label="Harmless"   count={vtTotal-(vt.malicious??0)-(vt.suspicious??0)} total={vtTotal} color="#22c55e"/>
              <p className="text-xl font-bold font-mono pt-1 border-t border-brand-border" style={{color:sev.ring}}>
                {vt.malicious??0}<span className="text-xs text-brand-muted font-normal"> /{vtTotal} engines</span>
              </p>
            </>
          ) : <p className="text-xs text-brand-muted">No data</p>}
        </Card>

        {/* AbuseIPDB */}
        <Card className="space-y-3">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-orange-900/30 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-orange-400">AB</span>
            </div>
            <p className="text-xs font-semibold text-brand-text">AbuseIPDB</p>
          </div>
          {result.ioc_type==='ip' ? (
            abuse.confidence_score !== undefined ? (
              <>
                <DetBar label="Confidence" count={abuse.confidence_score} total={100} color="#f97316"/>
                {abuse.total_reports>0 && (
                  <p className="text-xs text-brand-muted">{abuse.total_reports} abuse reports</p>
                )}
                {abuse.isp && <p className="text-xs text-brand-muted truncate">ISP: {abuse.isp}</p>}
                {abuse.usage_type && <p className="text-xs text-brand-muted">Usage: {abuse.usage_type}</p>}
                {abuse.is_tor && (
                  <span className="text-[10px] bg-purple-900/30 border border-purple-700 text-purple-300 px-2 py-0.5 rounded">
                    TOR Exit Node
                  </span>
                )}
                <p className="text-xl font-bold font-mono pt-1 border-t border-brand-border text-orange-400">
                  {abuse.confidence_score}%<span className="text-xs text-brand-muted font-normal"> confidence</span>
                </p>
              </>
            ) : <p className="text-xs text-brand-muted">No data</p>
          ) : <p className="text-xs text-brand-muted">IP-only check</p>}
        </Card>

        {/* Network intel */}
        <Card className="space-y-3">
          <p className="text-xs font-semibold text-brand-text">Network Intel</p>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-brand-muted shrink-0 mt-0.5"/>
              <div>
                <p className="text-[10px] text-brand-muted">Origin Country</p>
                <p className="text-brand-text text-sm font-semibold">{result.geo?.country ?? '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Server className="w-3.5 h-3.5 text-brand-muted shrink-0 mt-0.5"/>
              <div className="min-w-0">
                <p className="text-[10px] text-brand-muted">Network Owner</p>
                {result.asn?.asn && <p className="text-[10px] font-mono text-brand-muted">AS{result.asn.asn}</p>}
                <p className="text-brand-text text-xs font-medium truncate">{result.asn?.description ?? '—'}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Threat actors */}
      {actors.length>0 && (
        <Card className="border-red-900/40 bg-red-950/10 space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-400"/>
            <p className="text-xs font-semibold text-red-300 uppercase tracking-wider">Threat Actor Association</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {actors.map((a,i)=>(
              <span key={i} className="text-xs bg-red-900/30 border border-red-800/50 text-red-300 px-3 py-1 rounded-lg">
                {a}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Tags */}
      {result.tags?.length>0 && (
        <Card className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-brand-muted"/>
            <p className="text-xs font-semibold text-brand-text">Behaviour Tags</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {result.tags.map(tag=>(
              <span key={tag} className="text-xs font-mono bg-brand-bg border border-brand-border text-brand-accent px-2.5 py-1 rounded-lg">
                {tag}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Download + copy actions */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={downloadJSON} variant="secondary">
          <Download className="w-4 h-4 mr-1.5"/> Download JSON
        </Button>
        <Button onClick={()=>navigator.clipboard.writeText(result.ioc)} variant="ghost">
          <Copy className="w-4 h-4 mr-1.5"/> Copy IOC
        </Button>
        {onClose && (
          <Button onClick={onClose} variant="ghost"><X className="w-4 h-4 mr-1.5"/> Close</Button>
        )}
      </div>
    </div>
  )
}

// ─── Bulk result with action buttons ──────────────────────────────────────
function BulkResult({ result: bulkResult }) {
  const [fpIds, setFpIds]     = useState(new Set())
  const [blocked, setBlocked] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const qc = useQueryClient()

  const counts   = bulkResult.counts ?? {}
  const allItems = bulkResult.results ?? []

  // Malicious = critical + high + medium
  const malicious = allItems.filter(i => ['critical','high','medium'].includes(i.severity) && !fpIds.has(i.scan_id))
  const fps       = allItems.filter(i => fpIds.has(i.scan_id))
  const clean     = allItems.filter(i => i.severity === 'clean')

  const toggleFP = (id) => setFpIds(s => { const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n })

  const sendBlock = async () => {
    const ids = malicious.map(i=>i.scan_id).filter(Boolean)
    if (!ids.length) return alert('No malicious IOCs to block.')
    setActionLoading('block')
    try {
      await api.post('/ioc/bulk-action', { scan_ids:ids, action:'block' })
      setBlocked(true)
      qc.invalidateQueries({queryKey:['ioc-history']})
    } catch(e){ console.error(e) } finally { setActionLoading(null) }
  }

  const sendFP = async () => {
    const ids = [...fpIds].filter(Boolean)
    if (!ids.length) return
    setActionLoading('fp')
    try {
      await api.post('/ioc/bulk-action', { scan_ids:ids, action:'false_positive' })
      qc.invalidateQueries({queryKey:['ioc-history']})
    } catch(e){ console.error(e) } finally { setActionLoading(null) }
  }

  return (
    <div className="space-y-4">
      {/* Summary counts */}
      <div className="grid grid-cols-5 gap-2">
        {['critical','high','medium','low','clean'].map(s => {
          const c=getSev(s)
          return (
            <div key={s} className={`rounded-xl border p-2.5 text-center ${c.badge}`}>
              <p className="text-xl sm:text-2xl font-bold font-mono">{counts[s]??0}</p>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-widest mt-0.5">{s}</p>
            </div>
          )
        })}
      </div>

      {/* Action summary bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-brand-surface border border-brand-border rounded-xl">
        <div className="flex items-center gap-4 text-sm flex-1 flex-wrap">
          <span className="flex items-center gap-1.5 text-red-400 font-semibold">
            <Ban className="w-4 h-4"/> {malicious.length} malicious
          </span>
          <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
            <ThumbsUp className="w-4 h-4"/> {fpIds.size} marked FP
          </span>
          <span className="flex items-center gap-1.5 text-green-400 font-semibold">
            <CheckCircle2 className="w-4 h-4"/> {clean.length} clean
          </span>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={sendBlock} disabled={!!actionLoading||blocked||malicious.length===0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-900/40 border border-red-700 text-red-300 hover:bg-red-900/60 disabled:opacity-40 transition-colors">
            {actionLoading==='block'?<Spinner className="w-3 h-3"/>:<Send className="w-3.5 h-3.5"/>}
            {blocked ? 'Sent' : `Block ${malicious.length} IPs`}
          </button>
          <button onClick={sendFP} disabled={!!actionLoading||fpIds.size===0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-900/30 border border-blue-800 text-blue-300 hover:bg-blue-900/50 disabled:opacity-40 transition-colors">
            {actionLoading==='fp'?<Spinner className="w-3 h-3"/>:<ThumbsUp className="w-3.5 h-3.5"/>}
            Mark {fpIds.size} as FP
          </button>
        </div>
      </div>

      {/* Flagged items — toggle FP per row */}
      {allItems.filter(i=>i.severity!=='clean').length>0 && (
        <div>
          <p className="text-xs text-brand-muted mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5"/> Toggle FP on individual IOCs before sending for blocking
          </p>
          <div className="max-h-72 overflow-y-auto rounded-xl border border-brand-border divide-y divide-brand-border">
            {allItems.filter(i=>i.severity!=='clean').map((item,idx)=>{
              const c=getSev(item.severity)
              const isFP = fpIds.has(item.scan_id)
              return (
                <div key={idx} className={`flex items-center gap-2 px-3 py-2 transition-colors ${isFP?'bg-blue-950/20':''}`}>
                  <div className={`w-1.5 h-6 rounded-full shrink-0 ${c.bar}`}/>
                  <div className="flex-1 min-w-0">
                    <p className="text-brand-text text-xs font-mono truncate">{item.ioc}</p>
                    <p className="text-[10px] text-brand-muted uppercase">{item.ioc_type}</p>
                  </div>
                  <span className="text-xs font-mono shrink-0" style={{color:c.ring}}>{item.risk_score}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${c.badge}`}>
                    {item.severity}
                  </span>
                  <button onClick={()=>toggleFP(item.scan_id)}
                    className={`shrink-0 p-1 rounded-lg border text-[10px] transition-colors ${
                      isFP ? 'bg-blue-900/40 border-blue-700 text-blue-300'
                           : 'border-brand-border text-brand-muted hover:border-brand-accent2'}`}>
                    <ThumbsUp className="w-3 h-3"/>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Expandable history row ────────────────────────────────────────────────
function HistoryRow({ scan }) {
  const [open, setOpen]       = useState(false)
  const [scanData, setScanData] = useState(scan)
  const sev  = getSev(scanData.severity)
  const Icon = sev.icon

  return (
    <div className="border-b border-brand-border last:border-0">
      <button onClick={()=>setOpen(o=>!o)}
        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-brand-bg/50 transition-colors text-left">
        <div className={`w-1 h-8 rounded-full shrink-0 ${sev.bar}`}/>
        <Icon className="w-4 h-4 shrink-0" style={{color:sev.ring}}/>
        <div className="flex-1 min-w-0">
          <p className="text-brand-text text-sm font-mono truncate">{scanData.ioc}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-brand-muted text-xs uppercase">{scanData.ioc_type}</p>
            <SourceBadge source={scanData.source||'manual'}/>
            {scanData.is_false_positive && (
              <span className="text-[9px] font-bold bg-blue-900/30 border border-blue-800 text-blue-300 px-1.5 py-0.5 rounded">FP</span>
            )}
            {scanData.action_status==='blocked' && (
              <span className="text-[9px] font-bold bg-red-900/30 border border-red-800 text-red-300 px-1.5 py-0.5 rounded">BLOCKED</span>
            )}
            <span className="text-brand-muted text-xs">{formatRelativeTime(scanData.scanned_at)}</span>
          </div>
        </div>
        <div className="shrink-0 text-right mr-1">
          <p className="text-sm font-bold font-mono" style={{color:sev.ring}}>{Math.round(scanData.risk_score)}</p>
          <p className="text-[10px] uppercase font-semibold text-brand-muted">{sev.label}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-brand-muted shrink-0"/>
               : <ChevronDown className="w-4 h-4 text-brand-muted shrink-0"/>}
      </button>
      {open && (
        <div className="px-3 pb-4">
          <ScanDetail result={scanData} onClose={null}/>
        </div>
      )}
    </div>
  )
}

// ─── Org download bar ──────────────────────────────────────────────────────
function OrgDownloadBar() {
  const [loading, setLoading] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const loggedIn = !!useAuthStore.getState().user
  const download = async (endpoint, format, filename) => {
    if (!loggedIn) { setShowModal(true); return }
    setLoading(endpoint+format)
    try {
      const res = await api.get(`${endpoint}?format=${format}&days=30`, { responseType:'blob' })
      const mime = format==='pdf' ? 'application/pdf' : 'text/csv'
      const url  = URL.createObjectURL(new Blob([res.data],{type:mime}))
      const a    = document.createElement('a'); a.href=url; a.download=filename; a.click()
      URL.revokeObjectURL(url)
    } catch(e) {
      if(e.response?.status===400) alert('Download requires an organisation account.')
    } finally { setLoading(null) }
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* All IOC DB */}
      <div className="flex items-center gap-3 p-3 bg-brand-surface border border-brand-border rounded-xl">
        <Database className="w-4 h-4 text-brand-accent shrink-0"/>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-brand-text">30-Day IOC Database</p>
          <p className="text-[10px] text-brand-muted">All org scans from MongoDB Atlas</p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button onClick={()=>download('/ioc/org-history/download','csv','ioc-history-30d.csv')}
            disabled={!!loading}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium bg-brand-bg border border-brand-border rounded-lg hover:border-brand-accent2 text-brand-muted transition-colors disabled:opacity-50">
            {loading==='/ioc/org-history/downloadcsv'?<Spinner className="w-3 h-3"/>:<FileText className="w-3 h-3"/>} CSV
          </button>
          <button onClick={()=>download('/ioc/org-history/download','pdf','ioc-history-30d.pdf')}
            disabled={!!loading}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium bg-brand-bg border border-brand-border rounded-lg hover:border-brand-accent2 text-brand-muted transition-colors disabled:opacity-50">
            {loading==='/ioc/org-history/downloadpdf'?<Spinner className="w-3 h-3"/>:<Download className="w-3 h-3"/>} PDF
          </button>
        </div>
      </div>
      {/* CERT-IN report */}
      <div className="flex items-center gap-3 p-3 bg-brand-surface border border-purple-800/40 rounded-xl">
        <AlertCircle className="w-4 h-4 text-purple-400 shrink-0"/>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-brand-text">CERT-IN Evidence Report</p>
          <p className="text-[10px] text-brand-muted">Audit trail for regulatory compliance</p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button onClick={()=>download('/ioc/cert-in/download','csv','cert-in-report.csv')}
            disabled={!!loading}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium bg-purple-900/20 border border-purple-800/60 rounded-lg hover:bg-purple-900/40 text-purple-300 transition-colors disabled:opacity-50">
            {loading==='/ioc/cert-in/downloadcsv'?<Spinner className="w-3 h-3"/>:<FileText className="w-3 h-3"/>} CSV
          </button>
          <button onClick={()=>download('/ioc/cert-in/download','pdf','cert-in-report.pdf')}
            disabled={!!loading}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium bg-purple-900/20 border border-purple-800/60 rounded-lg hover:bg-purple-900/40 text-purple-300 transition-colors disabled:opacity-50">
            {loading==='/ioc/cert-in/downloadpdf'?<Spinner className="w-3 h-3"/>:<Download className="w-3 h-3"/>} PDF
          </button>
        </div>
      </div>
      <SignupPromptModal isOpen={showModal} onClose={() => setShowModal(false)} feature="download IOC reports" />
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function IOCScanner() {
  const [tab, setTab]       = useState('single')
  const [iocInput, setIocInput] = useState('')
  const [pasteInput, setPasteInput] = useState('')
  const [source, setSource] = useState('manual')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const { currentJob:jobId, result:bulkResult, setJob, reset } = useScanStore()
  const qc = useQueryClient()

  const [showScanModal, setShowScanModal] = useState(false)
  const isLoggedIn = !!useAuthStore.getState().user

  const { data:history, refetch:refetchHistory } = useQuery({
    queryKey: ['ioc-history'],
    queryFn: () => api.get('/ioc/history?limit=20').then(r=>r.data),
    staleTime: 30_000,
    enabled: isLoggedIn,
  })

  const handleScan = async (e) => {
    e.preventDefault()
    const ioc = iocInput.trim(); if(!ioc) return
    if (!isLoggedIn) { setShowScanModal(true); return }
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await api.post('/ioc/lookup', { ioc, source })
      setResult(res.data.result)
      refetchHistory()
    } catch(err) {
      setError(err.response?.data?.detail || 'Scan failed.')
    } finally { setLoading(false) }
  }

  const handlePasteScan = async () => {
    if (!isLoggedIn) { setShowScanModal(true); return }
    const iocs = pasteInput.split('\n').map(l=>l.trim()).filter(Boolean)
    if(!iocs.length) return
    const res = await api.post('/ioc/bulk-text', { iocs, source })
    setJob(res.data.job_id)
    setPasteInput('')
  }

  const onDrop = useCallback(async (files) => {
    if (!isLoggedIn) { setShowScanModal(true); return }
    if(!files[0]) return; reset()
    const fd = new FormData(); fd.append('file', files[0])
    try {
      const res = await api.post(`/ioc/bulk-scan?source=${source}`, fd, {
        headers:{'Content-Type':'multipart/form-data'},
      })
      setJob(res.data.job_id)
    } catch(err) { setError(err.response?.data?.detail||'Upload failed.') }
  }, [reset, setJob, source, isLoggedIn])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:{'text/plain':['.txt'],'text/csv':['.csv']},
    multiple:false, maxSize:5*1024*1024,
  })

  const historyItems = history?.items ?? []

  return (
    <PageWrapper title="IOC Scanner">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* Header */}
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-brand-text">IOC Intelligence Scanner</h1>
          <p className="text-brand-muted text-xs sm:text-sm mt-0.5">
            VirusTotal + AbuseIPDB real-time analysis · Block, tag & report IOCs for compliance
          </p>
        </div>

        {/* Source selector + tabs */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Source */}
          <div className="flex items-center gap-2 bg-brand-surface border border-brand-border rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-brand-muted shrink-0"/>
            <span className="text-xs text-brand-muted shrink-0">Source:</span>
            <select value={source} onChange={e=>setSource(e.target.value)}
              className="bg-transparent text-brand-text text-xs font-medium focus:outline-none cursor-pointer">
              {SOURCES.map(s=>(
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 bg-brand-surface border border-brand-border rounded-xl p-1 flex-1">
            {[['single',Search,'Single IOC'],['bulk',Upload,'Bulk Upload']].map(([id,Icon,label])=>(
              <button key={id} onClick={()=>setTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  tab===id ? 'bg-brand-accent text-white shadow-sm' : 'text-brand-muted hover:text-brand-text'}`}>
                <Icon className="w-3.5 h-3.5"/>{label}
              </button>
            ))}
          </div>
        </div>

        {/* Single scan */}
        {tab==='single' && (
          <div className="space-y-4">
            <Card className="space-y-3">
              <form onSubmit={handleScan} className="space-y-3">
                <textarea
                  value={iocInput}
                  onChange={e=>setIocInput(e.target.value)}
                  placeholder={'IP  →  185.220.101.42\nDomain  →  malware-site.ru\nURL  →  https://phish.example.com\nHash  →  44d88612fea8a8f36de82e1278abb02f'}
                  rows={4}
                  className="w-full bg-brand-bg border border-brand-border rounded-xl text-brand-text px-4 py-3 font-mono text-sm resize-none focus:outline-none focus:border-brand-accent2 placeholder:text-brand-muted/40"
                />
                <div className="flex gap-2 items-center">
                  <button type="submit" disabled={loading||!iocInput.trim()}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-accent hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl px-6 py-3 transition-colors text-sm shadow-lg shadow-red-900/20">
                    {loading ? <><Spinner className="w-4 h-4"/>Analysing…</>
                             : <><Search className="w-4 h-4"/>Analyse IOC</>}
                  </button>
                  {(iocInput||result) && (
                    <button type="button" onClick={()=>{setIocInput('');setResult(null);setError(null)}}
                      className="p-3 rounded-xl border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-accent2 transition-colors">
                      <X className="w-4 h-4"/>
                    </button>
                  )}
                  <p className="text-xs text-brand-muted ml-auto hidden sm:block">IPv4 · Domain · URL · MD5/SHA1/SHA256</p>
                </div>
              </form>
            </Card>
            {error && <Alert variant="error">{error}</Alert>}
            {result && <ScanDetail result={result} onClose={()=>{setResult(null);setIocInput('')}}/>}
          </div>
        )}

        {/* Bulk */}
        {tab==='bulk' && (
          <div className="space-y-3">
            {!jobId ? (
              <>
                {/* Paste input */}
                <Card className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clipboard className="w-4 h-4 text-brand-muted"/>
                    <p className="text-sm font-semibold text-brand-text">Paste IOCs</p>
                  </div>
                  <textarea
                    value={pasteInput}
                    onChange={e=>setPasteInput(e.target.value)}
                    placeholder={'185.220.101.42\nmalware-site.ru\nhttps://phish.example.com'}
                    rows={5}
                    className="w-full bg-brand-bg border border-brand-border rounded-xl text-brand-text px-4 py-3 font-mono text-sm resize-none focus:outline-none focus:border-brand-accent2 placeholder:text-brand-muted/40"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-brand-muted">
                      {pasteInput.split('\n').filter(l=>l.trim()).length} IOCs detected
                    </p>
                    <button onClick={handlePasteScan} disabled={!pasteInput.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 bg-brand-accent hover:bg-red-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors">
                      <Search className="w-3.5 h-3.5"/> Scan All
                    </button>
                  </div>
                </Card>

                {/* File upload */}
                <div {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragActive ? 'border-brand-accent bg-brand-accent/5'
                                 : 'border-brand-border hover:border-brand-accent2 hover:bg-brand-surface/50'}`}>
                  <input {...getInputProps()}/>
                  <Upload className="w-8 h-8 text-brand-muted mx-auto mb-2"/>
                  <p className="text-brand-text font-medium text-sm">{isDragActive?'Drop file here…':'Or upload a .txt / .csv file'}</p>
                  <p className="text-brand-muted text-xs mt-1">One IOC per line · max 5 MB</p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <ScanProgress jobId={jobId}/>
                {bulkResult && <BulkResult result={bulkResult}/>}
                <Button variant="secondary" onClick={reset}>
                  <X className="w-4 h-4 mr-1.5"/> Clear
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Download bar */}
        <OrgDownloadBar/>

        {/* History */}
        {historyItems.length>0 && (
          <Card className="p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-brand-border flex items-center justify-between">
              <p className="text-sm font-semibold text-brand-text">Recent Scans</p>
              <p className="text-xs text-brand-muted">Tap any row to expand full analysis</p>
            </div>
            <div>
              {historyItems.map(scan=><HistoryRow key={scan.id} scan={scan}/>)}
            </div>
          </Card>
        )}
      </div>

      <SignupPromptModal
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        feature="scan IOCs"
      />
    </PageWrapper>
  )
}
