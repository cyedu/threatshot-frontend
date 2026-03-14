import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Radio, ExternalLink } from 'lucide-react'
import axios from 'axios'

const publicApi = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || '') + '/api/v1',
})

const FALLBACK = [
  { id: 1, title: 'CERT-In mandates 6-hour cyber incident reporting for all Indian organisations', source: 'CERT-In', href: '/threat-feed' },
  { id: 2, title: 'New ransomware strain targets Indian banking sector via phishing campaigns', source: 'ThreatShot Intel', href: '/threat-feed' },
  { id: 3, title: 'Critical CVE-2025-XXXX affects OpenSSL — patch immediately', source: 'NVD', href: '/cve' },
  { id: 4, title: 'RBI circular: NBFCs must implement zero-trust architecture by Q3 2026', source: 'RBI', href: '/threat-feed' },
  { id: 5, title: 'Over 800M Indian records exposed in data breaches since 2023 — report', source: 'DPDP Watch', href: '/threat-feed' },
  { id: 6, title: 'SEBI issues advisory on third-party vendor cyber risk for brokerages', source: 'SEBI', href: '/threat-feed' },
  { id: 7, title: 'APT group targets Indian fintech via supply-chain compromise of npm packages', source: 'OTX', href: '/threat-feed' },
  { id: 8, title: 'India ranks 3rd globally in phishing attacks — Zscaler 2025 report', source: 'Industry', href: '/blog' },
]

export default function NewsTicker() {
  const { data } = useQuery({
    queryKey: ['ticker-feed'],
    queryFn: () =>
      publicApi
        .get('/threat-feed/', { params: { page: 1, per_page: 15 } })
        .then(r => r.data?.data ?? []),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const items = data?.length > 0
    ? data.map(item => ({
        id: item.id,
        title: item.title,
        source: item.source_name ?? item.source ?? 'Intel',
        href: '/threat-feed',
      }))
    : FALLBACK

  const doubled = [...items, ...items]

  return (
    <div className="border-b border-brand-border bg-brand-surface overflow-hidden relative" aria-label="Latest cybersecurity news">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-brand-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-brand-surface to-transparent" />

      <div className="flex items-stretch">
        {/* LIVE badge */}
        <div className="flex items-center gap-1.5 px-4 shrink-0 z-20 bg-brand-surface">
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-brand-accent2 text-white">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            Live
          </span>
        </div>

        {/* Scrolling content */}
        <div className="overflow-hidden flex-1 py-2">
          <div className="animate-ticker">
            {doubled.map((item, i) => (
              <span key={`${item.id}-${i}`} className="inline-flex items-center gap-3 px-6">
                <span className="text-[10px] font-semibold uppercase tracking-wide shrink-0 text-brand-muted">
                  {item.source}
                </span>
                <Link
                  to={item.href}
                  className="text-xs font-medium whitespace-nowrap text-brand-text hover:underline hover:opacity-80 transition-opacity"
                >
                  {item.title}
                </Link>
                <span className="text-lg leading-none text-brand-border" aria-hidden>·</span>
              </span>
            ))}
          </div>
        </div>

        {/* View all */}
        <Link
          to="/threat-feed"
          className="flex items-center gap-1 px-4 shrink-0 text-[11px] font-medium text-brand-accent2 hover:underline z-20 bg-brand-surface"
        >
          All news <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
