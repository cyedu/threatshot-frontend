import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle({ className = '' }) {
  const { isLight, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-label="Toggle theme"
      className={`p-2 rounded-md transition-colors text-brand-muted hover:text-brand-text hover:bg-brand-surface ${className}`}
    >
      {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  )
}
