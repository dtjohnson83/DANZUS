import type { Metadata } from 'next'
import { LegalPage } from '../LegalPage'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from '../site'

const TITLE = 'Privacy Notice | DANZUS Holdings LLC'
const DESCRIPTION =
  'Privacy notice for DANZUS Holdings LLC in Folsom. Phone numbers and SMS opt-in data from (916) 404-6129 are never shared or sold to third parties for marketing.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/privacy',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DANZUS Holdings LLC' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

export default function PrivacyPage() {
  return (
    <LegalPage kicker="DANZUS Holdings LLC" title="Privacy">
      <p>
        DANZUS Holdings LLC, in Folsom, California, runs the phone number and the site at danzus.co.
      </p>
      <p>
        If you call or text {CONTACT_PHONE_DISPLAY}, we keep that phone number, the fact that you opted in by
        calling or texting, and the messages we need in order to reply. If you use the contact form, we also keep
        your name, email, and what you wrote.
      </p>
      <p>
        Phone numbers and SMS opt-in data are never shared or sold to third parties for marketing.
      </p>
      <p>
        We use this information to answer you, follow up, and book a time. Carriers and the texting provider deliver
        the messages. They are not allowed to use your number for their own marketing. We keep the record only as
        long as we need it for the conversation and our own books.
      </p>
      <p>
        Reply STOP to opt out of texts. Reply HELP for help. Privacy questions go to{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  )
}
