import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Eye, Code, Save, ArrowLeft, X } from 'lucide-react'
import PageWrapper from '../../../components/layout/PageWrapper'
import { Card, Button, Input, Textarea, Alert, Spinner } from '../../../components/ui'
import api from '../../../lib/api'

const EMPTY_FORM = {
  title: '',
  summary: '',
  content: '',
  tags: '',
  reading_time_minutes: 5,
  is_published: true,
  cover_image_url: '',
}

export default function BlogEditor() {
  const { id } = useParams()          // present when editing
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [form, setForm] = useState(EMPTY_FORM)
  const [preview, setPreview] = useState(false)
  const [error, setError] = useState(null)

  // Load existing post when editing
  const { data: postData, isLoading: loadingPost } = useQuery({
    queryKey: ['blog-edit', id],
    queryFn: () => api.get(`/blog/admin/${id}`).then(r => r.data.data),
    enabled: isEdit,
  })

  useEffect(() => {
    if (postData) {
      setForm({
        title: postData.title,
        summary: postData.summary,
        content: postData.content,
        tags: (postData.tags || []).join(', '),
        reading_time_minutes: postData.reading_time_minutes,
        is_published: postData.is_published,
        cover_image_url: postData.cover_image_url || '',
      })
    }
  }, [postData])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const parsedTags = form.tags
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(Boolean)

  const payload = {
    title: form.title.trim(),
    summary: form.summary.trim(),
    content: form.content,
    tags: parsedTags,
    reading_time_minutes: Number(form.reading_time_minutes) || 5,
    is_published: form.is_published,
    cover_image_url: form.cover_image_url.trim() || null,
  }

  const create = useMutation({
    mutationFn: () => api.post('/blog/', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blog-admin'] })
      navigate('/admin/blog')
    },
    onError: (err) => setError(err.response?.data?.detail || 'Failed to create post.'),
  })

  const update = useMutation({
    mutationFn: () => api.put(`/blog/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blog-admin'] })
      qc.invalidateQueries({ queryKey: ['blog-edit', id] })
      navigate('/admin/blog')
    },
    onError: (err) => setError(err.response?.data?.detail || 'Failed to update post.'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    if (!form.title.trim()) return setError('Title is required.')
    if (!form.summary.trim()) return setError('Summary is required.')
    if (!form.content.trim()) return setError('Content is required.')
    isEdit ? update.mutate() : create.mutate()
  }

  const isSaving = create.isPending || update.isPending

  if (isEdit && loadingPost) return (
    <PageWrapper title="Loading…">
      <div className="flex justify-center py-20"><Spinner /></div>
    </PageWrapper>
  )

  return (
    <PageWrapper title={isEdit ? 'Edit Post' : 'New Post'}>
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/admin/blog')}
            className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Posts
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border transition-colors ${
                preview
                  ? 'border-brand-accent2 text-brand-accent2'
                  : 'border-brand-border text-brand-muted hover:text-brand-text'
              }`}
            >
              {preview ? <Code className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {preview ? 'Edit' : 'Preview'}
            </button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              <Save className="w-4 h-4 mr-1.5" />
              {isSaving ? 'Saving…' : isEdit ? 'Update Post' : 'Publish Post'}
            </Button>
          </div>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="space-y-4">
              <div>
                <label className="text-xs text-brand-muted block mb-1">Title *</label>
                <Input
                  value={form.title}
                  onChange={set('title')}
                  placeholder="Post title"
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <label className="text-xs text-brand-muted block mb-1">Summary * (shown in blog list)</label>
                <Textarea
                  value={form.summary}
                  onChange={set('summary')}
                  placeholder="2–3 sentences describing the post…"
                  rows={3}
                />
              </div>
            </Card>

            {/* Content / Preview */}
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-brand-border bg-brand-bg">
                <span className="text-xs text-brand-muted">Content (Markdown)</span>
                <span className="ml-auto text-xs text-brand-muted">
                  {form.content.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              {preview ? (
                <div className="p-6 min-h-64 prose prose-invert prose-sm max-w-none
                  prose-headings:text-brand-text prose-p:text-brand-muted prose-p:leading-relaxed
                  prose-a:text-brand-accent2 prose-strong:text-brand-text
                  prose-code:text-brand-accent prose-code:bg-brand-bg prose-code:px-1 prose-code:rounded
                  prose-pre:bg-brand-bg prose-pre:border prose-pre:border-brand-border
                  prose-ul:text-brand-muted prose-ol:text-brand-muted prose-hr:border-brand-border">
                  {form.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content}</ReactMarkdown>
                  ) : (
                    <p className="text-brand-muted italic">Nothing to preview yet.</p>
                  )}
                </div>
              ) : (
                <textarea
                  value={form.content}
                  onChange={set('content')}
                  placeholder={`# Post Title\n\nWrite your post in Markdown...\n\n## Section One\n\nContent here.`}
                  rows={24}
                  className="w-full bg-transparent text-brand-text px-4 py-4 font-mono text-sm resize-none focus:outline-none placeholder:text-brand-muted/40"
                />
              )}
            </Card>
          </div>

          {/* Sidebar settings */}
          <div className="space-y-4">
            <Card className="space-y-4">
              <h3 className="text-brand-text font-medium text-sm">Post Settings</h3>

              {/* Publish status */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-brand-muted">Status</label>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, is_published: !f.is_published }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.is_published ? 'bg-brand-success' : 'bg-brand-border'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.is_published ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <p className="text-xs text-brand-muted -mt-2">
                {form.is_published ? 'Published — visible on blog' : 'Draft — hidden from public'}
              </p>

              <div>
                <label className="text-xs text-brand-muted block mb-1">Tags (comma-separated)</label>
                <Input
                  value={form.tags}
                  onChange={set('tags')}
                  placeholder="ransomware, india, rbi, cve"
                />
                {parsedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {parsedTags.map(t => (
                      <span key={t} className="text-xs bg-brand-bg border border-brand-border px-2 py-0.5 rounded text-brand-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-brand-muted block mb-1">Reading time (minutes)</label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={form.reading_time_minutes}
                  onChange={set('reading_time_minutes')}
                />
              </div>

              <div>
                <label className="text-xs text-brand-muted block mb-1">Cover image URL (optional)</label>
                <Input
                  value={form.cover_image_url}
                  onChange={set('cover_image_url')}
                  placeholder="https://…"
                />
              </div>
            </Card>

            {/* Quick markdown reference */}
            <Card className="space-y-2">
              <h3 className="text-brand-muted text-xs font-medium uppercase tracking-wider">Markdown Tips</h3>
              <div className="text-xs text-brand-muted space-y-1 font-mono">
                <p><span className="text-brand-text"># H1</span>  <span className="text-brand-text">## H2</span></p>
                <p><span className="text-brand-text">**bold**</span>  <span className="text-brand-text">*italic*</span></p>
                <p><span className="text-brand-text">`code`</span>  <span className="text-brand-text">```block```</span></p>
                <p><span className="text-brand-text">- item</span>  <span className="text-brand-text">1. item</span></p>
                <p><span className="text-brand-text">[text](url)</span></p>
                <p><span className="text-brand-text">&gt; blockquote</span></p>
                <p><span className="text-brand-text">---</span> horizontal rule</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
