import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import { Card, Badge, Spinner, Select, Input } from '../../components/ui'
import api from '../../lib/api'
import { formatRelativeTime } from '../../lib/utils'
import { useSEO } from '../../hooks/useSEO'

const SEVERITIES = ['all', 'critical', 'high', 'medium', 'low']

export default function ThreatFeed() {
  const [page, setPage] = useState(1)

  useSEO({
    title: 'Cyber Threat Intelligence Feed — Live Threat News for India',
    description:
      'Real-time threat intelligence aggregated from CERT-IN, CISA, NVD, Bleeping Computer, and AlienVault OTX. Critical alerts, ransomware, phishing, and zero-day threats relevant to Indian organisations.',
    keywords:
      'threat feed India, CERT-IN alerts, CISA known exploited vulnerabilities, ransomware news, zero-day threats, cybersecurity news India, live threat intelligence',
    canonical: 'https://threatshot.in/threat-feed',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'DataFeed',
      name: 'ThreatShot Cyber Threat Intelligence Feed',
      description:
        'Aggregated real-time threat intelligence from CERT-IN, CISA, NVD, Bleeping Computer, The Hacker News, Krebs on Security, and AlienVault OTX.',
      url: 'https://threatshot.in/threat-feed',
      provider: {
        '@type': 'Organization',
        name: 'ThreatShot',
        url: 'https://threatshot.in',
      },
      inLanguage: 'en-IN',
      about: { '@type': 'Thing', name: 'Cyber Threat Intelligence' },
    },
  })
  const [severity, setSeverity] = useState('all')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const params = new URLSearchParams({ page, per_page: 20 })
  if (severity !== 'all') params.set('severity', severity)
  if (search) params.set('search', search)

  const { data, isLoading } = useQuery({
    queryKey: ['threat-feed', page, severity, search],
    queryFn: () => api.get(`/threat-feed/?${params}`).then(r => r.data),
    keepPreviousData: true,
  })

  const items = data?.data ?? []
  const meta  = data?.meta  ?? {}

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleSeverity = (val) => {
    setSeverity(val)
    setPage(1)
  }

  return (
    <PageWrapper title="Threat Feed">
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <Input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search threats…"
              className="flex-1"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-brand-accent hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Search
            </button>
          </form>
          <Select value={severity} onChange={e => handleSeverity(e.target.value)}>
            {SEVERITIES.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'All Severities' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </Select>
        </div>

        {/* Results count */}
        {data && (
          <p className="text-brand-muted text-sm">
            {meta.total} threat{meta.total !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Items */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <FeedCard key={item.id} item={item} />
            ))}
            {items.length === 0 && (
              <Card className="text-center py-12 text-brand-muted">No threats match your filters.</Card>
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
            <span className="text-brand-muted text-sm">Page {page} of {meta.pages}</span>
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
    </PageWrapper>
  )
}

function FeedCard({ item }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <Badge variant={item.severity} className="shrink-0 mt-0.5">{item.severity}</Badge>
          <div className="min-w-0">
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-brand-text font-medium text-sm text-left hover:text-brand-accent transition-colors"
            >
              {item.title}
            </button>
            <div className="flex items-center gap-3 mt-1 text-xs text-brand-muted">
              <span>{item.source}</span>
              <span>·</span>
              <span>{formatRelativeTime(item.published_at)}</span>
              {item.tags?.slice(0, 3).map(tag => (
                <span key={tag} className="bg-brand-bg border border-brand-border px-1.5 py-0.5 rounded text-brand-muted">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-brand-accent2 hover:text-brand-text transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {expanded && (
        <div className="pt-2 border-t border-brand-border space-y-2">
          {item.summary && (
            <p className="text-brand-muted text-sm">{item.summary}</p>
          )}
          {item.ai_summary && (
            <div className="bg-brand-bg rounded p-3">
              <p className="text-xs text-brand-accent2 font-medium mb-1">AI Analysis</p>
              <p className="text-brand-text text-sm">{item.ai_summary}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
