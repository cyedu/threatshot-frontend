import { LogOut, User, ArrowLeft, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import ThemeToggle from '../ThemeToggle'
import ActiveScanBanner from '../sbom/ActiveScanBanner'

export default function TopBar({ title, onMenuClick }) {
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
    <header className="h-14 bg-brand-bg border-b border-brand-border flex items-center justify-between px-4 md:px-6 gap-3 shrink-0">
      {/* Left: hamburger (mobile) + back (desktop) + title */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-md text-brand-muted hover:text-brand-text hover:bg-brand-surface transition-colors shrink-0"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Back — desktop only */}
        <button
          onClick={handleBack}
          title="Go back"
          aria-label="Go back"
          className="hidden md:flex p-1.5 rounded-md text-brand-muted hover:text-brand-text hover:bg-brand-surface transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h1 className="text-brand-text font-semibold text-base md:text-lg truncate">{title}</h1>
      </div>

      {/* Right: scan banner + theme + user */}
      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
        <ActiveScanBanner />
        <ThemeToggle />

        {user && (
          <>
            {/* Email + role — hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-brand-muted pl-2 border-l border-brand-border">
              <User className="w-4 h-4 shrink-0" />
              <span className="hidden lg:block max-w-[140px] truncate text-xs">{user.email}</span>
              <span className="bg-brand-surface border border-brand-border px-1.5 py-0.5 rounded text-xs capitalize shrink-0">
                {user.role}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-brand-muted hover:text-brand-danger transition-colors p-1.5"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </header>
  )
}
