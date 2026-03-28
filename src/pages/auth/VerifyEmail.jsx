import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '../../lib/api'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState('verifying') // verifying | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token found. Please use the link from your email.')
      return
    }

    api.post('/auth/verify', { token })
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error')
        const detail = err.response?.data?.detail
        if (typeof detail === 'string') {
          setMessage(detail)
        } else {
          setMessage('This verification link is invalid or has expired. Please request a new one.')
        }
      })
  }, [token])

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

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-5">

          {status === 'verifying' && (
            <>
              <Loader2 className="w-12 h-12 text-brand-accent animate-spin mx-auto" />
              <h2 className="text-xl font-bold text-brand-text">Verifying your email…</h2>
              <p className="text-sm text-brand-muted">Please wait a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
              <h2 className="text-xl font-bold text-brand-text">Email verified!</h2>
              <p className="text-sm text-brand-muted">
                Your account is now active. You can sign in to ThreatShot.
              </p>
              <Link
                to="/login"
                className="inline-block bg-brand-accent hover:bg-brand-accent/90 text-white font-medium text-sm rounded-lg px-6 py-2.5 transition-colors"
              >
                Sign in
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-14 h-14 text-red-500 mx-auto" />
              <h2 className="text-xl font-bold text-brand-text">Verification failed</h2>
              <p className="text-sm text-brand-muted">
                {message}
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="inline-block border border-brand-border hover:border-brand-accent text-brand-muted hover:text-brand-text text-sm rounded-lg px-6 py-2.5 transition-colors"
                >
                  Back to sign in
                </Link>
                <p className="text-xs text-brand-muted">
                  Need a new link?{' '}
                  <Link to="/login" className="text-brand-accent hover:underline">
                    Sign in to resend verification
                  </Link>
                </p>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
