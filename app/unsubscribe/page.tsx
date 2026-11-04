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
      <p>Email us and we&apos;ll take you off the list. We may still send things you asked for, like your report.</p>
      <p>
        <a href={MAILTO}>Email {CONTACT_EMAIL}</a>
      </p>
    </LegalPage>
  )
}
