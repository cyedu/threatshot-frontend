import LegalLayout, { Section, P } from '../../components/layout/LegalLayout'

export default function CookiePolicy() {
  return (
    <LegalLayout
      title="Cookie Policy"
      subtitle="Every cookie and storage item ThreatShot sets — what it is, why it exists, and how to remove it."
      lastUpdated="29 March 2026"
    >
      <Section title="1. What Are Cookies">
        <P>
          Cookies are small text files placed on your device by a website. ThreatShot also uses
          browser <strong>localStorage</strong> and <strong>sessionStorage</strong> for items that are
          not transmitted to our servers on every request. All storage is first-party — we do not use
          any cross-site tracking technology.
        </P>
      </Section>

      <Section title="2. Cookies and Storage Items We Set">
        <P>The table below lists every item ThreatShot stores on your device.</P>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs text-brand-muted border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-text">
                <th className="text-left py-2 pr-4 font-semibold whitespace-nowrap">Name</th>
                <th className="text-left py-2 pr-4 font-semibold whitespace-nowrap">Storage type</th>
                <th className="text-left py-2 pr-4 font-semibold whitespace-nowrap">Category</th>
                <th className="text-left py-2 pr-4 font-semibold">Purpose</th>
                <th className="text-left py-2 pr-4 font-semibold whitespace-nowrap">Expires</th>
                <th className="text-left py-2 font-semibold whitespace-nowrap">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              <CookieRow
                name="access_token"
                storage="localStorage"
                category="Strictly Necessary"
                purpose="Stores your JWT authentication token. Required to keep you signed in and to authorise API requests."
                expires="60 minutes of inactivity, then requires re-login"
                flags="Never sent to third parties. Cleared on sign-out."
              />
              <CookieRow
                name="theme"
                storage="localStorage"
                category="Preference"
                purpose="Stores your chosen colour scheme (light or dark mode) so the page loads in your preferred theme."
                expires="Persists until you clear browser storage or change the setting"
                flags="No personal data. Not transmitted to the server."
              />
              <CookieRow
                name="anon_id"
                storage="localStorage"
                category="Strictly Necessary"
                purpose="A randomly generated anonymous identifier assigned before you register. Used to link SBOM scan results to your browser session when you are not signed in."
                expires="Removed once you register and sign in"
                flags="Contains no personal data. Not shared with third parties."
              />
              <CookieRow
                name="XSRF-TOKEN"
                storage="Cookie (HttpOnly, Secure)"
                category="Strictly Necessary"
                purpose="Cross-Site Request Forgery (CSRF) protection token issued by the backend. Ensures form submissions and API mutations originate from your authenticated session."
                expires="Session — deleted when you close the browser or sign out"
                flags="HttpOnly · Secure · SameSite=Strict"
              />
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-brand-surface border border-brand-border rounded-lg text-xs text-brand-muted space-y-1">
          <p><strong className="text-brand-text">Razorpay (payment pages only)</strong></p>
          <p>
            When you access a checkout or billing page, Razorpay's payment widget loads and may set its own
            cookies on the <code className="bg-brand-border/50 px-1 rounded">razorpay.com</code> domain.
            These are governed by{' '}
            <a
              href="https://razorpay.com/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent hover:underline"
            >
              Razorpay's Privacy Policy
            </a>
            . ThreatShot does not control or read these cookies.
          </p>
        </div>
      </Section>

      <Section title="3. What We Do NOT Use">
        <P>
          ThreatShot does <strong>not</strong> use:
        </P>
        <ul className="space-y-1.5 pl-4 mt-2">
          {[
            'Google Analytics or any Google tracking pixels',
            'Meta (Facebook) Pixel or conversion tracking',
            'Ad-tech cookies or behavioural advertising networks',
            'Session-replay tools (e.g. Hotjar, FullStory)',
            'Any cross-site tracking or fingerprinting',
          ].map((item, i) => (
            <li key={i} className="text-sm text-brand-muted flex gap-2">
              <span className="text-brand-accent mt-1 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="4. Server-Side Metadata We Record">
        <P>
          When you perform certain actions (account creation, login, IOC scan, SBOM scan), our server
          logs the following alongside the action record:
        </P>
        <ul className="space-y-1.5 pl-4 mt-2">
          {[
            'IP address — for security, rate-limiting, and abuse prevention',
            'User-Agent string — browser and OS identifier, for audit context',
            'Timestamp — exact date and time of the action (UTC)',
          ].map((item, i) => (
            <li key={i} className="text-sm text-brand-muted flex gap-2">
              <span className="text-brand-accent mt-1 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <P>
          This data is retained as part of your audit log and is not used for marketing or advertising.
        </P>
      </Section>

      <Section title="5. Managing and Removing Cookies">
        <ul className="space-y-1.5 pl-4">
          {[
            'Browser settings — most browsers let you view, block, or delete cookies. Blocking strictly necessary cookies will break authentication.',
            'localStorage — clear via browser DevTools › Application › Local Storage › threatshot.in.',
            'Sign out — clears the access_token from localStorage and invalidates the XSRF-TOKEN cookie immediately.',
          ].map((item, i) => (
            <li key={i} className="text-sm text-brand-muted flex gap-2">
              <span className="text-brand-accent mt-1 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="6. Legal Basis">
        <P>
          Strictly necessary cookies and localStorage items are used under our legitimate interest in
          operating a secure, functional service. The <strong>theme</strong> preference item contains no
          personal data. You acknowledge use of these items when you register.
        </P>
        <P>
          If you opt in to marketing communications during registration, your email address may be used
          to send you threat intelligence updates, product news, and security advisories. You can
          withdraw this consent at any time from your account settings.
        </P>
      </Section>

      <Section title="7. Contact">
        <P>
          Cookie or privacy questions: <a href="mailto:privacy@threatshot.in" className="text-brand-accent hover:underline">privacy@threatshot.in</a>
        </P>
      </Section>
    </LegalLayout>
  )
}

function CookieRow({ name, storage, category, purpose, expires, flags }) {
  return (
    <tr className="align-top">
      <td className="py-3 pr-4 font-mono text-brand-text whitespace-nowrap">{name}</td>
      <td className="py-3 pr-4 whitespace-nowrap">{storage}</td>
      <td className="py-3 pr-4 whitespace-nowrap">
        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
          category === 'Strictly Necessary'
            ? 'bg-brand-accent/15 text-brand-accent'
            : 'bg-brand-surface text-brand-muted border border-brand-border'
        }`}>
          {category}
        </span>
      </td>
      <td className="py-3 pr-4">{purpose}</td>
      <td className="py-3 pr-4 whitespace-nowrap text-brand-muted/70">{expires}</td>
      <td className="py-3 text-brand-muted/70">{flags}</td>
    </tr>
  )
}
