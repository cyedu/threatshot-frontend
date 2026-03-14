import { Network } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui'
import ComingSoonBanner from '../../components/ComingSoonBanner'
import WaitlistForm from './WaitlistForm'

export default function NetworkScan() {
  return (
    <PageWrapper title="Network Scan">
      <ComingSoonBanner module="Network Scan" />
      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <Network className="w-6 h-6 text-brand-accent2" />
          <h2 className="text-brand-text font-semibold text-lg">External Network Scanner</h2>
        </div>
        <p className="text-brand-muted text-sm leading-relaxed">
          Discover your internet-exposed attack surface. Map open ports, identify running services,
          detect outdated software versions, and get a prioritised list of remediation actions.
        </p>
        <ul className="text-brand-muted text-sm space-y-1 list-disc list-inside">
          <li>Port & service enumeration</li>
          <li>Banner grabbing & version detection</li>
          <li>CVE matching on exposed services</li>
          <li>Scheduled recurring scans</li>
        </ul>
        <WaitlistForm module="network_scan" />
      </Card>
    </PageWrapper>
  )
}
