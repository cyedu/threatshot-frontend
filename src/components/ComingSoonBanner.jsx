import { Clock } from 'lucide-react'

export default function ComingSoonBanner({ module }) {
  return (
    <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg px-4 py-3 flex items-center gap-3 mb-6">
      <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
      <p className="text-yellow-300 text-sm">
        <strong>{module}</strong> is coming soon. Join the waitlist below to get early access.
      </p>
    </div>
  )
}
