import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { Button, Input, Alert } from '../../components/ui'
import useAuthStore from '../../store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="w-10 h-10 text-brand-accent mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-brand-text">
            <span className="text-brand-accent">THREAT</span>SHOT
          </h1>
          <p className="text-brand-muted mt-1 text-sm">Cyber Threat Intelligence for Indian SMEs</p>
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-lg p-6 space-y-4">
          <h2 className="text-brand-text font-semibold text-lg">Sign in</h2>
          {error && <Alert variant="error">{error}</Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-brand-muted block mb-1">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
            </div>
            <div>
              <label className="text-sm text-brand-muted block mb-1">Password</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••" required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <div className="flex justify-between text-sm">
            <Link to="/forgot-password" className="text-brand-accent2 hover:underline">Forgot password?</Link>
            <Link to="/register" className="text-brand-accent2 hover:underline">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
