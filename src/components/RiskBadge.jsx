import { Badge } from './ui'
import { severityColor } from '../lib/utils'

export default function RiskBadge({ level, score }) {
  return (
    <div className="flex items-center gap-2">
      <Badge className={severityColor(level)}>
        {level?.toUpperCase() || 'UNKNOWN'}
      </Badge>
      {score !== undefined && (
        <span className="text-xs text-brand-muted">{score}/100</span>
      )}
    </div>
  )
}
