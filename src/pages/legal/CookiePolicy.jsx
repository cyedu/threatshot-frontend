import LegalLayout, { Section, P, UL } from '../../components/layout/LegalLayout'

export default function CookiePolicy() {
  return (
    <LegalLayout
      title="Cookie Policy"
      subtitle="What cookies ThreatShot uses and how to control them."
      lastUpdated="14 March 2026"
    >
      <Section title="1. What Are Cookies">
        <P>
          Cookies are small text files placed on your device by a website to remember preferences and enable certain
          functionality. ThreatShot uses cookies and similar technologies (localStorage, sessionStorage) to operate the
          platform securely and improve your experience.
        </P>
      </Section>

      <Section title="2. Cookies We Use">
        <P><strong>Strictly Necessary</strong></P>
        <UL items={[
          'access_token (localStorage) — your JWT session token. Required for authentication. Expires per your session.',
          'XSRF-TOKEN — CSRF protection cookie set by the backend. HttpOnly, Secure, SameSite=Strict.',
        ]} />

        <P><strong>Functional / Preference</strong></P>
        <UL items={[
          'theme — stores your light/dark mode preference. No expiry (persists until cleared).',
        ]} />

        <P><strong>Analytics (optional, consent-gated)</strong></P>
        <UL items={[
          'If you consent, we may use Cloudflare Web Analytics (cookie-free, privacy-preserving) or a self-hosted Plausible instance. No cross-site tracking. No data sold.',
        ]} />

        <P><strong>Third-party</strong></P>
        <UL items={[
          'Razorpay payment widget may set its own cookies on checkout pages. See Razorpay\'s Cookie Policy.',
        ]} />
      </Section>

      <Section title="3. No Cross-Site Tracking">
        <P>
          We do not use Google Analytics, Meta Pixel, or any ad-tech cookies. ThreatShot does not participate in
          cross-site behavioural advertising.
        </P>
      </Section>

      <Section title="4. Managing Cookies">
        <UL items={[
          'Browser settings — most browsers allow you to view, block, or delete cookies. Note: blocking strictly necessary cookies will break authentication.',
          'Opt out of analytics — if analytics is active, a banner will request consent. You can withdraw at any time via account settings.',
          'localStorage — clear via browser DevTools > Application > Local Storage.',
        ]} />
      </Section>

      <Section title="5. Retention">
        <P>
          Session cookies expire when you close your browser. Persistent cookies (theme) have no set expiry but can be
          deleted at any time. JWT tokens expire after 60 minutes of inactivity and require re-authentication.
        </P>
      </Section>

      <Section title="6. Legal Basis">
        <P>
          Strictly necessary cookies are used under our legitimate interest in operating a secure service. Analytics
          cookies are only set with your explicit consent per the DPDP Act 2023 and ePrivacy Directive where applicable.
        </P>
      </Section>

      <Section title="7. Contact">
        <P>Cookie-related queries: privacy@threatshot.in</P>
      </Section>
    </LegalLayout>
  )
}
