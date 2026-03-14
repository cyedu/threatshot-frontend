import { cn } from '../../lib/utils'

// Button
export function Button({ children, variant = 'primary', className, ...props }) {
  const variants = {
    primary:   'bg-brand-accent hover:bg-red-700 text-white font-medium rounded-md px-4 py-2 transition-colors disabled:opacity-50',
    secondary: 'border border-brand-border text-brand-text hover:bg-brand-surface rounded-md px-4 py-2 transition-colors',
    ghost:     'text-brand-muted hover:text-brand-text hover:bg-brand-surface rounded-md px-3 py-2 transition-colors',
    danger:    'bg-red-800 hover:bg-red-700 text-white rounded-md px-4 py-2 transition-colors',
  }
  return (
    <button className={cn(variants[variant], className)} {...props}>
      {children}
    </button>
  )
}

// Input
export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'bg-brand-bg border border-brand-border rounded-md text-brand-text px-3 py-2 w-full',
        'focus:outline-none focus:border-brand-accent2 placeholder:text-brand-muted',
        className
      )}
      {...props}
    />
  )
}

// Card
export function Card({ children, className, ...props }) {
  return (
    <div className={cn('bg-brand-surface border border-brand-border rounded-lg p-4', className)} {...props}>
      {children}
    </div>
  )
}

// Badge
const SEVERITY_CLASSES = {
  critical: 'bg-red-900/40 border-red-700 text-red-300',
  high:     'bg-orange-900/40 border-orange-700 text-orange-300',
  medium:   'bg-yellow-900/40 border-yellow-700 text-yellow-300',
  low:      'bg-blue-900/40 border-blue-700 text-blue-300',
  clean:    'bg-green-900/40 border-green-700 text-green-300',
}

export function Badge({ children, variant, className, ...props }) {
  const severityClass = variant ? (SEVERITY_CLASSES[variant] ?? '') : ''
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-brand-border', severityClass, className)} {...props}>
      {children}
    </span>
  )
}

// Spinner
export function Spinner({ className }) {
  return (
    <div className={cn('animate-spin rounded-full border-2 border-brand-border border-t-brand-accent w-5 h-5', className)} />
  )
}

// Alert
export function Alert({ children, variant = 'info', className }) {
  const variants = {
    info:    'bg-blue-900/30 border-brand-info text-blue-300',
    error:   'bg-red-900/30 border-brand-danger text-red-300',
    success: 'bg-green-900/30 border-brand-success text-green-300',
    warning: 'bg-yellow-900/30 border-brand-warning text-yellow-300',
  }
  return (
    <div className={cn('border rounded-md px-4 py-3 text-sm', variants[variant], className)}>
      {children}
    </div>
  )
}

// Select
export function Select({ children, className, ...props }) {
  return (
    <select
      className={cn(
        'bg-brand-bg border border-brand-border rounded-md text-brand-text px-3 py-2',
        'focus:outline-none focus:border-brand-accent2',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

// Progress bar
export function Progress({ value = 0, className }) {
  return (
    <div className={cn('bg-brand-border rounded-full h-2 overflow-hidden', className)}>
      <div
        className="bg-brand-accent h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}

// Textarea
export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'bg-brand-bg border border-brand-border rounded-md text-brand-text px-3 py-2 w-full resize-none',
        'focus:outline-none focus:border-brand-accent2 placeholder:text-brand-muted',
        className
      )}
      {...props}
    />
  )
}
