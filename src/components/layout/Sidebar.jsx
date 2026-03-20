import { NavLink } from 'react-router-dom'
import { Shield, Radio, Search, BookOpen, Clock, LayoutDashboard, Zap, PenSquare, ShieldAlert } from 'lucide-react'
import { cn } from '../../lib/utils'
import useAuthStore from '../../store/authStore'

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/threat-feed',  label: 'Threat Feed',    icon: Radio },
  { to: '/cve',          label: 'CVE Search',     icon: ShieldAlert },
  { to: '/ioc-scanner',  label: 'IOC Scanner',    icon: Search },
  { to: '/blog',         label: 'Blog',           icon: BookOpen },
]

const adminItems = [
  { to: '/admin/blog',   label: 'Blog Admin',     icon: PenSquare },
]

const comingItems = [
  { to: '/dns-email',    label: 'DNS & Email',    icon: Clock },
  { to: '/sbom',         label: 'SBOM Scanner',   icon: Clock },
  { to: '/network-scan', label: 'Network Scan',   icon: Clock },
  { to: '/ai-pentest',   label: 'AI Pentest',     icon: Clock },
  { to: '/vendor-scorecard', label: 'Vendor Score',   icon: Clock },
]

export default function Sidebar() {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'super_admin' || user?.role === 'org_admin'

  return (
    <aside className="w-60 bg-brand-bg border-r border-brand-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-brand-border">
        <NavLink to="/" className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-brand-accent" />
          <span className="font-bold text-brand-text">
            <span className="text-brand-accent">THREAT</span>SHOT
          </span>
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <p className="text-brand-muted text-xs px-2 mb-2 uppercase tracking-wider">Live Modules</p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-brand-surface text-brand-text'
                  : 'text-brand-muted hover:text-brand-text hover:bg-brand-surface'
              )
            }
          >
            <Icon className="w-4 h-4" />
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
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-brand-surface text-brand-text'
                      : 'text-brand-muted hover:text-brand-text hover:bg-brand-surface'
                  )
                }
              >
                <Icon className="w-4 h-4" />
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
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-brand-muted hover:text-brand-text hover:bg-brand-surface transition-colors"
          >
            <Icon className="w-4 h-4" />
            {label}
            <span className="ml-auto text-xs bg-yellow-900/50 text-yellow-300 border border-yellow-700 px-1.5 py-0.5 rounded">Soon</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-brand-border text-xs text-brand-muted">
        <Zap className="w-3 h-3 inline mr-1 text-brand-accent" />
        RBI · CERT-In · ISO 27001
      </div>
    </aside>
  )
}
