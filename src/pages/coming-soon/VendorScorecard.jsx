import { ClipboardCheck } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui'
import ComingSoonBanner from '../../components/ComingSoonBanner'
import WaitlistForm from './WaitlistForm'

export default function VendorScorecard() {
  return (
    <PageWrapper title="Vendor Scorecard">
      <ComingSoonBanner module="Vendor Scorecard" />
      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="w-6 h-6 text-brand-accent2" />
          <h2 className="text-brand-text font-semibold text-lg">Third-Party Vendor Scorecard</h2>
        </div>
        <p className="text-brand-muted text-sm leading-relaxed">
          Assess the security posture of your vendors and supply chain partners. Send questionnaires,
          collect evidence, auto-score responses, and generate RBI/SEBI-compliant third-party risk reports.
        </p>
        <ul className="text-brand-muted text-sm space-y-1 list-disc list-inside">
          <li>Automated vendor questionnaires</li>
          <li>Risk scoring & tiering</li>
          <li>RBI & SEBI compliance templates</li>
          <li>Continuous monitoring alerts</li>
        </ul>
        <WaitlistForm module="vendor_scorecard" />
      </Card>
    </PageWrapper>
  )
}
