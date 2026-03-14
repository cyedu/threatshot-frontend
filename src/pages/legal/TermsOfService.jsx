import LegalLayout, { Section, P, UL } from '../../components/layout/LegalLayout'

export default function TermsOfService() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="The agreement between you and MSInfo Services governing your use of ThreatShot."
      lastUpdated="14 March 2026"
    >
      <Section title="1. Acceptance">
        <P>
          By creating an account or using ThreatShot (threatshot.in), you ("User") agree to be bound by these Terms of
          Service ("Terms") and our Privacy Policy. These Terms constitute a legally binding agreement under the Indian
          Contract Act, 1872 and the Information Technology Act, 2000. If you do not agree, do not use the service.
        </P>
        <P>
          If you are using ThreatShot on behalf of an organisation, you represent that you have authority to bind that
          organisation to these Terms.
        </P>
      </Section>

      <Section title="2. Service Description">
        <P>
          ThreatShot is a Software-as-a-Service (SaaS) cyber threat intelligence platform operated by MSInfo Services.
          It provides threat feed aggregation, IOC (Indicator of Compromise) scanning, DNS/email security analysis,
          vulnerability intelligence, and related cybersecurity tools.
        </P>
      </Section>

      <Section title="3. Eligibility">
        <UL items={[
          'You must be at least 18 years of age.',
          'Use of the service for activities that violate any applicable law is prohibited.',
          'Enterprise customers must execute a separate Order Form for SLA-backed commitments.',
        ]} />
      </Section>

      <Section title="4. Accounts">
        <P>
          You are responsible for maintaining the confidentiality of your credentials and for all activity under your
          account. Notify us immediately at security@threatshot.in of any suspected unauthorised access. We are not
          liable for losses arising from compromised credentials caused by your own negligence.
        </P>
      </Section>

      <Section title="5. Acceptable Use">
        <P>You agree NOT to use ThreatShot to:</P>
        <UL items={[
          'Submit IOCs you do not have authorisation to investigate.',
          'Conduct automated bulk lookups that exceed your plan quota.',
          'Reverse-engineer, scrape, or attempt to extract our underlying threat intelligence database.',
          'Resell or white-label the service without a written reseller agreement.',
          'Violate the Acceptable Use Policy (see separate AUP page).',
        ]} />
      </Section>

      <Section title="6. Plans, Billing & Payment">
        <P>
          Free plan features are provided as-is with no SLA. Paid plans are billed monthly or annually in Indian Rupees
          (INR) via Razorpay. Prices are inclusive of applicable GST unless stated otherwise. Subscription renews
          automatically; you may cancel at any time from your account settings — cancellation takes effect at the end of
          the current billing period. See Refund Policy for cancellation refund rules.
        </P>
      </Section>

      <Section title="7. Intellectual Property">
        <P>
          All platform code, UI design, threat intelligence processing logic, and branding are the exclusive property
          of MSInfo Services. You are granted a limited, non-exclusive, non-transferable licence to use the service for
          your internal security operations. You retain ownership of data you upload or generate.
        </P>
      </Section>

      <Section title="8. Third-Party Services">
        <P>
          ThreatShot integrates with third-party threat intel APIs (VirusTotal, AbuseIPDB, etc.). We disclaim
          responsibility for the accuracy, availability, or terms of those services. IOC data you submit may be
          forwarded to these providers per their respective privacy policies.
        </P>
      </Section>

      <Section title="9. Disclaimer of Warranties">
        <P>
          The service is provided "as is" and "as available". MSInfo Services makes no warranty that the service will
          be uninterrupted, error-free, or that threat intelligence will be complete or current. Cybersecurity
          intelligence is probabilistic by nature — findings do not constitute legal or compliance advice.
        </P>
      </Section>

      <Section title="10. Limitation of Liability">
        <P>
          To the maximum extent permitted by law, MSInfo Services' aggregate liability for any claims arising from these
          Terms shall not exceed the fees paid by you in the three months preceding the claim. We are not liable for
          indirect, consequential, or punitive damages.
        </P>
      </Section>

      <Section title="11. Indemnification">
        <P>
          You agree to indemnify and hold MSInfo Services harmless from any claims, losses, or expenses (including
          legal fees) arising from your breach of these Terms or misuse of the service.
        </P>
      </Section>

      <Section title="12. Governing Law & Disputes">
        <P>
          These Terms are governed by the laws of India. Disputes shall first be attempted to be resolved amicably
          within 30 days. Unresolved disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru,
          Karnataka, India.
        </P>
      </Section>

      <Section title="13. Changes to Terms">
        <P>
          We may update these Terms with 14 days' notice via email or in-app notification. Continued use after the
          effective date constitutes acceptance of the revised Terms.
        </P>
      </Section>

      <Section title="14. Contact">
        <P>MSInfo Services — legal@threatshot.in</P>
      </Section>
    </LegalLayout>
  )
}
