import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Shield, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react'
import api from '../../lib/api'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const validate = () => {
    if (!password) return 'Password is required.'
    if (password.length < 10) return 'Password must be at least 10 characters.'
    if (password !== confirm) return 'Passwords do not match.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setIsLoading(true)
    setError('')
    try {
      await api.post(`/auth/reset-password/${token}`, { token, password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Invalid or expired reset link. Please request a new one.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
          <h2 className="text-xl font-bold text-brand-text">Password reset successfully</h2>
          <p className="text-sm text-brand-muted">Redirecting you to sign in…</p>
          <Link to="/login" className="text-sm text-brand-accent hover:underline">
            Sign in now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Nav */}
      <nav className="border-b border-brand-border px-6 py-4">
        <div className="max-w-sm mx-auto">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="w-5 h-5 text-brand-accent" />
            <span className="font-bold text-base">
              <span className="text-brand-accent">THREAT</span>SHOT
            </span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">

          <div>
            <h1 className="text-2xl font-bold text-brand-text">Set new password</h1>
            <p className="text-sm text-brand-muted mt-1">
              Choose a strong password of at least 10 characters.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* New password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-brand-muted mb-1.5">
                New password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="Minimum 10 characters"
                  className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2.5 pr-10 text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-accent transition-colors"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-brand-muted hover:text-brand-text transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && password.length < 10 && (
                <p className="text-xs text-amber-500 mt-1">
                  {10 - password.length} more character{10 - password.length !== 1 ? 's' : ''} needed
                </p>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label htmlFor="confirm" className="block text-xs font-medium text-brand-muted mb-1.5">
                Confirm password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setError('') }}
                placeholder="Repeat your new password"
                className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-accent transition-colors"
              />
              {confirm && password !== confirm && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || password.length < 10 || password !== confirm}
              className="w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg px-4 py-2.5 transition-colors mt-2"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Resetting…</>
              ) : (
                'Reset password'
              )}
            </button>
          </form>

          <Link to="/login" className="block text-center text-sm text-brand-accent hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
