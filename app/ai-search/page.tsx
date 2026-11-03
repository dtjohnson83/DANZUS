import type { Metadata } from 'next'
import Link from 'next/link'
import { MobileNav } from '../MobileNav'
import { SampleMenu } from '../SampleMenu'
import { SiteFooter } from '../SiteFooter'
import { SiteHeader } from '../SiteHeader'
import { condensed, sans } from '../fonts'
import home from '../home.module.css'
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, SITE_URL } from '../site'
import { CheckForm } from './CheckForm'
import styles from './ai-search.module.css'

const TITLE = 'AI search for local shops | DANZUS'
const DESCRIPTION =
  'ChatGPT, Google AI Overviews, and Perplexity now name a few local shops instead of a list of links. Run a free check of the signals on your site, or call (916) 404-6129.'

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
      'It reads your site and scores only what it could measure: HTTPS, the mobile viewport, title, meta description, H1, LocalBusiness schema, name address and phone, page weight and response time, robots.txt, llms.txt, and a sitemap. It does not invent a rank in ChatGPT or Google.',
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
  'An accurate Google Business Profile',
  'Reviews a customer can read',
  'Pages that say what you do and which towns you serve',
  'The same name, phone, and address everywhere',
  'Structured data, so a tool can read those facts',
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
              className={home.call}
              href={CONTACT_PHONE_TEL}
              data-track="call_click"
              data-track-location="nav"
              data-track-label="Call or text Dan"
              data-track-section="nav"
            >
              Call or text Dan
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
            Plumbing, HVAC, welding, salons, auto, and the shop next door. The tools people ask now answer with a few
            names.
          </p>
        </header>

        <section className={styles.block} aria-labelledby="what-title">
          <h2 id="what-title">What AI search is</h2>
          <p>
            ChatGPT, Google AI Overviews, and Perplexity answer a question in a short reply. Ask who the best plumber
            near you is, and you may get a few shop names. Not a long list of links. The same reply shows up for a
            furnace, a weld, a haircut, or a brake job.
          </p>
        </section>

        <section className={styles.block} aria-labelledby="why-title">
          <h2 id="why-title">Why it matters</h2>
          <p>
            The customer calls one of the names in that reply. If your shop is not named, the call goes somewhere else.
            An outdated site, or a thin Google profile, is easy for these tools to skip.
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

        <section className={styles.block} aria-labelledby="work-title">
          <h2 id="work-title">What DANZUS does</h2>
          <p>Two jobs, priced apart from the assistants.</p>
          <ul>
            <li>A website rebuild, with a clear way to call. Starting at $1,500.</li>
            <li>Google and AI search setup, so the tools can describe you. Starting at $300 a month.</li>
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
          <h2 id="check-title">Free AI search check</h2>
          <p>
            We fetch the site and score the signals we can actually read. You get the score here and a PDF by email.
            Call or text {CONTACT_PHONE_DISPLAY} if you would rather talk it through.
          </p>
          <p>
            <a
              className={styles.primary}
              href={CONTACT_PHONE_TEL}
              data-track="call_click"
              data-track-location="section"
              data-track-label="Call or text about AI search"
              data-track-section="ai-search"
            >
              Call or text {CONTACT_PHONE_DISPLAY}
            </a>
          </p>
          <CheckForm />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
