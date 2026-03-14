import LegalLayout, { Section, P, UL } from '../../components/layout/LegalLayout'

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How ThreatShot collects, uses, and protects your personal data."
      lastUpdated="14 March 2026"
    >
      <Section title="1. Introduction">
        <P>
          MSInfo Services ("we", "our", "us") operates ThreatShot (threatshot.in). This Privacy Policy explains how we
          collect, use, store, and share personal data in compliance with the Digital Personal Data Protection Act, 2023
          (DPDP Act), the Information Technology Act, 2000 and its Rules, the General Data Protection Regulation (GDPR)
          where applicable, and the California Consumer Privacy Act (CCPA) where applicable.
        </P>
        <P>
          By using ThreatShot you consent to the practices described here. If you do not agree, please discontinue use
          of the service.
        </P>
      </Section>

      <Section title="2. Data We Collect">
        <P><strong>Account data</strong> — name, email address, organisation name, and hashed password provided at
        registration.</P>
        <P><strong>Usage data</strong> — IP address, browser/OS, pages visited, features used, timestamps, and API
        request logs retained for security and quota enforcement.</P>
        <P><strong>Scan data</strong> — IOC indicators (IPs, domains, hashes, URLs) you submit for analysis.</P>
        <P><strong>Payment data</strong> — handled entirely by Razorpay; we store only the plan tier and transaction
        reference ID. We never receive or store raw card/bank details.</P>
        <P><strong>Cookies &amp; tracking</strong> — session tokens, preference cookies, and optional analytics cookies
        (see Cookie Policy).</P>
      </Section>

      <Section title="3. Legal Basis for Processing">
        <UL items={[
          'Contract performance — to provide the service you signed up for (DPDP Act §4, GDPR Art. 6(1)(b)).',
          'Legitimate interests — security monitoring, fraud prevention, and service improvement.',
          'Consent — for marketing communications and optional analytics cookies. You may withdraw consent at any time.',
          'Legal obligation — retaining records as required by Indian law, including IT Act §79 safe-harbour obligations.',
        ]} />
      </Section>

      <Section title="4. How We Use Your Data">
        <UL items={[
          'Authenticate your account and enforce plan quotas.',
          'Process IOC lookups against third-party threat intelligence APIs (VirusTotal, AbuseIPDB, OTX, etc.).',
          'Send transactional emails — verification, password reset, plan receipts.',
          'Send periodic security digests (opt-in; unsubscribe link in every email).',
          'Generate anonymised aggregate statistics for product improvement.',
          'Comply with law enforcement requests supported by valid legal process.',
        ]} />
      </Section>

      <Section title="5. Data Sharing">
        <P>We share data only as necessary:</P>
        <UL items={[
          'Threat intel providers (VirusTotal, AbuseIPDB, etc.) — IOC values you submit are sent to their APIs.',
          'Cloud infrastructure — AWS (Mumbai region, ap-south-1) for compute; Cloudflare for CDN/DDoS protection.',
          'Email delivery — Brevo (Sendinblue) for transactional email.',
          'Payment processing — Razorpay under their own PCI-DSS compliant data handling.',
          'We do NOT sell, rent, or trade your personal data to third parties for marketing.',
        ]} />
      </Section>

      <Section title="6. Data Retention">
        <UL items={[
          'Account data — retained while your account is active and for 90 days after deletion request.',
          'Scan results — retained for 12 months; bulk-deleted on account deletion.',
          'Access logs — retained for 180 days for security auditing.',
          'Payment records — retained for 7 years as required by Indian accounting standards.',
        ]} />
      </Section>

      <Section title="7. Your Rights">
        <P>Under the DPDP Act 2023 and GDPR you have the right to:</P>
        <UL items={[
          'Access — request a copy of personal data we hold about you.',
          'Correction — request correction of inaccurate data.',
          'Erasure — request deletion of your account and associated data.',
          'Portability — receive your data in a machine-readable format.',
          'Objection — object to processing based on legitimate interests.',
          'Withdraw consent — for marketing and analytics at any time.',
        ]} />
        <P>Submit requests to privacy@threatshot.in. We respond within 30 days.</P>
      </Section>

      <Section title="8. Security">
        <P>
          We protect data using TLS 1.2+ in transit, AES-256 encryption at rest for sensitive fields, bcrypt password
          hashing, and regular vulnerability assessments aligned to CERT-In Guidelines 2022. No system is 100% secure;
          promptly report any suspected breach to security@threatshot.in.
        </P>
      </Section>

      <Section title="9. International Transfers">
        <P>
          Data is primarily stored in AWS ap-south-1 (Mumbai). When data is processed by third-party APIs outside
          India, we rely on Standard Contractual Clauses (GDPR) and equivalent safeguards under the DPDP Act's
          cross-border transfer provisions.
        </P>
      </Section>

      <Section title="10. Children's Privacy">
        <P>ThreatShot is not directed at persons under 18. We do not knowingly collect data from minors.</P>
      </Section>

      <Section title="11. Changes to This Policy">
        <P>
          Material changes will be notified by email 14 days before they take effect. Continued use after the effective
          date constitutes acceptance.
        </P>
      </Section>

      <Section title="12. Contact">
        <P>Data Controller: MSInfo Services, India</P>
        <P>Privacy queries: privacy@threatshot.in</P>
        <P>Grievance Officer (DPDP Act §13): grievance@threatshot.in — response within 72 hours.</P>
      </Section>
    </LegalLayout>
  )
}
