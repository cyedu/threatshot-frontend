import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, EyeOff, Eye, Search } from 'lucide-react'
import PageWrapper from '../../../components/layout/PageWrapper'
import { Card, Badge, Button, Input, Spinner, Alert } from '../../../components/ui'
import api from '../../../lib/api'
import { formatDate } from '../../../lib/utils'

export default function BlogAdmin() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [actionError, setActionError] = useState(null)
  const qc = useQueryClient()

  const params = new URLSearchParams({ page, per_page: 15 })
  if (search) params.set('search', search)

  const { data, isLoading } = useQuery({
    queryKey: ['blog-admin', page, search],
    queryFn: () => api.get(`/blog/admin?${params}`).then(r => r.data),
    keepPreviousData: true,
  })

  const unpublish = useMutation({
    mutationFn: (id) => api.patch(`/blog/${id}/unpublish`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog-admin'] }),
    onError: (err) => setActionError(err.response?.data?.detail || 'Action failed'),
  })

  const publish = useMutation({
    mutationFn: (id) => api.put(`/blog/${id}`, { is_published: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog-admin'] }),
    onError: (err) => setActionError(err.response?.data?.detail || 'Action failed'),
  })

  const remove = useMutation({
    mutationFn: (id) => api.delete(`/blog/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog-admin'] }),
    onError: (err) => setActionError(err.response?.data?.detail || 'Action failed'),
  })

  const posts = data?.data ?? []
  const meta  = data?.meta ?? {}

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const confirmDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      remove.mutate(id)
    }
  }

  return (
    <PageWrapper title="Blog Admin">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-sm">
            <Input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search posts…"
              className="flex-1"
            />
            <button type="submit" className="p-2 text-brand-muted hover:text-brand-text">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <Link to="/admin/blog/new">
            <Button>
              <Plus className="w-4 h-4 mr-1.5" /> New Post
            </Button>
          </Link>
        </div>

        {actionError && (
          <Alert variant="error" className="mb-2">{actionError}</Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : (
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-bg">
                  <th className="text-left px-4 py-3 text-brand-muted font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-brand-muted font-medium hidden md:table-cell">Tags</th>
                  <th className="text-left px-4 py-3 text-brand-muted font-medium hidden sm:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-brand-muted font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-brand-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-brand-border last:border-0 hover:bg-brand-bg/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/blog/${post.id}/edit`}
                        className="text-brand-text hover:text-brand-accent2 font-medium line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <p className="text-brand-muted text-xs mt-0.5 font-mono">{post.slug}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.slice(0, 3).map(t => (
                          <span key={t} className="text-xs bg-brand-bg border border-brand-border px-1.5 py-0.5 rounded text-brand-muted">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-muted hidden sm:table-cell whitespace-nowrap">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      {post.is_published ? (
                        <span className="text-xs bg-green-900/40 border border-green-700 text-green-300 px-2 py-0.5 rounded-full">Published</span>
                      ) : (
                        <span className="text-xs bg-yellow-900/40 border border-yellow-700 text-yellow-300 px-2 py-0.5 rounded-full">Draft</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/blog/${post.id}/edit`}
                          className="p-1.5 text-brand-muted hover:text-brand-text rounded hover:bg-brand-border transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        {post.is_published ? (
                          <button
                            onClick={() => unpublish.mutate(post.id)}
                            className="p-1.5 text-brand-muted hover:text-yellow-400 rounded hover:bg-brand-border transition-colors"
                            title="Unpublish"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => publish.mutate(post.id)}
                            className="p-1.5 text-brand-muted hover:text-green-400 rounded hover:bg-brand-border transition-colors"
                            title="Publish"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => confirmDelete(post.id, post.title)}
                          className="p-1.5 text-brand-muted hover:text-red-400 rounded hover:bg-brand-border transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-brand-muted">
                      No posts yet. <Link to="/admin/blog/new" className="text-brand-accent2 hover:underline">Write your first post.</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )}

        {meta.pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: meta.pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  p === page ? 'bg-brand-accent text-white' : 'text-brand-muted hover:text-brand-text hover:bg-brand-border'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
