import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Calendar, Clock, Shield } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import { Spinner } from '../../components/ui'
import api from '../../lib/api'
import { formatDate } from '../../lib/utils'

export default function BlogPost() {
  const { slug } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => api.get(`/blog/${slug}`).then(r => r.data),
  })

  if (isLoading) return (
    <PageWrapper title="Loading…">
      <div className="flex justify-center py-20"><Spinner /></div>
    </PageWrapper>
  )

  if (isError || !data?.post) return (
    <PageWrapper title="Not Found">
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <Shield className="w-12 h-12 text-brand-border mx-auto" />
        <p className="text-brand-muted">Post not found or has been removed.</p>
        <Link to="/blog" className="text-brand-accent2 hover:underline text-sm">← Back to Blog</Link>
      </div>
    </PageWrapper>
  )

  const { post, related } = data

  return (
    <PageWrapper title={post.title}>
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-accent2 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Cover image */}
        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-56 sm:h-72 object-cover rounded-xl mb-8"
          />
        )}

        {/* Article header */}
        <header className="mb-8 space-y-4">
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="text-xs bg-brand-accent/10 border border-brand-accent/30 text-brand-accent px-2.5 py-0.5 rounded-full hover:bg-brand-accent/20 transition-colors font-medium"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-brand-text leading-tight">
            {post.title}
          </h1>

          <p className="text-brand-muted text-base leading-relaxed">
            {post.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-brand-muted pb-6 border-b border-brand-border">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            </span>
            {post.reading_time_minutes && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.reading_time_minutes} min read
              </span>
            )}
          </div>
        </header>

        {/* Article body */}
        <article className="blog-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={mdComponents}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Tags footer */}
        {post.tags?.length > 0 && (
          <div className="mt-10 pt-6 border-t border-brand-border">
            <p className="text-xs text-brand-muted mb-2">Tagged under</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="text-xs border border-brand-border text-brand-muted px-3 py-1 rounded-full hover:border-brand-accent2 hover:text-brand-text transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related posts */}
        {related?.length > 0 && (
          <section className="mt-10 pt-6 border-t border-brand-border">
            <h2 className="text-brand-text font-semibold text-lg mb-4">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map(rel => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="group block p-4 bg-brand-surface border border-brand-border rounded-xl hover:border-brand-accent2 transition-colors"
                >
                  <p className="text-brand-text text-sm font-medium line-clamp-2 group-hover:text-brand-accent2 transition-colors">
                    {rel.title}
                  </p>
                  <p className="text-brand-muted text-xs mt-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatDate(rel.published_at)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </PageWrapper>
  )
}

/* Custom markdown renderers — styled without @tailwindcss/typography */
const mdComponents = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-brand-text mt-8 mb-4 leading-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-brand-text mt-8 mb-3 leading-snug">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-brand-text mt-6 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-brand-muted leading-relaxed mb-4 text-sm sm:text-base">{children}</p>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-accent2 hover:underline">
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="text-brand-text font-semibold">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-brand-muted italic">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="my-4 space-y-1.5 pl-5 list-disc marker:text-brand-accent">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 space-y-1.5 pl-5 list-decimal marker:text-brand-accent">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-brand-muted text-sm sm:text-base leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-brand-accent pl-4 my-4 italic text-brand-muted">
      {children}
    </blockquote>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-brand-bg border border-brand-border text-brand-accent px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ) : (
      <pre className="bg-brand-bg border border-brand-border rounded-lg p-4 my-4 overflow-x-auto">
        <code className="text-brand-accent text-sm font-mono">{children}</code>
      </pre>
    ),
  hr: () => <hr className="border-brand-border my-6" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border border-brand-border rounded-lg overflow-hidden">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-brand-bg">{children}</thead>,
  th: ({ children }) => (
    <th className="text-left px-4 py-2 text-brand-text font-semibold border-b border-brand-border">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 text-brand-muted border-b border-brand-border">{children}</td>
  ),
}
