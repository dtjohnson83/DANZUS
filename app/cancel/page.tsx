import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '../LegalPage'
import legal from '../legal.module.css'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from '../site'
import { CancelForm } from './CancelForm'

const TITLE = 'Cancel a monthly plan | DANZUS Holdings LLC'
const DESCRIPTION =
  'Cancel a DANZUS monthly plan online. Missed-call text-back, hosting, Google and AI search, and DANZUS Growth renew each month until you cancel.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/cancel' },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/cancel',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DANZUS Holdings LLC' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

export default function CancelPage() {
  return (
    <LegalPage kicker="DANZUS Holdings LLC" title="Cancel">
      <p>
        Monthly plans from DANZUS Holdings LLC renew each month at the price below until you cancel. This page is
        how you cancel online. There is no separate billing login.
      </p>
      <section id="plans">
        <h2>What renews</h2>
        <ul>
          <li>Missed-call text-back is $99 a month after a free 30-day pilot. No setup fee.</li>
          <li>Website hosting and small edits are $49 a month. The $1,500 website build is paid once and does not renew.</li>
          <li>Google and AI search is $199 a month.</li>
          <li>
            DANZUS Growth is $299 a month. If you stay on DANZUS Growth for 6 months, the website costs $750 instead of
            $1,500. You pay it once.
          </li>
        </ul>
      </section>
      <section id="how">
        <h2>How to cancel</h2>
        <p>
          Use the form. It opens an email to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the plan
          filled in. You can also email that address yourself, or call{' '}
          <a href={CONTACT_PHONE_TEL}>{CONTACT_PHONE_DISPLAY}</a>. Tell us the business name and which plan to stop.
        </p>
        <p>
          We confirm by email. The monthly plan stops at the end of the month already paid, and another month does not
          start. If you cancel missed-call text-back during the free 30-day pilot, the $99 monthly charge does not
          start.
        </p>
        <div className={legal.formBlock}>
          <CancelForm />
        </div>
      </section>
      <p>
        The same terms are on the <Link href="/terms">terms page</Link>. Questions go to {CONTACT_EMAIL}.
      </p>
    </LegalPage>
  )
}
