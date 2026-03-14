import LegalLayout, { Section, P, UL } from '../../components/layout/LegalLayout'

export default function RefundPolicy() {
  return (
    <LegalLayout
      title="Refund & Cancellation Policy"
      subtitle="Clear rules for cancellations and refunds, aligned with Indian Consumer Protection Act 2019."
      lastUpdated="14 March 2026"
    >
      <Section title="1. Overview">
        <P>
          MSInfo Services aims to provide a fair and transparent refund experience for ThreatShot subscribers. This
          policy is consistent with the Consumer Protection Act, 2019 and the Consumer Protection (E-Commerce) Rules,
          2020. Payments are processed via Razorpay; refunds are subject to Razorpay's processing timelines.
        </P>
      </Section>

      <Section title="2. Free Plan">
        <P>The Free plan involves no payment and therefore has no refund applicability.</P>
      </Section>

      <Section title="3. Paid Plans — Monthly Subscriptions">
        <UL items={[
          '7-day money-back guarantee for first-time paid subscribers (new account, first paid invoice only).',
          'After 7 days, the current billing period is non-refundable. You may cancel to stop future charges.',
          'Cancellation takes effect at the end of the active billing cycle. Access continues until then.',
          'Partial-month refunds are not issued for mid-cycle cancellations.',
        ]} />
      </Section>

      <Section title="4. Paid Plans — Annual Subscriptions">
        <UL items={[
          '14-day money-back guarantee from the date of first annual payment.',
          'After 14 days, a pro-rated refund may be requested for remaining complete months unused, at our discretion.',
          'Abuse of the annual plan or violation of the Acceptable Use Policy forfeits refund eligibility.',
        ]} />
      </Section>

      <Section title="5. Enterprise Plans">
        <P>
          Enterprise plan refunds are governed by the signed Order Form. In the absence of specific terms, the annual
          subscription policy above applies.
        </P>
      </Section>

      <Section title="6. Non-Refundable Situations">
        <UL items={[
          'Accounts terminated for violation of Terms of Service or Acceptable Use Policy.',
          'Requests made after the applicable money-back window.',
          'Fees for completed API calls or report generation that consumed third-party credits on your behalf.',
          'Bank/payment gateway fees charged independently by Razorpay or your issuing bank.',
        ]} />
      </Section>

      <Section title="7. How to Request a Refund">
        <P>
          Email billing@threatshot.in with subject "Refund Request — [your registered email]". Include your account
          email, invoice number, and reason. We will respond within 5 business days. Approved refunds are credited to
          the original payment method within 7–10 business days (subject to Razorpay and bank processing times).
        </P>
      </Section>

      <Section title="8. Disputed Charges">
        <P>
          Before initiating a chargeback with your bank, please contact us at billing@threatshot.in — most disputes are
          resolved faster through direct communication. Unresolved disputes may be escalated to the National Consumer
          Helpline (1915) or relevant consumer forums under the Consumer Protection Act, 2019.
        </P>
      </Section>

      <Section title="9. GST">
        <P>
          All prices displayed include 18% GST where applicable. GST invoices are issued via Razorpay for every
          transaction and are available in your account dashboard.
        </P>
      </Section>

      <Section title="10. Contact">
        <P>Billing queries: billing@threatshot.in</P>
        <P>MSInfo Services, India</P>
      </Section>
    </LegalLayout>
  )
}
