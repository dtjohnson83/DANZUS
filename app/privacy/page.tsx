import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '../LegalPage'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from '../site'

const TITLE = 'Privacy Notice | DANZUS Holdings LLC'
const DESCRIPTION =
  'Privacy notice for DANZUS Holdings LLC in Folsom. Mobile phone numbers and SMS opt-in data and consent are not shared with any third parties or affiliates.'

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
        your name, email, and what you wrote. If you run the free AI search check, we keep the business name,
        website, city and trade, email, and whether you asked for a follow-up email, and we send the report to that
        email.
      </p>
      <section id="sms">
        <h2>Text messaging (SMS)</h2>
        <p>
          We do not share, sell, rent, or trade mobile phone numbers or SMS opt-in data and consent with any third
          parties or affiliates for any purpose, including marketing or promotional purposes. Text messaging originator
          opt-in data and consent will not be shared with any third parties. Information is used only to reply to you
          and provide the service you asked for.
        </p>
      </section>
      <p>
        We use this information to answer you, follow up, and book a time. We keep the record only as long as we need
        it for the conversation and our own books.
      </p>
      <section id="children">
        <h2>Children</h2>
        <p>
          This service is not for children under 13. We do not knowingly collect personal information from anyone
          under 13. The site is for small business owners and other adults. A separate page describes a household
          assistant that a parent can set up. That assistant is not a product for children, and children do not get
          their own account. If you believe we received information from a child under 13, email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will delete it.
        </p>
      </section>
      <section id="analytics">
        <h2>Site measurement</h2>
        <p>
          We use Vercel Web Analytics to count page views, and Vercel Speed Insights to measure how fast pages load.
          We also count clicks on buttons like Call, Text, and Pricing, and where on the page they were. These tools
          do not record a playback of your visit, your screen, or what you type.
        </p>
      </section>
      <section id="email">
        <h2>Email</h2>
        <p>
          Commercial email comes from {CONTACT_EMAIL}. It includes a way to stop further email at{' '}
          <Link href="/unsubscribe">danzus.co/unsubscribe</Link>.
        </p>
      </section>
      <p>
        Reply STOP to opt out of texts. Reply HELP for help. Privacy questions go to{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  )
}
