import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ShieldAlert, Rss, FileText, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import PageWrapper from '../../components/layout/PageWrapper'
import { Card, Spinner, Badge } from '../../components/ui'
import useAuthStore from '../../store/authStore'
import api from '../../lib/api'
import { formatRelativeTime } from '../../lib/utils'

function StatCard({ icon: Icon, label, value, sub, color = 'text-brand-accent' }) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-brand-bg ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl font-bold text-brand-text">{value ?? '—'}</div>
        <div className="text-sm text-brand-muted">{label}</div>
        {sub && <div className="text-xs text-brand-muted mt-0.5">{sub}</div>}
      </div>
    </Card>
  )
}

const SEV_COLORS = { critical: '#E63946', high: '#F4A261', medium: '#E9C46A', low: '#457B9D', clean: '#2A9D8F' }

export default function Dashboard() {
  const { user, fetchMe } = useAuthStore()

  useEffect(() => { fetchMe() }, [])

  const { data: feedStats, isLoading: feedLoading } = useQuery({
    queryKey: ['feed-stats'],
    queryFn: () => api.get('/threat-feed/stats').then(r => r.data),
    staleTime: 60_000,
  })

  const { data: feedItems } = useQuery({
    queryKey: ['feed-recent'],
    queryFn: () => api.get('/threat-feed?limit=5&page=1').then(r => r.data),
    staleTime: 60_000,
  })

  const { data: blogPosts } = useQuery({
    queryKey: ['blog-recent'],
    queryFn: () => api.get('/blog/latest').then(r => r.data),
    staleTime: 60_000,
  })

  const chartData = feedStats ? [
    { name: 'Critical', count: feedStats.by_severity?.critical ?? 0, fill: SEV_COLORS.critical },
    { name: 'High', count: feedStats.by_severity?.high ?? 0, fill: SEV_COLORS.high },
    { name: 'Medium', count: feedStats.by_severity?.medium ?? 0, fill: SEV_COLORS.medium },
    { name: 'Low', count: feedStats.by_severity?.low ?? 0, fill: SEV_COLORS.low },
  ] : []

  return (
    <PageWrapper title="Dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-xl font-bold text-brand-text">
            Welcome back{user?.full_name ? `, ${user.full_name}` : ''}
          </h1>
          <p className="text-brand-muted text-sm mt-1">
            {user?.organisation?.name} · {user?.role ?? 'analyst'}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Rss}
            label="Total Feed Items"
            value={feedLoading ? '…' : feedStats?.total}
            color="text-brand-accent2"
          />
          <StatCard
            icon={ShieldAlert}
            label="Critical Threats"
            value={feedLoading ? '…' : feedStats?.by_severity?.critical}
            color="text-red-400"
          />
          <StatCard
            icon={TrendingUp}
            label="High Severity"
            value={feedLoading ? '…' : feedStats?.by_severity?.high}
            color="text-orange-400"
          />
          <StatCard
            icon={FileText}
            label="Blog Posts"
            value={blogPosts?.length ?? '—'}
            color="text-brand-accent2"
          />
        </div>

        {/* Chart + Recent feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-brand-text font-semibold mb-4">Threats by Severity</h2>
            {feedLoading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barSize={32}>
                  <XAxis dataKey="name" stroke="#8B949E" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#8B949E" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 6 }}
                    labelStyle={{ color: '#E6EDF3' }}
                    itemStyle={{ color: '#8B949E' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <rect key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card>
            <h2 className="text-brand-text font-semibold mb-4">Recent Threat Feed</h2>
            {!feedItems ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : (
              <ul className="space-y-3">
                {feedItems.items?.slice(0, 5).map(item => (
                  <li key={item.id} className="flex items-start gap-3 border-b border-brand-border pb-3 last:border-0 last:pb-0">
                    <Badge variant={item.severity}>{item.severity}</Badge>
                    <div className="min-w-0">
                      <p className="text-brand-text text-sm line-clamp-2">{item.title}</p>
                      <p className="text-brand-muted text-xs mt-0.5">{formatRelativeTime(item.published_at)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Recent blog */}
        {blogPosts?.length > 0 && (
          <Card>
            <h2 className="text-brand-text font-semibold mb-4">Latest Intelligence Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {blogPosts.slice(0, 3).map(post => (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block p-3 rounded-lg bg-brand-bg hover:bg-brand-border transition-colors"
                >
                  <p className="text-brand-text text-sm font-medium line-clamp-2">{post.title}</p>
                  <p className="text-brand-muted text-xs mt-1">{formatRelativeTime(post.published_at)}</p>
                </a>
              ))}
            </div>
          </Card>
        )}
      </div>
    </PageWrapper>
  )
}
