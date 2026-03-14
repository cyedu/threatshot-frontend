import { useState } from 'react'
import { Input, Button, Alert } from '../../components/ui'
import api from '../../lib/api'

export default function WaitlistForm({ module }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.post('/auth/waitlist', { email, full_name: name, company, module })
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <Alert variant="success">
      You're on the waitlist! We'll notify you at <strong>{email}</strong> when this module launches.
    </Alert>
  )

  return (
    <div className="border-t border-brand-border pt-4">
      <p className="text-brand-text text-sm font-medium mb-3">Join the waitlist for early access</p>
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          required
        />
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Work email"
          required
        />
        <Input
          value={company}
          onChange={e => setCompany(e.target.value)}
          placeholder="Company name"
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Submitting…' : 'Request Early Access'}
        </Button>
      </form>
    </div>
  )
}
