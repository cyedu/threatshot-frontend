import { LogOut, User, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import ThemeToggle from '../ThemeToggle'

export default function TopBar({ title }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleBack = () => {
    if (window.history.state?.idx > 0) navigate(-1)
    else navigate('/dashboard')
  }

  return (
    <header className="h-14 bg-brand-bg border-b border-brand-border flex items-center justify-between px-6 gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          title="Go back"
          aria-label="Go back"
          className="p-1.5 rounded-md text-brand-muted hover:text-brand-text hover:bg-brand-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-brand-text font-semibold text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {user && (
          <div className="flex items-center gap-2 text-sm text-brand-muted pl-2 border-l border-brand-border">
            <User className="w-4 h-4" />
            <span>{user.email}</span>
            <span className="bg-brand-surface border border-brand-border px-2 py-0.5 rounded text-xs capitalize">
              {user.role}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="text-brand-muted hover:text-brand-danger transition-colors p-1.5"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
