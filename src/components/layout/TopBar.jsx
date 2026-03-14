import { LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function TopBar({ title }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="h-14 bg-brand-bg border-b border-brand-border flex items-center justify-between px-6">
      <h1 className="text-brand-text font-semibold text-lg">{title}</h1>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <User className="w-4 h-4" />
            <span>{user.email}</span>
            <span className="bg-brand-surface border border-brand-border px-2 py-0.5 rounded text-xs capitalize">
              {user.role}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="text-brand-muted hover:text-brand-danger transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
