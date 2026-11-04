import type { Metadata } from 'next'
import { LegalPage } from '../LegalPage'
import { CONTACT_EMAIL } from '../site'

const TITLE = 'Stop email | DANZUS Holdings LLC'
const DESCRIPTION =
  'How to stop commercial email from DANZUS Holdings LLC. Email dan@danzus.co with the subject Unsubscribe.'

const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Unsubscribe')}`

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/unsubscribe' },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/unsubscribe',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DANZUS Holdings LLC' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

export default function UnsubscribePage() {
  return (
    <LegalPage kicker="DANZUS Holdings LLC" title="Stop email">
      <p>
        To stop commercial email from DANZUS Holdings LLC, email{' '}
        <a href={MAILTO}>{CONTACT_EMAIL}</a> with the subject Unsubscribe. Include the address you want removed.
      </p>
      <p>
        There is no separate mailing-list login. That inbox is the opt-out. A report you asked for, or a voicemail
        notice sent to a business owner, is a service message about something you already requested.
      </p>
      <p>
        <a href={MAILTO}>Email an unsubscribe request</a>
      </p>
    </LegalPage>
  )
}
