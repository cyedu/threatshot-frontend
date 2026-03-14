import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Terminal, ArrowLeft, AlertTriangle } from 'lucide-react'

const GLITCH_CHARS = '!@#$%^&*<>?/\\|{}[]~`'

function glitch(text) {
  return text
    .split('')
    .map(c =>
      Math.random() < 0.15
        ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        : c
    )
    .join('')
}

const TERMINAL_LINES = [
  { delay: 0,    text: '$ traceroute /requested-path',          color: 'text-brand-muted' },
  { delay: 600,  text: '> resolving route... [FAILED]',         color: 'text-yellow-500' },
  { delay: 1200, text: '> HTTP 404 — resource not found',       color: 'text-brand-accent' },
  { delay: 1900, text: '> scanning for threats... [0 found]',   color: 'text-brand-muted' },
  { delay: 2600, text: '> access log: your IP has been noted.', color: 'text-brand-muted' },
  { delay: 3300, text: '> recommendation: stand down. 🫡',      color: 'text-brand-success' },
]

export default function NotFound() {
  const [title, setTitle] = useState('404')
  const [visibleLines, setVisibleLines] = useState([])
  const [cursor, setCursor] = useState(true)

  // Glitch effect on the 404 number
  useEffect(() => {
    let count = 0
    const interval = setInterval(() => {
      count++
      if (count < 20) {
        setTitle(glitch('404'))
      } else {
        setTitle('404')
        clearInterval(interval)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [])

  // Typewriter effect for terminal lines
  useEffect(() => {
    const timers = TERMINAL_LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(prev => [...prev, i]), line.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col">

      {/* Nav */}
      <nav className="border-b border-brand-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-accent" />
            <span className="font-bold text-base">
              <span className="text-brand-accent">THREAT</span>SHOT
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to safety
          </Link>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center space-y-8">

        {/* Glitch number */}
        <div className="relative select-none">
          <p
            className="text-[7rem] sm:text-[10rem] font-black leading-none text-brand-accent font-mono tracking-tighter"
            style={{ textShadow: '0 0 40px rgba(220,38,38,0.4), 0 0 80px rgba(220,38,38,0.15)' }}
          >
            {title}
          </p>
          {/* Ghost layer for glitch look */}
          <p
            className="absolute inset-0 text-[7rem] sm:text-[10rem] font-black leading-none font-mono tracking-tighter text-brand-accent2 opacity-20 select-none pointer-events-none"
            style={{ transform: 'translate(3px, -3px)' }}
            aria-hidden
          >
            404
          </p>
        </div>

        {/* Headline */}
        <div className="space-y-2 max-w-lg">
          <h1 className="text-xl sm:text-2xl font-bold text-brand-text">
            Route not found. <span className="text-brand-accent">Access denied.</span>
          </h1>
          <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
            This page doesn't exist — or it's above your clearance level.
          </p>
        </div>

        {/* Terminal block */}
        <div className="w-full max-w-lg bg-brand-surface border border-brand-border rounded-xl overflow-hidden text-left shadow-lg shadow-black/30">
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-brand-border bg-brand-bg">
            <Terminal className="w-3.5 h-3.5 text-brand-muted" />
            <span className="text-xs text-brand-muted font-mono">threatshot-shell — bash</span>
            <div className="ml-auto flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
            </div>
          </div>
          {/* Terminal output */}
          <div className="px-4 py-4 space-y-1.5 font-mono text-xs sm:text-sm min-h-[160px]">
            {TERMINAL_LINES.map((line, i) => (
              visibleLines.includes(i) && (
                <p key={i} className={line.color}>{line.text}</p>
              )
            ))}
            {visibleLines.length < TERMINAL_LINES.length && (
              <span className={`inline-block w-2 h-4 bg-brand-accent ${cursor ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
            )}
            {visibleLines.length === TERMINAL_LINES.length && (
              <p className="text-brand-muted">
                $ <span className={`inline-block w-2 h-4 bg-brand-muted align-middle ${cursor ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
              </p>
            )}
          </div>
        </div>

        {/* Ethical message */}
        <div className="max-w-lg w-full bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5 space-y-2 text-left">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
            <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wide">Heads up</span>
          </div>
          <p className="text-sm text-brand-muted leading-relaxed">
            If you <span className="text-brand-text font-medium">don't belong here</span> — no cap, just close the tab.
            We log all access attempts and correlate with threat intel feeds. 👀
          </p>
          <p className="text-sm text-brand-muted leading-relaxed">
            If you <span className="text-brand-text font-medium">do belong here</span> and hit this by mistake —
            dm us at{' '}
            <a href="mailto:support@threatshot.in" className="text-brand-accent2 hover:underline">
              support@threatshot.in
            </a>{' '}
            or slide into the admin's inbox. We're building the good-guy side of cyber. Come correct. 🤝
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="bg-brand-accent hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            ← Back to base
          </Link>
          <Link
            to="/blog"
            className="border border-brand-border hover:border-brand-accent2 text-brand-muted hover:text-brand-accent2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Read the intel
          </Link>
          <a
            href="mailto:support@threatshot.in"
            className="border border-brand-border hover:border-brand-accent2 text-brand-muted hover:text-brand-accent2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Contact admin
          </a>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-brand-border px-6 py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-muted">
          <span>© {new Date().getFullYear()} MSInfo Services. Ethical defenders only.</span>
          <div className="flex items-center gap-4">
            <Link to="/aup" className="hover:text-brand-accent2 transition-colors">Acceptable Use</Link>
            <Link to="/security" className="hover:text-brand-accent2 transition-colors">Report Vuln</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
