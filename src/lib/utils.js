import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  if (!date) return '—'
  return format(new Date(date), 'dd MMM yyyy')
}

export function formatRelativeTime(date) {
  if (!date) return '—'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function truncate(str, n = 120) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '…' : str
}

export function severityColor(severity) {
  switch (severity?.toLowerCase()) {
    case 'critical': return 'text-red-300 bg-red-900/50 border-red-700'
    case 'high':     return 'text-orange-300 bg-orange-900/50 border-orange-700'
    case 'medium':   return 'text-yellow-300 bg-yellow-900/50 border-yellow-700'
    case 'low':      return 'text-blue-300 bg-blue-900/50 border-blue-700'
    case 'clean':    return 'text-green-300 bg-green-900/50 border-green-700'
    default:         return 'text-gray-400 bg-gray-800 border-gray-600'
  }
}
