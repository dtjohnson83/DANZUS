import type { Metadata } from 'next'
import Link from 'next/link'
import { MobileNav } from '../MobileNav'
import { PrimaryNav } from '../PrimaryNav'
import { SiteFooter } from '../SiteFooter'
import { SiteHeader } from '../SiteHeader'
import { condensed, sans } from '../fonts'
import home from '../home.module.css'
import { CheckoutGroup, payGroup } from '../pay-choices'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_SMS,
  CONTACT_PHONE_TEL,
  MAILING_ADDRESS_LINE,
  SITE_URL,
} from '../site'
import { AI_HELP_DESCRIPTION, AI_HELP_FAQS, AI_HELP_PATH, AI_HELP_TITLE, aiHelpPageJsonLd } from '@/lib/site-schema'
import styles from './ai-help.module.css'

const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('AI help for my shop')}`

export const metadata: Metadata = {
  title: { absolute: AI_HELP_TITLE },
  description: AI_HELP_DESCRIPTION,
  keywords: [
    'AI help for small businesses',
    'small business AI help',
    'AI help for small businesses Sacramento',
    'AI help for small businesses Folsom',
    'small business AI help Roseville',
    'small business AI help El Dorado Hills',
    'missed call text back',
    'DANZUS',
  ],
  alternates: { canonical: AI_HELP_PATH },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${SITE_URL}${AI_HELP_PATH}`,
    siteName: 'DANZUS',
    title: AI_HELP_TITLE,
    description: AI_HELP_DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DANZUS Holdings LLC' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: AI_HELP_TITLE,
    description: AI_HELP_DESCRIPTION,
    images: ['/og-image.png'],
  },
}

const OFFERS = [
  {
    id: 'text-back',
    title: 'Missed-call text-back',
    body: 'A text goes back when a call is missed. It uses your shop voice, on the phone the customer already has.',
    price:
      '$99 a month after a free 30-day pilot. No setup fee. Month to month. That is the founding client price.',
    groupId: 'textback-pricing',
  },
  {
    id: 'website',
    title: 'A website',
    body: 'A website built so the next step is a call or a lead. It is fast on a phone. You keep the site.',
    price: '$1,500 one time, plus $49 a month for hosting and small edits. Paid 50% up front and 50% at launch.',
    groupId: 'website-pricing',
  },
  {
    id: 'search',
    title: 'Google and AI search',
    body: 'Google and AI search, so Google and ChatGPT can describe the shop. Your listing, the towns you serve, pages those tools can read, and a ChatGPT business profile claimed and kept up to date where ChatGPT supports your type of business.',
    price: '$199 a month.',
    groupId: 'search-pricing',
  },
  {
    id: 'growth',
    title: 'DANZUS Growth',
    body: 'Text-back, Google and AI search, and hosting, on one plan.',
    price:
      '$299 a month. The website is $750 with a 6-month commitment. If you cancel before month 6, the website is $1,500 and we bill the other $750.',
    groupId: 'growth-pricing',
  },
] as const

export default function SmallBusinessAiHelpPage() {
  const jsonLd = aiHelpPageJsonLd()
  return (
    <div className={`${home.page} ${styles.page} ${condensed.variable} ${sans.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <a className={home.skip} href="#content">
        Skip to content
      </a>
      <SiteHeader solid>
        <div className={home.shell}>
          <div className={home.headerInner}>
            <Link className={home.brand} href="/" aria-label="DANZUS home">
              <img src="/danzus-mark.svg" alt="" width={28} height={28} />
              DANZUS
            </Link>
            <PrimaryNav home="/" current="ai-help" />
            <a
              className={`${home.call} ${styles.navCall}`}
              href={CONTACT_PHONE_TEL}
              data-track="call_click"
              data-track-location="nav"
              data-track-label={`Call ${CONTACT_PHONE_DISPLAY}`}
              data-track-section="nav"
            >
              Call {CONTACT_PHONE_DISPLAY}
            </a>
            <MobileNav home="/" />
          </div>
        </div>
      </SiteHeader>

      <main id="content" className={styles.main}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Sacramento, Folsom, Roseville, El Dorado Hills</p>
          <h1>AI help for small businesses in Sacramento and Folsom</h1>
          <p className={styles.lede}>
            DANZUS provides AI help for small businesses in Sacramento, Folsom, Roseville, and El Dorado Hills. Dan
            Johnson lives and works from Folsom.
          </p>
          <p className={styles.contacts}>
            <a href={CONTACT_PHONE_TEL} data-track="call_click" data-track-location="hero" data-track-section="ai-help">
              Call {CONTACT_PHONE_DISPLAY}
            </a>
            <a href={CONTACT_PHONE_SMS} data-track="text_click" data-track-location="hero" data-track-section="ai-help">
              Text {CONTACT_PHONE_DISPLAY}
            </a>
            <a href={mailto} data-track="cta_click" data-track-label={CONTACT_EMAIL} data-track-section="ai-help">
              {CONTACT_EMAIL}
            </a>
          </p>
        </header>

        <section className={styles.block} aria-labelledby="help-title">
          <h2 id="help-title">What the help is</h2>
          <p>Three jobs cover a local shop. Start with one, or take them together.</p>
        </section>

        {OFFERS.map((offer) => (
          <section className={styles.block} id={offer.id} key={offer.id} aria-labelledby={`${offer.id}-title`}>
            <h2 id={`${offer.id}-title`}>{offer.title}</h2>
            <p>{offer.body}</p>
            <p>{offer.price}</p>
            <CheckoutGroup {...payGroup(offer.groupId)} />
          </section>
        ))}

        <section className={styles.block} id="area" aria-labelledby="area-title">
          <h2 id="area-title">Where we work</h2>
          <p>Sacramento, Folsom, Roseville, El Dorado Hills, and nearby.</p>
          <p>Dan Johnson is in Folsom. Call or text {CONTACT_PHONE_DISPLAY}. Email {CONTACT_EMAIL}.</p>
          <p>
            Mail for DANZUS Holdings LLC goes to {MAILING_ADDRESS_LINE}. That address is for mail. It is not a shop to visit.
          </p>
        </section>

        <section className={styles.block} id="start" aria-labelledby="start-title">
          <h2 id="start-title">How to start</h2>
          <p>Call or text {CONTACT_PHONE_DISPLAY}, email {CONTACT_EMAIL}, or use a button above.</p>
          <p>
            Monthly plans renew each month until you cancel. Cancel at <Link href="/cancel">danzus.co/cancel</Link>.
          </p>
          <p>
            To see if Google and ChatGPT can already describe your shop, use the free check on the{' '}
            <Link href="/ai-search">AI search</Link> page.
          </p>
        </section>

        <section className={styles.faq} id="faq" aria-labelledby="faq-title">
          <h2 id="faq-title">Questions</h2>
          <div>
            {AI_HELP_FAQS.map((item) => (
              <article key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
