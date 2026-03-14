import LegalLayout, { Section, P, UL } from '../../components/layout/LegalLayout'

export default function AcceptableUse() {
  return (
    <LegalLayout
      title="Acceptable Use Policy"
      subtitle="Rules that protect the integrity of ThreatShot and the broader security community."
      lastUpdated="14 March 2026"
    >
      <Section title="1. Purpose">
        <P>
          This Acceptable Use Policy ("AUP") supplements the Terms of Service and defines permitted and prohibited uses
          of ThreatShot. Violation of this AUP may result in immediate account suspension or termination without refund.
        </P>
      </Section>

      <Section title="2. Permitted Uses">
        <UL items={[
          'Investigating indicators associated with your own organisation\'s infrastructure or systems.',
          'Conducting authorised red-team, penetration testing, or threat-hunting engagements with written client consent.',
          'Academic or educational cybersecurity research in a controlled environment.',
          'Building internal security workflows and SIEM/SOAR integrations for defensive purposes.',
          'Generating threat intelligence reports for your customers under a licensed reseller agreement.',
        ]} />
      </Section>

      <Section title="3. Prohibited Uses">
        <P>The following uses are strictly prohibited:</P>
        <UL items={[
          'Investigating systems, IPs, or domains you do not own or have explicit written authorisation to test.',
          'Using scan results to facilitate attacks, fraud, phishing, or any criminal activity.',
          'Automated scraping, bulk API calls, or programmatic access beyond your plan quota or rate limits.',
          'Attempting to access other users\' data, scan histories, or account information.',
          'Circumventing access controls, authentication, or quota enforcement mechanisms.',
          'Uploading malware samples, exploit code, or CSAM through any input field.',
          'Reselling or sharing your API keys or account credentials with third parties.',
          'Using the service in a manner that violates the IT Act 2000, CERT-In directives, or any applicable law.',
          'Engaging in denial-of-service testing against our infrastructure.',
        ]} />
      </Section>

      <Section title="4. Quota & Rate Limits">
        <P>
          Each plan has daily IOC scan quotas enforced server-side. Deliberately engineering requests to evade rate
          limiting (e.g., rotating accounts, IP spoofing) is a violation of this AUP and may trigger permanent ban.
        </P>
      </Section>

      <Section title="5. Reporting Abuse">
        <P>
          If you believe someone is misusing ThreatShot, report it to abuse@threatshot.in. Include as much detail as
          possible. We investigate all credible reports and cooperate with law enforcement when required.
        </P>
      </Section>

      <Section title="6. Consequences of Violation">
        <UL items={[
          'Warning and temporary suspension for minor first-time violations.',
          'Immediate account termination without refund for serious or repeated violations.',
          'Reporting to CERT-In, law enforcement, or regulatory authorities where legally required.',
          'Civil or criminal action where damages or losses are incurred.',
        ]} />
      </Section>

      <Section title="7. Contact">
        <P>AUP queries and abuse reports: abuse@threatshot.in</P>
      </Section>
    </LegalLayout>
  )
}
