import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Clock, Calendar, Tag, ChevronLeft, ChevronRight, Shield } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import { Spinner } from '../../components/ui'
import axios from 'axios'

const publicApi = axios.create({ baseURL: (import.meta.env.VITE_API_BASE_URL || '') + '/api/v1' })
import { formatDate } from '../../lib/utils'

export default function BlogList() {
  const [selectedTag, setSelectedTag] = useState(null)
  const [page, setPage] = useState(1)

  const params = new URLSearchParams({ page, per_page: 9 })
  if (selectedTag) params.set('tags', selectedTag)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog-list', page, selectedTag],
    queryFn: () => publicApi.get(`/blog/?${params}`).then(r => r.data),
    keepPreviousData: true,
  })

  const { data: tagsData } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: () => publicApi.get('/blog/tags').then(r => r.data),
    staleTime: 300_000,
  })

  const posts = data?.data ?? []
  const meta = data?.meta ?? {}
  const tags = tagsData ?? []

  const handleTag = (tag) => {
    setSelectedTag(prev => prev === tag ? null : tag)
    setPage(1)
  }

  const featured = page === 1 && !selectedTag ? posts[0] : null
  const rest = page === 1 && !selectedTag ? posts.slice(1) : posts

  return (
    <PageWrapper title="Intelligence Blog">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-brand-text">Cyber Intelligence Blog</h1>
          <p className="text-brand-muted text-sm">
            Threat analysis, vulnerability breakdowns, and security guidance for Indian enterprises.
            {meta.total > 0 && <span className="ml-1">{meta.total} post{meta.total !== 1 ? 's' : ''}.</span>}
          </p>
        </header>

        {/* Tag filter strip */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="flex items-center gap-1 text-xs text-brand-muted shrink-0">
              <Tag className="w-3 h-3" /> Filter:
            </span>
            <button
              onClick={() => { setSelectedTag(null); setPage(1) }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                !selectedTag
                  ? 'bg-brand-accent border-brand-accent text-white'
                  : 'border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-accent2'
              }`}
            >
              All
            </button>
            {tags.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => handleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selectedTag === tag
                    ? 'bg-brand-accent border-brand-accent text-white'
                    : 'border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-accent2'
                }`}
              >
                {tag}
                <span className="ml-1 opacity-60">({count})</span>
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : isError ? (
          <EmptyState message="Could not load posts. Please try again." />
        ) : posts.length === 0 ? (
          <EmptyState message={selectedTag ? `No posts tagged "${selectedTag}".` : 'No posts published yet.'} />
        ) : (
          <>
            {/* Featured post — first item on page 1 */}
            {featured && <FeaturedCard post={featured} />}

            {/* Grid of remaining posts */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map(post => (
                  <PostCard key={post.id} post={post} onTagClick={handleTag} selectedTag={selectedTag} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {meta.pages > 1 && (
          <nav aria-label="Blog pagination" className="flex items-center justify-between pt-2 border-t border-brand-border">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-brand-muted hover:text-brand-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: meta.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? 'page' : undefined}
                  className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-brand-accent text-white'
                      : 'text-brand-muted hover:text-brand-text hover:bg-brand-border'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
              disabled={page === meta.pages}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-brand-muted hover:text-brand-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}
      </div>
    </PageWrapper>
  )
}

/* ─── Featured (hero) card ─── */
function FeaturedCard({ post }) {
  return (
    <article className="group relative bg-brand-surface border border-brand-border rounded-xl overflow-hidden hover:border-brand-accent2 transition-colors">
      {post.cover_image_url ? (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full h-52 sm:h-64 object-cover"
          loading="eager"
        />
      ) : (
        <div className="w-full h-40 sm:h-52 bg-gradient-to-br from-brand-bg via-brand-surface to-brand-border flex items-center justify-center">
          <Shield className="w-12 h-12 text-brand-accent opacity-30" />
        </div>
      )}
      <div className="p-5 sm:p-7 space-y-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {post.tags?.slice(0, 4).map(tag => (
            <span key={tag} className="text-xs bg-brand-accent/10 border border-brand-accent/30 text-brand-accent px-2 py-0.5 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
        {/* Title */}
        <Link to={`/blog/${post.slug}`}>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-text group-hover:text-brand-accent2 transition-colors leading-snug">
            {post.title}
          </h2>
        </Link>
        {/* Summary */}
        <p className="text-brand-muted text-sm sm:text-base leading-relaxed line-clamp-3">
          {post.summary}
        </p>
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-brand-muted pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          </span>
          {post.reading_time_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.reading_time_minutes} min read
            </span>
          )}
          <Link
            to={`/blog/${post.slug}`}
            className="ml-auto text-brand-accent2 font-medium hover:underline text-xs sm:text-sm"
          >
            Read article →
          </Link>
        </div>
      </div>
    </article>
  )
}

/* ─── Regular post card ─── */
function PostCard({ post, onTagClick, selectedTag }) {
  return (
    <article className="group flex flex-col bg-brand-surface border border-brand-border rounded-xl overflow-hidden hover:border-brand-accent2 transition-colors h-full">
      {post.cover_image_url ? (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full h-36 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-28 bg-gradient-to-br from-brand-bg to-brand-border flex items-center justify-center shrink-0">
          <Shield className="w-7 h-7 text-brand-accent opacity-20" />
        </div>
      )}

      <div className="flex flex-col flex-1 p-4 space-y-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {post.tags?.slice(0, 3).map(tag => (
            <button
              key={tag}
              onClick={e => { e.preventDefault(); onTagClick(tag) }}
              className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                selectedTag === tag
                  ? 'bg-brand-accent border-brand-accent text-white'
                  : 'border-brand-border text-brand-muted hover:border-brand-accent2 hover:text-brand-text'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Title */}
        <Link to={`/blog/${post.slug}`} className="flex-1">
          <h2 className="text-brand-text font-semibold text-sm sm:text-base leading-snug group-hover:text-brand-accent2 transition-colors line-clamp-3">
            {post.title}
          </h2>
        </Link>

        {/* Summary */}
        <p className="text-brand-muted text-xs sm:text-sm leading-relaxed line-clamp-2">
          {post.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-brand-muted pt-1 mt-auto border-t border-brand-border">
          <time dateTime={post.published_at} className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.published_at)}
          </time>
          {post.reading_time_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.reading_time_minutes} min
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

/* ─── Empty state ─── */
function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
      <Shield className="w-10 h-10 text-brand-border" />
      <p className="text-brand-muted">{message}</p>
    </div>
  )
}
