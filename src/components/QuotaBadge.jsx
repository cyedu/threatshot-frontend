import { Progress } from './ui'

export default function QuotaBadge({ used, limit, feature }) {
  if (limit === undefined) return null
  const pct = limit > 0 ? (used / limit) * 100 : 100
  const color = pct >= 90 ? 'text-red-400' : pct >= 70 ? 'text-yellow-400' : 'text-brand-muted'
  return (
    <div className="space-y-1">
      <div className={`text-xs ${color}`}>
        {feature}: {used} / {limit} used today
      </div>
      <Progress value={pct} />
    </div>
  )
}
