import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '../LegalPage'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from '../site'

export const metadata: Metadata = {
  title: 'Terms',
  description:
    'Terms for DANZUS Holdings LLC, including SMS terms for people who call or text (916) 404-6129.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <LegalPage kicker="DANZUS Holdings LLC" title="Terms">
      <p>
        DANZUS Holdings LLC sets up AI assistants for small businesses. Prices on the site are starting ranges. The
        price for a shop is fixed on a call before any setup begins.
      </p>
      <h2>SMS terms</h2>
      <p>
        DANZUS Holdings LLC texts people who call or text{' '}
        <a href={CONTACT_PHONE_TEL}>{CONTACT_PHONE_DISPLAY}</a>.
      </p>
      <ul>
        <li>Message frequency varies.</li>
        <li>Message and data rates may apply.</li>
        <li>Reply STOP to opt out.</li>
        <li>Reply HELP for help.</li>
        <li>
          Contact <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </li>
      </ul>
      <p>
        Texting is how we reply when a call is missed and how we follow up on a conversation you started. Agreeing to
        texts is not required to buy anything else. Carriers are not liable for delayed or undelivered messages.
      </p>
      <p>
        How we handle phone numbers is in the <Link href="/privacy">privacy notice</Link>.
      </p>
    </LegalPage>
  )
}
