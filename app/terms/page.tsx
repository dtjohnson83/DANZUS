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
      <section id="renewal">
        <h2>Monthly plans</h2>
        <p>
          Missed-call text-back is $99 a month after a free 30-day pilot. Website hosting and small edits are $49 a
          month. Google and AI search is $199 a month. DANZUS Growth is $299 a month. Each of those monthly charges
          renews every month at that price until you cancel. We will tell you before a price changes. The $1,500
          website build is paid 50% up front and 50% at launch, and it does not renew. If you stay on DANZUS Growth
          for 6 months, the website costs $750 instead of $1,500. You pay it once.
        </p>
        <p>
          Cancel online at any time at <a href="https://danzus.co/cancel">https://danzus.co/cancel</a>. You can also
          email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or call {CONTACT_PHONE_DISPLAY}. Say which plan
          to stop. We confirm by email. The plan then stops at the end of the month already paid, and another month
          does not start. If you cancel missed-call text-back during the free 30-day pilot, the $99 monthly charge
          does not start.
        </p>
      </section>
      <section id="copyright">
        <h2>Copyright and DMCA</h2>
        <p>If you think we used your photo, writing, or other work without permission, email us. Include:</p>
        <ul>
          <li>Your name and a way to reach you</li>
          <li>The work you claim is infringed</li>
          <li>The page address of the material</li>
          <li>A statement that you have a good faith belief the use is not authorized</li>
          <li>A statement that the notice is accurate and that you are the owner or are allowed to act for the owner</li>
          <li>Your physical or electronic signature</li>
        </ul>
        <p>
          Send copyright notices to <a href={`mailto:${CONTACT_EMAIL}`}>dan@danzus.co</a>.
        </p>
      </section>
    </LegalPage>
  )
}
