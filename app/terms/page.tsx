import type { Metadata } from 'next'
import { LegalPage } from '../LegalPage'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from '../site'

const TITLE = 'Terms and SMS Policy | DANZUS Holdings LLC'
const DESCRIPTION =
  'Terms for DANZUS Holdings LLC, including SMS terms for people who call or text (916) 404-6129. Message frequency varies. Reply STOP to opt out.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/terms',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DANZUS Holdings LLC' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

export default function TermsPage() {
  return (
    <LegalPage kicker="DANZUS Holdings LLC" title="Terms">
      <p>
        DANZUS Holdings LLC sets up websites, missed-call text-back, and local search for small businesses. The
        prices on this site are the current menu. Missed-call text-back is month to month after a free 30-day pilot,
        with no setup fee. A website is paid 50% up front and 50% at launch, and you keep the site.
      </p>
      <section id="sms">
        <h2>DANZUS Text Messaging Program</h2>
        <p>
          When you call or text{' '}
          <a href={CONTACT_PHONE_TEL} data-track="call_click" data-track-location="section">
            {CONTACT_PHONE_DISPLAY}
          </a>
          , or enter your number on our contact form and check the SMS consent box, you agree to receive text messages
          from DANZUS Holdings LLC. Messages cover missed-call replies, answers to your inquiry, appointment scheduling
          and reminders, and customer care. Message frequency varies. Message and data rates may apply. Reply STOP to
          opt out at any time; you will get one confirmation and no further messages. Reply HELP for help, or contact{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or {CONTACT_PHONE_DISPLAY}. Consent is not a condition
          of purchase. Carriers are not liable for delayed or undelivered messages. See our Privacy Policy at{' '}
          <a href="https://danzus.co/privacy">https://danzus.co/privacy</a>.
        </p>
      </section>
    </LegalPage>
  )
}
