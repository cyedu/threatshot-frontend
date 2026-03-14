import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { Button, Input, Alert } from '../../components/ui'
import api from '../../lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await api.post('/auth/forgot-password', { email }) } catch {}
    setDone(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="w-10 h-10 text-brand-accent mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-brand-text"><span className="text-brand-accent">THREAT</span>SHOT</h1>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-lg p-6 space-y-4">
          <h2 className="text-brand-text font-semibold text-lg">Reset password</h2>
          {done ? (
            <Alert variant="success">If that email exists, a reset link has been sent.</Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending…' : 'Send reset link'}
              </Button>
            </form>
          )}
          <Link to="/login" className="block text-center text-sm text-brand-accent2 hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  )
}
