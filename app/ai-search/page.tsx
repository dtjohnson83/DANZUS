import type { Metadata } from 'next'
import Link from 'next/link'
import { MobileNav } from '../MobileNav'
import { SampleMenu } from '../SampleMenu'
import { SiteFooter } from '../SiteFooter'
import { SiteHeader } from '../SiteHeader'
import { condensed, sans } from '../fonts'
import home from '../home.module.css'
import { CHECKS, READINESS_NOTE } from '@/lib/ai-check/copy'
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, SITE_URL } from '../site'
import { CheckForm } from './CheckForm'
import styles from './ai-search.module.css'

const TITLE = 'AI search for local shops | DANZUS'
const DESCRIPTION =
  'When people ask ChatGPT or Google for a local shop, a few names get the call. See how ready your website is, or call (916) 404-6129.'

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
      'Not always. Sometimes the Google profile, the towns you serve, and a few clear pages are the first fix. A rebuild is for a site that is slow or hard to use on a phone.',
  },
] as const

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
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
            <nav className={home.deskLinks} aria-label="Primary">
              <a href="/#services" data-track="nav_click" data-track-label="Services" data-track-location="desktop">
                Services
              </a>
              <a href="/#pricing" data-track="nav_click" data-track-label="Pricing" data-track-location="desktop">
                Pricing
              </a>
              <a
                href="/ai-search"
                aria-current="page"
                data-track="nav_click"
                data-track-label="AI search"
                data-track-location="desktop"
              >
                AI search
              </a>
              <SampleMenu />
              <a href="/#about" data-track="nav_click" data-track-label="About" data-track-location="desktop">
                About
              </a>
            </nav>
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
          <p>Two ways to help, priced apart from the assistants.</p>
          <ul>
            <li>A website rebuild, with a clear way to call. Starting at $1,500.</li>
            <li>Google and AI search setup, so these tools can describe you. Starting at $300 a month.</li>
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
