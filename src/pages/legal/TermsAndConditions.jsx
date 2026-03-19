import LegalLayout, { Section, P, UL } from '../../components/layout/LegalLayout'

export default function TermsAndConditions() {
  return (
    <LegalLayout
      title="Terms and Conditions"
      subtitle="Please read these Terms and Conditions carefully before registering or using ThreatShot. Your acceptance is required to create an account."
      lastUpdated="19 March 2026"
    >
      <Section title="1. Agreement to Terms">
        <P>
          These Terms and Conditions ("Terms", "Agreement") constitute a legally binding contract between you ("User",
          "you", "your") and MSInfo Services ("Company", "we", "our", "us"), the operator of ThreatShot
          (threatshot.in), a cyber threat intelligence platform ("Platform", "Service").
        </P>
        <P>
          By clicking "I agree to the Terms and Conditions" during registration, or by accessing or using the Service,
          you acknowledge that you have read, understood, and unconditionally agree to be bound by these Terms and our{' '}
          <a href="/privacy" className="text-brand-accent hover:underline">Privacy Policy</a>,{' '}
          <a href="/aup" className="text-brand-accent hover:underline">Acceptable Use Policy</a>, and{' '}
          <a href="/refunds" className="text-brand-accent hover:underline">Refund Policy</a>, all incorporated herein
          by reference.
        </P>
        <P>
          <strong className="text-brand-text">IF YOU DO NOT AGREE TO THESE TERMS IN THEIR ENTIRETY, YOU MUST NOT
          REGISTER FOR OR USE THE SERVICE.</strong> Registration is contingent upon your acceptance of these Terms.
          Your acceptance is recorded electronically along with a timestamp and IP address at the time of registration.
        </P>
        <P>
          If you are registering on behalf of an organisation, you represent and warrant that you have full legal
          authority to bind that organisation to these Terms. The organisation shall be jointly and severally liable
          for your compliance with these Terms.
        </P>
        <P>
          These Terms are governed by the <strong className="text-brand-text">Indian Contract Act, 1872</strong>, the{' '}
          <strong className="text-brand-text">Information Technology Act, 2000 ("IT Act")</strong>, the{' '}
          <strong className="text-brand-text">Digital Personal Data Protection Act, 2023 ("DPDP Act")</strong>, and all
          applicable rules and regulations thereunder.
        </P>
      </Section>

      <Section title="2. Description of Services">
        <P>
          ThreatShot is a Software-as-a-Service (SaaS) cyber threat intelligence platform operated by MSInfo Services.
          The Platform provides the following services (collectively, the "Services"):
        </P>
        <UL items={[
          'Threat Intelligence Feed — Aggregated, real-time threat data from multiple sources (including CISA, NVD, OTX, and others) filtered for Indian enterprise context.',
          'IOC Scanner — Lookup and analysis of Indicators of Compromise (IPs, domains, file hashes, URLs) against VirusTotal, AbuseIPDB, and 10+ threat intelligence sources.',
          'DNS & Email Security Analysis — Validation of SPF, DKIM, DMARC, and DNSSEC configurations (subject to availability).',
          'SBOM Vulnerability Scanning — Upload of Software Bill of Materials (SBOM) files for CVE risk assessment (subject to availability).',
          'Vendor Scorecards — Third-party risk assessment and scoring aligned to RBI/SEBI compliance frameworks (subject to availability).',
          'Intelligence Blog — Security briefings, threat advisories, and cybersecurity news relevant to Indian enterprises.',
          'API Access — Programmatic access to Services via authenticated REST API endpoints, subject to plan quotas.',
        ]} />
        <P>
          Features marked "subject to availability" or "coming soon" are provided at the Company's discretion.
          Availability of any feature does not constitute a warranty of continuous provision.
        </P>
      </Section>

      <Section title="3. Eligibility and Registration">
        <P>To register for and use ThreatShot, you must satisfy all of the following conditions:</P>
        <UL items={[
          'You must be at least 18 years of age. By registering, you represent that you are of legal age.',
          'You must have the legal capacity to enter into binding contracts under the laws of your jurisdiction.',
          'Your use of the Service must not violate any applicable law, regulation, or these Terms.',
          'You must provide accurate, complete, and current registration information.',
          'You must not have been previously suspended or removed from the Platform.',
          'Where required, you must hold any professional licences or authorisations applicable to the activities for which you use the Service.',
        ]} />
        <P>
          The Company reserves the right to refuse registration or terminate any account at its sole discretion,
          without stating reasons, and without liability.
        </P>
        <P>
          <strong className="text-brand-text">Acceptance Logging:</strong> Upon completing registration and accepting
          these Terms, the Company electronically records your acceptance including: (a) timestamp in IST; (b) IP
          address; (c) version of Terms accepted; and (d) account identifier. This record constitutes prima facie
          evidence of your acceptance under the IT Act, 2000 and the Indian Evidence Act, 1872.
        </P>
      </Section>

      <Section title="4. Account Security and Responsibilities">
        <P>
          You are solely responsible for maintaining the confidentiality and security of your account credentials.
          You agree to:
        </P>
        <UL items={[
          'Use a strong, unique password of not less than 10 characters.',
          'Never share your account credentials, API keys, or access tokens with any third party.',
          'Immediately notify the Company at security@threatshot.in upon discovering or suspecting any unauthorised access to your account.',
          'Ensure that all users accessing the Platform through your account comply with these Terms.',
          'Log out from your account at the end of each session on shared or public devices.',
        ]} />
        <P>
          The Company shall not be liable for any loss, damage, or liability arising from your failure to comply with
          these security obligations, or from unauthorised access resulting from your own negligence, disclosure, or
          breach of these Terms.
        </P>
        <P>
          You acknowledge that the Company may monitor account activity for security purposes, including detection of
          unauthorised access, abuse, and compliance with these Terms.
        </P>
      </Section>

      <Section title="5. Acceptable Use and Prohibited Conduct">
        <P>
          The Service is provided exclusively for lawful cybersecurity purposes. You agree to use the Service only in
          accordance with our full{' '}
          <a href="/aup" className="text-brand-accent hover:underline">Acceptable Use Policy</a>.
          The following conduct is expressly prohibited:
        </P>
        <UL items={[
          'Investigating, scanning, or querying systems, IP addresses, domains, or infrastructure that you do not own or for which you do not have valid, documented written authorisation.',
          'Using the Service to facilitate, plan, or execute cyber attacks, denial-of-service attacks, phishing, fraud, extortion, or any other criminal or tortious activity.',
          'Submitting IOCs, malware samples, exploit code, or any harmful content through the Platform.',
          'Circumventing, disabling, or interfering with access controls, rate limits, quota enforcement, or authentication mechanisms.',
          'Reverse engineering, decompiling, disassembling, or attempting to extract the source code or underlying threat intelligence database of the Platform.',
          'Automated scraping, bulk API calls, or programmatic access beyond your plan\'s allocated quota.',
          'Reselling, white-labelling, sublicensing, or commercially distributing the Service or its outputs without a written reseller agreement with the Company.',
          'Sharing, transferring, or selling your API keys, account credentials, or access tokens to third parties.',
          'Creating multiple accounts to circumvent plan restrictions, quotas, or bans.',
          'Uploading or transmitting child sexual abuse material (CSAM) or any content that is illegal under applicable law.',
          'Interfering with or disrupting the integrity, performance, or availability of the Service or its infrastructure.',
          'Using the Service in a manner that violates the IT Act 2000, the DPDP Act 2023, CERT-In Guidelines, or any other applicable Indian or international law.',
        ]} />
        <P>
          Violation of this section may result in immediate account suspension or termination without refund,
          reporting to CERT-In, law enforcement, or regulatory authorities, and civil or criminal proceedings to
          recover damages.
        </P>
      </Section>

      <Section title="6. Subscription Plans, Pricing, and Billing">
        <P>
          ThreatShot is offered under the following plans:
        </P>
        <UL items={[
          'Free Plan — Limited features at no charge. No SLA. Subject to fair-use quotas enforced at the Company\'s discretion.',
          'Starter Plan — ₹999/month (or equivalent annual pricing). Enhanced quotas and features as described on the pricing page.',
          'Professional Plan — ₹2,999/month (or equivalent annual pricing). Advanced features, higher quotas, and priority support.',
          'Enterprise Plan — Custom pricing via a separate Order Form. Includes SLA commitments, dedicated support, and custom integrations.',
        ]} />
        <P>
          All paid subscriptions are billed in Indian Rupees (INR) and processed via Razorpay, a PCI-DSS compliant
          payment gateway. Prices are inclusive of applicable Goods and Services Tax (GST) unless explicitly stated
          otherwise. The Company reserves the right to modify pricing with 30 days' advance notice via email or
          in-app notification.
        </P>
        <P>
          <strong className="text-brand-text">Auto-Renewal:</strong> Paid subscriptions renew automatically at the
          end of each billing period unless cancelled. You may cancel your subscription at any time from your account
          settings; cancellation takes effect at the end of the current billing period, and you will retain access
          to paid features until then.
        </P>
        <P>
          <strong className="text-brand-text">Failed Payments:</strong> If a renewal payment fails, the Company may
          downgrade your account to the Free plan, suspend access, or terminate your account after reasonable notice.
        </P>
        <P>
          For cancellations and refunds, please refer to our{' '}
          <a href="/refunds" className="text-brand-accent hover:underline">Refund Policy</a>.
        </P>
      </Section>

      <Section title="7. Intellectual Property Rights">
        <P>
          All right, title, and interest in and to the Platform — including but not limited to the source code,
          compiled software, UI/UX design, threat intelligence processing algorithms, models, methodologies, databases,
          trademarks, trade names, logos, and documentation — are and shall remain the exclusive property of MSInfo
          Services and its licensors.
        </P>
        <P>
          Subject to your compliance with these Terms, the Company grants you a limited, non-exclusive,
          non-transferable, non-sublicensable, revocable licence to access and use the Service solely for your
          internal security operations during the term of your subscription.
        </P>
        <P>
          <strong className="text-brand-text">Your Data:</strong> You retain all ownership rights in the data, IOC
          indicators, and content you submit to the Platform ("User Data"). By submitting User Data, you grant the
          Company a limited, worldwide, royalty-free licence to process such data solely for the purpose of providing
          the Services.
        </P>
        <P>
          <strong className="text-brand-text">Feedback:</strong> Any feedback, suggestions, or improvement ideas you
          provide to the Company may be freely used, incorporated, and commercialised by the Company without
          obligation or compensation to you.
        </P>
        <P>
          No rights are granted except as explicitly stated herein. Nothing in these Terms transfers ownership of any
          intellectual property to you.
        </P>
      </Section>

      <Section title="8. Third-Party Integrations and Data Sharing">
        <P>
          The Service integrates with third-party threat intelligence APIs and infrastructure providers, including
          but not limited to VirusTotal, AbuseIPDB, AlienVault OTX, URLScan.io, AWS, Cloudflare, Brevo, and Razorpay.
          You acknowledge and agree that:
        </P>
        <UL items={[
          'IOC indicators (IPs, domains, hashes, URLs) you submit for analysis may be forwarded to these third-party APIs as part of the Service functionality.',
          'The Company does not warrant the accuracy, completeness, availability, or timeliness of data returned by third-party providers.',
          'Your use of the Service is also subject to the terms and privacy policies of applicable third-party providers.',
          'The Company is not responsible for the conduct, data practices, or service availability of third-party providers.',
          'Sensitive or classified indicators should not be submitted through the Platform without appropriate authorisation.',
        ]} />
      </Section>

      <Section title="9. Data Protection and Privacy">
        <P>
          The collection, use, storage, and sharing of your personal data is governed by our{' '}
          <a href="/privacy" className="text-brand-accent hover:underline">Privacy Policy</a>, which complies with:
        </P>
        <UL items={[
          'Digital Personal Data Protection Act, 2023 (DPDP Act) — as the primary applicable Indian data protection legislation.',
          'Information Technology Act, 2000 and the IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.',
          'General Data Protection Regulation (GDPR) — for users in the European Economic Area.',
          'California Consumer Privacy Act (CCPA) — for users in California.',
        ]} />
        <P>
          By registering, you consent to the processing of your personal data as described in the Privacy Policy,
          including the transfer of data to third-party service providers as necessary to deliver the Service. You
          may exercise your data rights (access, correction, erasure, portability) by contacting{' '}
          <strong className="text-brand-text">privacy@threatshot.in</strong>.
        </P>
        <P>
          The Company maintains records of your consent to these Terms and the Privacy Policy, including timestamp,
          IP address, and version, as required under the DPDP Act, 2023.
        </P>
      </Section>

      <Section title="10. Disclaimers of Warranty">
        <P>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE"
          BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. THE COMPANY EXPRESSLY DISCLAIMS ALL
          WARRANTIES, INCLUDING BUT NOT LIMITED TO:
        </P>
        <UL items={[
          'Implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
          'Warranties that the Service will be uninterrupted, error-free, secure, or free from viruses or other harmful components.',
          'Warranties as to the accuracy, completeness, reliability, or currency of threat intelligence data, scan results, or any other information provided through the Service.',
          'Warranties that vulnerabilities or threats identified by the Service are complete or exhaustive.',
        ]} />
        <P>
          Cybersecurity intelligence is inherently probabilistic and time-sensitive. Outputs generated by the Service
          do not constitute legal, compliance, or professional security advice. The Company strongly recommends
          supplementing Service outputs with professional cybersecurity expertise.
        </P>
      </Section>

      <Section title="11. Limitation of Liability">
        <P>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:
        </P>
        <UL items={[
          'The Company\'s aggregate liability for any claims arising out of or relating to these Terms or the Service (whether in contract, tort, negligence, or otherwise) shall not exceed the total fees paid by you to the Company in the three (3) calendar months immediately preceding the event giving rise to the claim.',
          'The Company shall not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, including but not limited to: loss of profits, loss of data, loss of goodwill, business interruption, security breaches caused by third-party actions, or the cost of substitute services.',
          'The Company shall not be liable for damages arising from your reliance on threat intelligence outputs for operational security decisions without independent verification.',
          'Free plan users access the Service with no liability undertaken by the Company whatsoever, except where prohibited by mandatory law.',
        ]} />
        <P>
          Some jurisdictions do not allow the exclusion or limitation of certain damages. In such jurisdictions, the
          Company's liability is limited to the maximum extent permitted by law.
        </P>
      </Section>

      <Section title="12. Indemnification">
        <P>
          You agree to defend, indemnify, and hold harmless MSInfo Services, its officers, directors, employees,
          contractors, licensors, and agents from and against any and all claims, damages, obligations, losses,
          liabilities, costs, and expenses (including reasonable legal fees) arising from or related to:
        </P>
        <UL items={[
          'Your breach of any provision of these Terms or any incorporated policy.',
          'Your violation of any applicable law, regulation, or third-party right, including intellectual property rights.',
          'Your misuse of the Service, including conducting unauthorised security testing or submitting harmful content.',
          'Any content or data you submit to the Platform.',
          'Any claim by a third party arising from your use of the Service.',
        ]} />
        <P>
          The Company reserves the right to assume the exclusive defence and control of any matter subject to
          indemnification by you, in which event you shall cooperate with the Company in asserting any available
          defences.
        </P>
      </Section>

      <Section title="13. Confidentiality">
        <P>
          In the course of using the Service, you may gain access to confidential information of the Company,
          including but not limited to proprietary algorithms, threat intelligence methodologies, pricing information,
          and technical documentation. You agree to:
        </P>
        <UL items={[
          'Maintain strict confidentiality of such information and not disclose it to any third party without prior written consent from the Company.',
          'Use confidential information solely for the purpose of using the Service as permitted under these Terms.',
          'Notify the Company immediately upon becoming aware of any unauthorised disclosure.',
        ]} />
        <P>
          Confidentiality obligations survive termination of these Terms for a period of three (3) years, except
          with respect to trade secrets, which shall be protected indefinitely.
        </P>
      </Section>

      <Section title="14. Term, Suspension, and Termination">
        <P>
          These Terms commence on the date of your acceptance and continue until terminated by either party.
        </P>
        <P>
          <strong className="text-brand-text">Termination by You:</strong> You may terminate your account at any
          time by deleting your account from account settings or by emailing legal@threatshot.in. Termination does
          not entitle you to a refund except as provided in the Refund Policy.
        </P>
        <P>
          <strong className="text-brand-text">Suspension or Termination by the Company:</strong> The Company may,
          at its sole discretion and without prior notice, suspend or terminate your account if:
        </P>
        <UL items={[
          'You breach any provision of these Terms or any incorporated policy.',
          'You engage in conduct that the Company determines, in its sole discretion, is harmful to the Service, the Company, other users, or third parties.',
          'You fail to pay any fees due.',
          'Required by applicable law, court order, or regulatory authority.',
          'The Company ceases to offer the Service or determines continuation would create legal or regulatory risk.',
        ]} />
        <P>
          <strong className="text-brand-text">Effect of Termination:</strong> Upon termination, your licence to use
          the Service immediately ceases. The Company may, at its discretion, delete your account data in accordance
          with the Privacy Policy retention schedules. Provisions of these Terms that by their nature should survive
          termination shall survive, including Sections 7, 9, 10, 11, 12, 13, 15, and 16.
        </P>
      </Section>

      <Section title="15. Compliance with Laws and Regulatory Requirements">
        <P>
          You agree to use the Service in full compliance with all applicable laws and regulations, including:
        </P>
        <UL items={[
          'Information Technology Act, 2000 and rules thereunder.',
          'Digital Personal Data Protection Act, 2023 and rules thereunder.',
          'CERT-In Directions on Information Security Practices, Procedure, Prevention, Response and Reporting of Cyber Incidents (April 2022).',
          'Reserve Bank of India (RBI) cybersecurity guidelines for regulated entities.',
          'Securities and Exchange Board of India (SEBI) cybersecurity and cyber resilience framework (where applicable).',
          'Any other applicable Indian or international cybersecurity, data protection, or export control laws.',
        ]} />
        <P>
          The Company does not represent that the Service is appropriate for use in all jurisdictions. Users accessing
          the Service from outside India do so on their own initiative and are solely responsible for compliance with
          local laws.
        </P>
      </Section>

      <Section title="16. Governing Law, Jurisdiction, and Dispute Resolution">
        <P>
          These Terms shall be governed by and construed in accordance with the laws of India, without regard to
          conflicts of law principles.
        </P>
        <P>
          <strong className="text-brand-text">Amicable Resolution:</strong> In the event of any dispute, claim, or
          controversy arising out of or relating to these Terms or the Service, the parties shall first attempt to
          resolve the matter amicably through good-faith negotiations within thirty (30) days of written notice of
          the dispute.
        </P>
        <P>
          <strong className="text-brand-text">Jurisdiction:</strong> If amicable resolution fails, any dispute shall
          be subject to the exclusive jurisdiction of the competent courts in{' '}
          <strong className="text-brand-text">Bengaluru, Karnataka, India</strong>.
        </P>
        <P>
          Nothing herein shall prevent the Company from seeking emergency injunctive or other equitable relief from
          any court of competent jurisdiction to prevent irreparable harm pending resolution of a dispute.
        </P>
      </Section>

      <Section title="17. Changes to Terms">
        <P>
          The Company reserves the right to modify, update, or replace these Terms at any time. Where changes are
          material, the Company will:
        </P>
        <UL items={[
          'Provide at least 14 days' written notice via email to your registered address and/or in-app notification.',
          'Publish the updated Terms with a revised "Last Updated" date.',
          'Where required by the DPDP Act or other applicable law, obtain fresh consent for material changes affecting data processing.',
        ]} />
        <P>
          Your continued use of the Service after the effective date of revised Terms constitutes your acceptance of
          those revised Terms. If you do not agree to the revised Terms, you must discontinue use of the Service and
          delete your account before the effective date.
        </P>
        <P>
          The Company maintains a record of all previous versions of these Terms. Prior versions are available upon
          request at legal@threatshot.in.
        </P>
      </Section>

      <Section title="18. Force Majeure">
        <P>
          The Company shall not be liable for any delay or failure to perform its obligations under these Terms to
          the extent caused by circumstances beyond its reasonable control, including but not limited to acts of God,
          natural disasters, pandemic, war, terrorism, government action, regulatory change, internet or
          telecommunications infrastructure failures, power outages, or third-party service provider failures.
        </P>
      </Section>

      <Section title="19. Severability and Waiver">
        <P>
          If any provision of these Terms is held invalid, illegal, or unenforceable by a court of competent
          jurisdiction, the remaining provisions shall continue in full force and effect, and the invalid provision
          shall be modified to the minimum extent necessary to make it enforceable.
        </P>
        <P>
          No failure or delay by the Company in exercising any right under these Terms shall constitute a waiver of
          that right. A waiver is effective only if made in writing and signed by an authorised representative of
          the Company.
        </P>
      </Section>

      <Section title="20. Entire Agreement">
        <P>
          These Terms, together with the Privacy Policy, Acceptable Use Policy, Refund Policy, Cookie Policy, and
          any applicable Order Form or Enterprise Agreement, constitute the entire agreement between you and MSInfo
          Services with respect to the Service, and supersede all prior negotiations, representations, warranties,
          and understandings, whether oral or written, relating to the subject matter hereof.
        </P>
      </Section>

      <Section title="21. Contact Information">
        <P>
          For any queries regarding these Terms and Conditions, please contact:
        </P>
        <UL items={[
          'Legal & Compliance: legal@threatshot.in',
          'Privacy & Data Rights: privacy@threatshot.in',
          'Grievance Officer (DPDP Act §13): grievance@threatshot.in — Response within 72 hours',
          'Security & Abuse: security@threatshot.in',
          'Registered Entity: MSInfo Services, India',
        ]} />
      </Section>
    </LegalLayout>
  )
}
