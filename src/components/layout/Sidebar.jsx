import { NavLink } from 'react-router-dom'
import {
  Shield, Radio, Search, BookOpen, Clock, LayoutDashboard,
  Zap, PenSquare, ShieldAlert, X,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import useAuthStore from '../../store/authStore'

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/threat-feed',  label: 'Threat Feed', icon: Radio },
  { to: '/cve',          label: 'CVE Search',  icon: ShieldAlert },
  { to: '/ioc-scanner',  label: 'IOC Scanner', icon: Search },
  { to: '/blog',         label: 'Blog',        icon: BookOpen },
]

const adminItems = [
  { to: '/admin/blog',   label: 'Blog Admin',  icon: PenSquare },
]

const comingItems = [
  { to: '/dns-email',        label: 'DNS & Email',   icon: Clock },
  { to: '/sbom',             label: 'SBOM Scanner',  icon: Clock },
  { to: '/network-scan',     label: 'Network Scan',  icon: Clock },
  { to: '/ai-pentest',       label: 'AI Pentest',    icon: Clock },
  { to: '/vendor-scorecard', label: 'Vendor Score',  icon: Clock },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'super_admin' || user?.role === 'org_admin'

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          // Structure
          'fixed md:sticky top-0 z-40 md:z-auto',
          'w-64 md:w-60 bg-brand-bg border-r border-brand-border flex flex-col h-screen',
          // Mobile slide animation
          'transition-transform duration-200 ease-in-out md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo + mobile close */}
        <div className="px-4 py-5 border-b border-brand-border flex items-center justify-between">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand-accent" />
            <span className="font-bold text-brand-text">
              <span className="text-brand-accent">THREAT</span>SHOT
            </span>
          </NavLink>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-md text-brand-muted hover:text-brand-text hover:bg-brand-surface transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <p className="text-brand-muted text-xs px-2 mb-2 uppercase tracking-wider">Live Modules</p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 md:py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-brand-surface text-brand-text'
                    : 'text-brand-muted hover:text-brand-text hover:bg-brand-surface'
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <p className="text-brand-muted text-xs px-2 mt-4 mb-2 uppercase tracking-wider">Admin</p>
              {adminItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 md:py-2 rounded-md text-sm transition-colors',
                      isActive
                        ? 'bg-brand-surface text-brand-text'
                        : 'text-brand-muted hover:text-brand-text hover:bg-brand-surface'
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </NavLink>
              ))}
            </>
          )}

          <p className="text-brand-muted text-xs px-2 mt-4 mb-2 uppercase tracking-wider">Coming Soon</p>
          {comingItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 md:py-2 rounded-md text-sm text-brand-muted hover:text-brand-text hover:bg-brand-surface transition-colors"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              <span className="ml-auto text-xs bg-yellow-900/50 text-yellow-300 border border-yellow-700 px-1.5 py-0.5 rounded shrink-0">
                Soon
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-brand-border text-xs text-brand-muted">
          <Zap className="w-3 h-3 inline mr-1 text-brand-accent" />
          RBI · CERT-In · ISO 27001
        </div>
      </aside>
    </>
  )
}
