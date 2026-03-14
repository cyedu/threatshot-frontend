import LegalLayout, { Section, P, UL } from '../../components/layout/LegalLayout'

export default function SecurityPolicy() {
  return (
    <LegalLayout
      title="Security & Responsible Disclosure"
      subtitle="Our security commitments and how to report vulnerabilities responsibly."
      lastUpdated="14 March 2026"
    >
      <Section title="1. Our Security Commitment">
        <P>
          MSInfo Services takes the security of ThreatShot and user data seriously. We design with security-first
          principles and maintain practices aligned to CERT-In Guidelines 2022, OWASP Top 10, and ISO/IEC 27001
          frameworks. We encourage responsible disclosure of vulnerabilities.
        </P>
      </Section>

      <Section title="2. Security Controls in Place">
        <UL items={[
          'TLS 1.2+ enforced for all data in transit; HSTS enabled.',
          'AES-256 encryption at rest for sensitive database fields.',
          'Bcrypt (cost factor 12) password hashing — passwords are never stored in plain text.',
          'JWT access tokens with 60-minute expiry; refresh token rotation.',
          'Rate limiting and account lockout after repeated failed login attempts.',
          'CORS policy restricted to approved origins.',
          'Content-Security-Policy, X-Frame-Options, and other security headers on all responses.',
          'AWS VPC with private subnets; database not publicly accessible.',
          'Regular dependency vulnerability scanning (Dependabot + pip-audit).',
          'Quarterly internal security reviews.',
        ]} />
      </Section>

      <Section title="3. Responsible Disclosure Policy">
        <P>
          If you discover a security vulnerability in ThreatShot, we ask that you follow responsible disclosure
          practices:
        </P>
        <UL items={[
          'Report the issue to security@threatshot.in with a detailed description.',
          'Do not exploit the vulnerability or access data beyond what is necessary to demonstrate the issue.',
          'Do not publicly disclose the vulnerability until we have had a reasonable opportunity to investigate and remediate (typically 90 days).',
          'Do not conduct automated scanning or fuzzing against production systems without prior written approval.',
        ]} />
      </Section>

      <Section title="4. Scope">
        <P><strong>In-scope:</strong></P>
        <UL items={[
          'threatshot.in and *.threatshot.in',
          'ThreatShot mobile or desktop apps (if released)',
          'API endpoints at api.threatshot.in',
        ]} />
        <P><strong>Out-of-scope:</strong></P>
        <UL items={[
          'Social engineering attacks against MSInfo Services staff.',
          'Physical attacks against our infrastructure.',
          'Denial-of-service (DoS/DDoS) testing.',
          'Third-party services we integrate with (VirusTotal, AbuseIPDB, etc.) — report to them directly.',
        ]} />
      </Section>

      <Section title="5. What to Expect After Reporting">
        <UL items={[
          'Acknowledgement within 72 hours.',
          'Status update within 7 days.',
          'Remediation timeline communicated based on severity (Critical: 7 days, High: 30 days, Medium: 90 days).',
          'Credit in our security acknowledgements page for valid, first-reported vulnerabilities (with your permission).',
        ]} />
      </Section>

      <Section title="6. CERT-In Compliance">
        <P>
          Pursuant to CERT-In Directions dated 28 April 2022, we maintain logs of all significant system events for
          180 days and report cyber incidents to CERT-In within 6 hours of detection as mandated.
        </P>
      </Section>

      <Section title="7. Bug Bounty">
        <P>
          We do not currently operate a paid bug bounty program. We offer public acknowledgement for valid, responsibly
          disclosed findings. A formal bug bounty program may be launched in future — watch this page for updates.
        </P>
      </Section>

      <Section title="8. Contact">
        <P>Security reports: security@threatshot.in (PGP key available on request)</P>
        <P>Incident response: security@threatshot.in — 24×7 monitoring for Critical severity</P>
      </Section>
    </LegalLayout>
  )
}
