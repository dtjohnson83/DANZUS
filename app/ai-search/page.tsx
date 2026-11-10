import type { Metadata } from 'next'
import Link from 'next/link'
import { MobileNav } from '../MobileNav'
import { PrimaryNav } from '../PrimaryNav'
import { SiteFooter } from '../SiteFooter'
import { SiteHeader } from '../SiteHeader'
import { condensed, sans } from '../fonts'
import home from '../home.module.css'
import { CHECKS, READINESS_NOTE } from '@/lib/ai-check/copy'
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, SITE_URL } from '../site'
import { CheckForm } from './CheckForm'
import styles from './ai-search.module.css'

const TITLE = 'AI search for small businesses in Sacramento and Folsom | DANZUS'
const DESCRIPTION =
  'DANZUS provides AI help for small businesses in Sacramento, Folsom, Roseville, and El Dorado Hills. When people ask ChatGPT or Google for a local shop, a few names get the call. Google and AI search is $199 a month. See how ready your website is, or call (916) 404-6129.'

const FAQS = [
  {
    question: 'What is AI search?',
    answer:
      'It is when ChatGPT, Google AI Overviews, or Perplexity answer a question with a few business names, instead of a page of links.',
  },
  {
    question: 'Is this only for plumbers?',
    answer: 'No. The same kind of answer shows up for HVAC, welding, salons, auto shops, and other local trades.',
  },
  {
    question: 'What does the free check measure?',
    answer:
      'It reads the public website and scores only what it could see. You get a plain result, such as Strong, Good, or Needs work, plus the few changes that would help most. This is a readiness check. It is not a ranking in ChatGPT or Google.',
  },
  {
    question: 'Do I need a new website first?',
    answer:
      'Not always. Sometimes the Google profile, a claimed ChatGPT business profile where ChatGPT supports your type of business, the towns you serve, and a few clear pages are the first fix. A rebuild is for a site that is slow or hard to use on a phone.',
  },
  {
    question: 'Do you help small businesses with AI?',
    answer:
      'Yes. DANZUS provides AI help for small businesses in Sacramento, Folsom, Roseville, and El Dorado Hills. The help is missed-call text-back, a website, and Google and AI search. Start at https://danzus.co/small-business-ai-help, or call (916) 404-6129.',
  },
  {
    question: 'What does this cost?',
    answer:
      'Google and AI search is $199 a month. A website is $1,500, plus $49 a month for hosting and small edits. You pay half up front and half at launch, and you keep the site. DANZUS Growth is $299 a month for missed-call text-back, Google and AI search, and hosting. With a 6-month commitment, the website is $750. If you cancel before month 6, the website is $1,500 and we bill the other $750. Missed-call text-back alone is $99 a month after a free 30-day pilot, with no setup fee, month to month. That is the founding client price. Those monthly charges renew each month at the same price until you cancel. Cancel online at https://danzus.co/cancel, email dan@danzus.co, or call (916) 404-6129.',
  },
] as const

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'AI help for small businesses',
    'small business AI help',
    'AI search Sacramento',
    'AI search Folsom',
    'AI search Roseville',
    'AI search El Dorado Hills',
  ],
  alternates: { canonical: '/ai-search' },
  openGraph: {
    type: 'article',
    locale: 'en_US',
    url: `${SITE_URL}/ai-search`,
    siteName: 'DANZUS',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DANZUS Holdings LLC' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/ai-search#webpage`,
      url: `${SITE_URL}/ai-search`,
      name: TITLE,
      description: DESCRIPTION,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#business` },
      inLanguage: 'en-US',
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/ai-search#faq`,
      url: `${SITE_URL}/ai-search`,
      mainEntity: FAQS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
}

const REASONS = [
  'An accurate Google listing, with the right name, phone, and hours',
  'Reviews a customer can read',
  'Pages that say what you do and which towns you serve',
  'The same name, phone, and address everywhere',
  'Business details Google and AI can read, so they recommend you with the right phone and address',
  'A site that loads quickly on a phone',
]

const SIGNS = [
  'The site is slow',
  'It is hard to use on a phone',
  'Services are not listed',
  'The towns you serve are not listed',
  'Reviews are not shown',
]

export default function AiSearchPage() {
  return (
    <div className={`${home.page} ${styles.page} ${condensed.variable} ${sans.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <a className={home.skip} href="#content">
        Skip to content
      </a>
      <SiteHeader>
        <div className={home.shell}>
          <div className={home.headerInner}>
            <Link className={home.brand} href="/" aria-label="DANZUS home">
              <img src="/danzus-mark.svg" alt="" width={28} height={28} />
              DANZUS
            </Link>
            <PrimaryNav home="/" current="ai-search" />
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
          <p className={styles.kicker}>For any local shop</p>
          <h1>If AI does not name you, you do not get the call.</h1>
          <p className={styles.lede}>
            When people ask ChatGPT or Google for a plumber, a welder, or a salon nearby, the answer names a few shops.
            Here's how ready your website is to be one of them.
          </p>
        </header>

        <section className={styles.block} aria-labelledby="what-title">
          <h2 id="what-title">What people see now</h2>
          <p>
            ChatGPT, Google, and Perplexity answer in a short reply. Ask for a plumber near you and you may get a few
            shop names, not a long list of links. The same thing happens for a furnace, a weld, a haircut, or a brake
            job.
          </p>
        </section>

        <section className={styles.block} aria-labelledby="why-title">
          <h2 id="why-title">Why it matters</h2>
          <p>
            The customer calls one of the names in that reply. If your shop is not named, the call goes to someone else.
            An outdated site, or a thin Google listing, is easy for these tools to skip.
          </p>
        </section>

        <section className={styles.block} aria-labelledby="recommend-title">
          <h2 id="recommend-title">What makes a business show up</h2>
          <ul>
            {REASONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.block} aria-labelledby="signs-title">
          <h2 id="signs-title">Signs your site is hurting you</h2>
          <ul className={styles.signs}>
            {SIGNS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.block} aria-labelledby="checks-title">
          <h2 id="checks-title">What the free check looks at</h2>
          <p>Each line is something we can see on the public website, and why it helps the business.</p>
          <ul className={styles.checks}>
            {CHECKS.map((item) => (
              <li key={item.id}>
                <strong>{item.label}</strong>
                <span>{item.benefit}</span>
              </li>
            ))}
          </ul>
          <p>{READINESS_NOTE}</p>
        </section>

        <section className={styles.block} aria-labelledby="work-title">
          <h2 id="work-title">What DANZUS does</h2>
          <p>The same menu as the rest of the site.</p>
          <p>
            DANZUS provides <Link href="/small-business-ai-help">AI help for small businesses</Link> in Sacramento,
            Folsom, Roseville, and El Dorado Hills. That page covers missed-call text-back, a website, and this search
            work.
          </p>
          <ul>
            <li>
              A website, with a clear way to call. $1,500, plus $49 a month for hosting and small edits. Half is due
              up front and half at launch. You keep the site.
            </li>
            <li>Google and AI search, so these tools can describe you. $199 a month.</li>
            <li>
              DANZUS Growth is $299 a month. It includes missed-call text-back, Google and AI search, and hosting. With
              a 6-month commitment, the website is $750. If you cancel before month 6, the website is $1,500 and we bill the other $750.
            </li>
          </ul>
        </section>

        <section className={styles.faq} aria-labelledby="faq-title">
          <h2 id="faq-title">Questions</h2>
          <div>
            {FAQS.map((item) => (
              <article key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.cta} id="check" aria-labelledby="check-title">
          <h2 id="check-title">Free readiness check</h2>
          <p>
            See how ready your website is to be named when someone asks ChatGPT or Google for a shop like yours. You
            get the result here and a short report by email.
          </p>
          <p>Call {CONTACT_PHONE_DISPLAY} if you would rather talk it through.</p>
          <p>
            <a
              className={styles.primary}
              href={CONTACT_PHONE_TEL}
              data-track="call_click"
              data-track-location="section"
              data-track-label={`Call ${CONTACT_PHONE_DISPLAY}`}
              data-track-section="ai-search"
            >
              Call {CONTACT_PHONE_DISPLAY}
            </a>
          </p>
          <CheckForm />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
