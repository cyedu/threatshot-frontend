import { Package } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui'
import ComingSoonBanner from '../../components/ComingSoonBanner'
import WaitlistForm from './WaitlistForm'

export default function SBOMScanner() {
  return (
    <PageWrapper title="SBOM Scanner">
      <ComingSoonBanner module="SBOM Scanner" />
      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-brand-accent2" />
          <h2 className="text-brand-text font-semibold text-lg">Software Bill of Materials Scanner</h2>
        </div>
        <p className="text-brand-muted text-sm leading-relaxed">
          Upload your SBOM (CycloneDX or SPDX) and get an instant vulnerability report cross-referenced
          against CVE databases. Know exactly which open-source components put your product at risk.
        </p>
        <ul className="text-brand-muted text-sm space-y-1 list-disc list-inside">
          <li>CycloneDX & SPDX format support</li>
          <li>CVE cross-referencing via NVD</li>
          <li>License compliance check</li>
          <li>Exportable risk report (PDF)</li>
        </ul>
        <WaitlistForm module="sbom" />
      </Card>
    </PageWrapper>
  )
}
