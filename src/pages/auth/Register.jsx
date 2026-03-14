import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { Button, Input, Alert } from '../../components/ui'
import api from '../../lib/api'

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await api.post('/auth/register', form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-brand-surface border border-brand-border rounded-lg p-6 text-center space-y-4">
        <Shield className="w-10 h-10 text-brand-success mx-auto" />
        <h2 className="text-brand-text font-semibold text-lg">Check your email</h2>
        <p className="text-brand-muted text-sm">We sent a verification link to <strong>{form.email}</strong>. Click it to activate your account.</p>
        <Link to="/login" className="block text-brand-accent2 hover:underline text-sm">Back to login</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="w-10 h-10 text-brand-accent mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-brand-text"><span className="text-brand-accent">THREAT</span>SHOT</h1>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-lg p-6 space-y-4">
          <h2 className="text-brand-text font-semibold text-lg">Create account</h2>
          {error && <Alert variant="error">{error}</Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-brand-muted block mb-1">Full Name</label>
              <Input value={form.full_name} onChange={e => setForm(f => ({...f, full_name: e.target.value}))} placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm text-brand-muted block mb-1">Work Email</label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="you@company.com" required />
            </div>
            <div>
              <label className="text-sm text-brand-muted block mb-1">Password <span className="text-brand-muted">(min 10 chars)</span></label>
              <Input type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="••••••••••" required minLength={10} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account — Free'}
            </Button>
          </form>
          <p className="text-center text-sm text-brand-muted">
            Already have an account? <Link to="/login" className="text-brand-accent2 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
