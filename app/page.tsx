import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ContactForm } from './ContactForm'
import { PackageDemo } from './PackageDemo'
import { HeroLoop } from './HeroLoop'
import { MobileNav } from './MobileNav'
import { PhoneMockup } from './PhoneMockup'
import { Reveal } from './Reveal'
import { SiteHeader } from './SiteHeader'
import { TRADES } from './sample-sites/trades'
import { PACKAGE_DEMOS, type PackageName } from '@/lib/package-demos'
import { condensed, sans } from './fonts'
import { SiteFooter } from './SiteFooter'
import { SmsDisclosure } from './SmsDisclosure'
import styles from './home.module.css'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  LINKEDIN_URL,
  PORTRAIT_SRC,
  SITE_URL,
} from './site'
import { FAQS, HOME_DESCRIPTION, HOME_TITLE, siteJsonLd } from '@/lib/site-schema'
import { HERO_LOOP } from './hero-loop'

const TITLE = HOME_TITLE
const DESCRIPTION = HOME_DESCRIPTION

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'AI assistant for small business Sacramento',
    'small business automation Folsom',
    'AI assistant Roseville',
    'AI assistant El Dorado Hills',
    'missed call text back Folsom',
    'contractor lead follow up Sacramento',
    'small business website Sacramento',
    'local SEO Folsom',
    'AI search optimization',
    'DANZUS Holdings LLC',
    'Dan Johnson Folsom',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'DANZUS',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: 'Dan Johnson of DANZUS in Folsom, California' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-home.jpg'],
  },
}

const LOCAL_BUSINESS_JSONLD = siteJsonLd()

const PACKAGES = [
  {
    name: 'Lead to Booked Job',
    outcome: 'A new inquiry becomes a time booked.',
    tier: 'Growth. One step can start smaller.',
    steps: ['Capture the lead', 'Instant reply', 'Qualify', 'Book and remind'],
  },
  {
    name: 'Quote to Cash',
    outcome: 'An estimate becomes money in the account.',
    tier: 'Growth. Follow-up alone is Starter.',
    steps: ['Draft the estimate', 'Follow up', 'Send the invoice', 'Chase the payment'],
  },
  {
    name: 'Job Closeout',
    outcome: 'A finished job leaves a review.',
    tier: 'Fits Growth.',
    steps: ['Completion photos', 'Review request', 'Referral ask'],
  },
  {
    name: 'Back Office',
    outcome: 'Inbox, bills, and the week, together.',
    tier: 'Custom. Inbox triage can start smaller.',
    steps: ['Inbox triage', 'Bills into the books', 'A weekly summary'],
  },
  {
    name: 'Customer Service',
    outcome: 'An answer, a status, or you.',
    tier: 'FAQ answers fit Starter.',
    steps: ['FAQ answers', 'Job or order status', 'Hand off to a person'],
  },
]

const SITE_OFFERINGS = [
  {
    name: 'Website',
    outcome: 'A fast site with a way to call.',
    tier: 'Starting at $1,500.',
    steps: ['Services and towns', 'Works on a phone', 'Tap to call', 'Pages that load quickly'],
  },
  {
    name: 'SEO and AI search',
    outcome: 'Google and chat tools can describe you.',
    tier: 'From $300/mo. Listing starts at $150/mo.',
    steps: ['Your Google listing', 'The towns you serve', 'What you do, stated plainly', 'Readable by chat tools'],
  },
]

const TIERS = [
  {
    name: 'Pilot',
    who: 'First 3 clients',
    price: '$150/mo',
    setup: 'Starting at $250 setup',
    body: 'One package, for a testimonial, first three shops.',
  },
  {
    name: 'Starter',
    who: 'One package',
    price: '$200 to $300/mo',
    setup: 'Starting at $500 setup',
    body: 'Text-back, quote follow-up, or the FAQ answers.',
  },
  {
    name: 'Growth',
    who: 'The front of the shop',
    price: '$400 to $600/mo',
    setup: 'Starting at $1,000 to $1,500 setup',
    body: 'Book the lead, follow the quote, close the job.',
  },
  {
    name: 'Custom',
    who: 'Your other software',
    price: '$100 to $150/hr',
    setup: 'Starting at $1,500',
    body: 'Back office, live status, and tools you already run.',
  },
  {
    name: 'Website',
    who: 'One local business',
    price: 'Starting at $1,500',
    setup: 'A project, not a monthly assistant',
    body: 'A custom site with a clear way to call.',
  },
  {
    name: 'SEO and AI search',
    who: 'Google and ChatGPT',
    price: 'Starting at $300/mo',
    setup: 'Listing, towns, and pages',
    body: 'Your listing, your towns, and pages tools can read.',
  },
  {
    name: 'Google Business Profile',
    who: 'Start with your Google listing',
    price: 'Starting at $150/mo',
    setup: 'Before the full search work',
    body: 'Your Google listing, before the full search work.',
  },
]

const SHORT_ANSWERS = [
  'Starting ranges. The free call sets a fixed quote.',
  'A ready template first, then words for your shop.',
  'No. It uses the tools you already run.',
  'You read replies. Risky ones wait for a person.',
  'A person signs off before a reply goes out.',
  'Dan is in Folsom. Call or text that number.',
]

const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Free call request')}`

function Ghost({
  href,
  children,
  section,
  location,
}: {
  href: string
  children: string
  section: string
  location?: string
}) {
  const track = href.startsWith('tel:') ? 'call_click' : href.startsWith('sms:') ? 'text_click' : 'cta_click'
  return (
    <a
      className={styles.ghost}
      href={href}
      data-track={track}
      data-track-label={children}
      data-track-section={section}
      {...(track === 'cta_click' ? {} : { 'data-track-location': location || section })}
    >
      {children}
      <span aria-hidden="true">→</span>
    </a>
  )
}

function Flow({ steps }: { steps: string[] }) {
  return (
    <ol className={styles.flow} aria-label="Steps">
      {steps.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
  )
}

export default function Home() {
  return (
    <div className={`danzus-home ${styles.page} ${condensed.variable} ${sans.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(LOCAL_BUSINESS_JSONLD).replace(/</g, '\\u003c'),
        }}
      />
      <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js")' }} />
      <link
        rel="preload"
        as="image"
        href={HERO_LOOP.mobile.poster}
        media="(max-width: 767px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={HERO_LOOP.desktop.poster}
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      <a className={styles.skip} href="#content">
        Skip to content
      </a>
      <SiteHeader>
        <div className={styles.shell}>
          <div className={styles.headerInner}>
            <Link className={styles.brand} href="/" aria-label="DANZUS home">
              <img src="/danzus-mark.svg" alt="" width={28} height={28} />
              DANZUS
            </Link>
            <nav className={styles.deskLinks} aria-label="Primary">
              <a href="#services" data-track="nav_click" data-track-label="Services" data-track-location="desktop">
                Services
              </a>
              <a href="#pricing" data-track="nav_click" data-track-label="Pricing" data-track-location="desktop">
                Pricing
              </a>
              <a href="#work" data-track="nav_click" data-track-label="Work" data-track-location="desktop">
                Work
              </a>
              <a href="#about" data-track="nav_click" data-track-label="About" data-track-location="desktop">
                About
              </a>
            </nav>
            <a
              className={styles.call}
              href={CONTACT_PHONE_TEL}
              data-track="call_click"
              data-track-location="nav"
              data-track-label="Call or text Dan"
              data-track-section="nav"
            >
              Call or text Dan
            </a>
            <MobileNav />
          </div>
        </div>
      </SiteHeader>

      <main id="content">
        <section className={styles.hero}>
          <HeroLoop />
          <div className={styles.heroShade} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <p className={styles.label}>For your shop</p>
            <h1>Never miss another lead.</h1>
            <p className={styles.line}>You were under a sink. The lead texted the next guy.</p>
            <Ghost href={CONTACT_PHONE_TEL} section="hero" location="hero">
              Call or text Dan
            </Ghost>
          </div>
        </section>

        <section className={styles.scene} id="services" aria-labelledby="services-title">
          <Reveal>
            <p className={styles.label}>Missed call</p>
            <h2 id="services-title">The phone rings out.</h2>
            <p className={styles.line}>You are on the job. The lead does not wait.</p>
            <Ghost href="#reply" section="services">
              See the text
            </Ghost>
          </Reveal>
        </section>

        <section className={styles.scene} id="reply" aria-labelledby="reply-title">
          <Reveal>
            <p className={styles.label}>Sixty seconds</p>
            <h2 id="reply-title">A text goes back.</h2>
            <p className={styles.line}>Your shop&apos;s voice, on the phone they already use.</p>
            <div className={styles.phoneStage}>
              <PhoneMockup />
            </div>
            <Ghost href="#booked" section="reply">
              See the booking
            </Ghost>
          </Reveal>
        </section>

        <section className={styles.scene} id="booked" aria-labelledby="booked-title">
          <Reveal>
            <p className={styles.label}>Booked job</p>
            <h2 id="booked-title">A time lands.</h2>
            <p className={styles.line}>The job is on the calendar before you roll.</p>
            <Ghost href="#work" section="booked">
              See the work
            </Ghost>
          </Reveal>
        </section>

        <section className={styles.scene} id="work" aria-labelledby="work-title">
          <Reveal>
            <p className={styles.label}>Sample sites</p>
            <h2 id="work-title">See it for your shop.</h2>
            <p className={styles.line}>Four samples. Not real shops. Calls ring DANZUS.</p>
            <div className={styles.cards}>
              {TRADES.map((trade) => (
                <a
                  className={styles.card}
                  href={trade.path}
                  key={trade.id}
                  data-track="sample_open"
                  data-track-slug={trade.id}
                >
                  <span className={styles.preview}>
                    <Image
                      src={`/samples/${trade.id}.webp`}
                      alt=""
                      width={800}
                      height={524}
                      sizes="(min-width: 720px) 480px, 100vw"
                      loading="lazy"
                    />
                  </span>
                  <strong>{trade.name}</strong>
                  <span>{trade.trade}</span>
                </a>
              ))}
            </div>
            <Ghost href="#pricing" section="work">
              See pricing
            </Ghost>
          </Reveal>
        </section>

        <section className={styles.stack} id="packages" aria-labelledby="packages-title">
          <Reveal>
            <p className={styles.label}>Packages</p>
            <h2 id="packages-title">One shop. A few jobs.</h2>
            <p className={styles.line}>Most of it is ready. The rest is written for you.</p>
            <div className={styles.packages}>
              {PACKAGES.map((item) => (
                <article className={styles.package} key={item.name}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.outcome}</p>
                    <p className={styles.fit}>{item.tier}</p>
                    <Flow steps={item.steps} />
                  </div>
                  <PackageDemo slug={PACKAGE_DEMOS[item.name as PackageName]} title={item.name} />
                </article>
              ))}
            </div>
            <div className={styles.offerHead} id="site">
              <p className={styles.label}>Site and search</p>
              <h3>Found before they call.</h3>
              <p className={styles.line}>A site, and search, priced apart from the assistant.</p>
            </div>
            <div className={styles.packages}>
              {SITE_OFFERINGS.map((item) => (
                <article className={styles.package} key={item.name}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.outcome}</p>
                    <p className={styles.fit}>{item.tier}</p>
                    <Flow steps={item.steps} />
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section className={styles.scene} id="pricing" aria-labelledby="pricing-title">
          <Reveal>
            <p className={styles.label}>Pricing</p>
            <h2 id="pricing-title">Starting prices.</h2>
            <p className={styles.line}>Ranges first. The free call sets the quote.</p>
            <div className={styles.rates}>
              {TIERS.map((tier) => (
                <article className={styles.rate} key={tier.name}>
                  <div>
                    <h3 className={styles.rateName}>{tier.name}</h3>
                    <p>{tier.who}</p>
                  </div>
                  <p>{tier.body}</p>
                  <div>
                    <p className={styles.ratePrice}>{tier.price}</p>
                    <p className={styles.rateSetup}>{tier.setup}</p>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section className={styles.stack} id="faq" aria-labelledby="faq-title">
          <Reveal>
            <p className={styles.label}>Questions</p>
            <h2 id="faq-title">Before the call.</h2>
            <div className={styles.faq}>
              {FAQS.map((item, index) => (
                <article key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{SHORT_ANSWERS[index]}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section className={styles.scene} id="about" aria-labelledby="about-title">
          <Reveal>
            <div className={styles.about}>
              <figure>
                {PORTRAIT_SRC ? (
                  <div className={styles.frame}>
                    <Image
                      src={PORTRAIT_SRC}
                      alt="Dan Johnson, Folsom, California"
                      fill
                      sizes="280px"
                      quality={85}
                      className={styles.portrait}
                    />
                  </div>
                ) : (
                  <div className={styles.frame} role="img" aria-label="Portrait placeholder for Dan Johnson">
                    <span className={styles.monogram}>DJ</span>
                    <small>Photograph coming</small>
                  </div>
                )}
                <figcaption className={styles.caption}>
                  Dan Johnson
                  <span>Folsom, California</span>
                </figcaption>
              </figure>
              <div>
                <p className={styles.label}>About</p>
                <h2 id="about-title">Dan Johnson, Folsom.</h2>
                <div className={styles.bio}>
                  <p>He lives in Folsom and sets this up for local shops.</p>
                  <p>Sacramento, Roseville, and El Dorado Hills are in range.</p>
                  <p>Lead AI Solutions Engineer. Enterprise agents. Ex-RAAF.</p>
                  <p>The company is DANZUS Holdings LLC.</p>
                  <a
                    className={styles.linkedin}
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="outbound_click"
                    data-track-label="LinkedIn"
                  >
                    Dan Johnson on LinkedIn
                    <small>linkedin.com/in/danjohnsondata</small>
                  </a>
                </div>
                <p className={styles.phoneLine}>
                  <a href={CONTACT_PHONE_TEL} data-track="call_click" data-track-location="section">
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </p>
                <SmsDisclosure />
                <a
                  className={styles.solid}
                  href={CONTACT_PHONE_TEL}
                  data-track="call_click"
                  data-track-location="section"
                  data-track-label="Call or text Dan"
                  data-track-section="about"
                >
                  Call or text Dan
                  <span aria-hidden="true">→</span>
                </a>
                <p className={styles.line}>Or send a note. A number on the form is optional.</p>
                <a className={styles.contactMail} href={mailto}>
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
            <ContactForm />
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
