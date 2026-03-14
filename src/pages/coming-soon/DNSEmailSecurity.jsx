import { Mail, Shield } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui'
import ComingSoonBanner from '../../components/ComingSoonBanner'
import WaitlistForm from './WaitlistForm'

export default function DNSEmailSecurity() {
  return (
    <PageWrapper title="DNS & Email Security">
      <ComingSoonBanner module="DNS & Email Security" />
      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-brand-accent2" />
          <h2 className="text-brand-text font-semibold text-lg">DNS & Email Security Checker</h2>
        </div>
        <p className="text-brand-muted text-sm leading-relaxed">
          Validate your domain's email security posture with automated checks for SPF, DKIM, DMARC,
          BIMI, MTA-STS, and DNSSEC. Get a scored report with remediation guidance tailored to your setup.
        </p>
        <ul className="text-brand-muted text-sm space-y-1 list-disc list-inside">
          <li>SPF / DKIM / DMARC validation</li>
          <li>BIMI & brand indicator checks</li>
          <li>DNSSEC verification</li>
          <li>Actionable fix recommendations</li>
        </ul>
        <WaitlistForm module="dns_email" />
      </Card>
    </PageWrapper>
  )
}
