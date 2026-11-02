import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ContactForm } from './ContactForm'
import { PackageDemo } from './PackageDemo'
import { BrassEmblem } from './BrassEmblem'
import { StoryList } from './StoryList'
import { HeroLoop } from './HeroLoop'
import { MobileNav } from './MobileNav'
import { PhoneMockup } from './PhoneMockup'
import { ResultsCounters } from './ResultsCounters'
import { TRADES } from './sample-sites/trades'
import { PACKAGE_DEMOS, type PackageName } from '@/lib/package-demos'
import { display } from './fonts'
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
    outcome: 'A new inquiry becomes a time on the calendar.',
    tier: 'Fits Growth. One step of it can start on Pilot or Starter.',
    steps: ['Capture the lead', 'Instant reply', 'Qualify', 'Book and remind'],
  },
  {
    name: 'Quote to Cash',
    outcome: 'An estimate becomes money in the account.',
    tier: 'Fits Growth. Follow-up alone is Starter. QuickBooks is Custom.',
    steps: ['Draft the estimate', 'Follow up', 'Send the invoice', 'Chase the payment'],
  },
  {
    name: 'Job Closeout',
    outcome: 'A finished job leaves a review and a referral.',
    tier: 'Fits Growth.',
    steps: ['Completion photos', 'Review request', 'Referral ask'],
  },
  {
    name: 'Back Office',
    outcome: 'The inbox, the bills, and the week land in one place.',
    tier: 'Fits Custom. Inbox triage alone can start on Starter.',
    steps: ['Inbox triage', 'Receipts and bills into the books', 'Weekly summary for the owner'],
  },
  {
    name: 'Customer Service',
    outcome: 'The customer gets an answer, a status, or you.',
    tier: 'FAQ answers fit Starter. Live job or order status is Custom.',
    steps: ['FAQ answers', 'Job or order status', 'Hand off to a person'],
  },
]

const SITE_OFFERINGS = [
  {
    name: 'Website',
    outcome: 'A custom site for one local business. Fast on a phone, and built so the next step is a call or a lead.',
    tier: 'Starting at $1,500.',
    steps: ['Services and the towns you cover', 'A layout that works on a phone', 'Tap to call and a way to send a lead', 'Pages that load quickly'],
  },
  {
    name: 'SEO and AI search',
    outcome: 'So the shop can show up on Google, and so ChatGPT and other AI tools can describe it.',
    tier: 'Starting at $300/mo. Starting with your Google listing is $150/mo.',
    steps: ['Your Google listing', 'Shows up for the towns you serve', 'Tells Google exactly what you do', 'Makes you readable by ChatGPT and other AI tools'],
  },
]

const STEPS = [
  {
    title: 'Free call',
    body: 'You walk through where the leads leak. We pick the first job for the assistant to run.',
  },
  {
    title: 'We set it up',
    body: 'It connects to the calendar, QuickBooks, the CRM, or the texts you already use. You read the replies. A person signs off on anything risky before it reaches a customer.',
  },
  {
    title: 'It runs, with a monthly tune-up',
    body: 'It answers, follows up, and books. Each month we read what it sent and fix what sounds off.',
  },
]

const TIERS = [
  {
    name: 'Pilot',
    who: 'First 3 clients',
    price: '$150/mo',
    setup: 'Starting at $250 setup',
    body: 'Any one package, in exchange for an honest testimonial once it is running. Open to the first three Sacramento-area shops.',
  },
  {
    name: 'Starter',
    who: 'One package',
    price: '$200 to $300/mo',
    setup: 'Starting at $500 setup',
    body: 'One package. A common start is the text-back inside Lead to Booked Job, quote follow-up, or the FAQ answers.',
  },
  {
    name: 'Growth',
    who: 'The front of the shop',
    price: '$400 to $600/mo',
    setup: 'Starting at $1,000 to $1,500 setup',
    body: 'Lead to Booked Job, Quote to Cash, and Job Closeout together. Catch the lead, follow the quote, and close the job.',
  },
  {
    name: 'Custom',
    who: 'Your other software',
    price: '$100 to $150/hr',
    setup: 'Starting at $1,500',
    body: 'Back Office, live job status, and any package that has to write into QuickBooks, a CRM, or another system you already run.',
  },
  {
    name: 'Website',
    who: 'One local business',
    price: 'Starting at $1,500',
    setup: 'A project, not a monthly assistant',
    body: 'A custom site, fast on a phone, with a clear way to call or send a lead.',
  },
  {
    name: 'SEO and AI search',
    who: 'Google and ChatGPT',
    price: 'Starting at $300/mo',
    setup: 'Listing, towns, and pages',
    body: 'Your Google listing, the towns you serve, and pages written so Google and ChatGPT can say what you do.',
  },
  {
    name: 'Google Business Profile',
    who: 'Start with your Google listing',
    price: 'Starting at $150/mo',
    setup: 'Before the full search work',
    body: 'Your Google listing, plus enough that ChatGPT can find the shop, if you are not ready for the full search package.',
  },
]

const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Free call request')}`

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
    <div className={`danzus-home ${styles.page} ${display.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(LOCAL_BUSINESS_JSONLD).replace(/</g, '\\u003c'),
        }}
      />
      <a className={styles.skip} href="#content">
        Skip to content
      </a>
      <header className={styles.header}>
        <div className={styles.shell}>
          <div className={styles.headerInner}>
            <Link className={styles.brand} href="/" aria-label="DANZUS home">
              <img src="/danzus-mark.svg" alt="" width={28} height={28} />
              DANZUS
            </Link>
            <nav className={styles.deskLinks} aria-label="Primary">
              <a href="#uses">What it does</a>
              <a href="#packages">Packages</a>
              <a href="#site">Site & search</a>
              <a href="#how">How it works</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">Questions</a>
              <a href="#about">About</a>
            </nav>
            <a className={styles.call} href={CONTACT_PHONE_TEL}>
              Call or text Dan
            </a>
            <MobileNav />
          </div>
          <nav className={styles.mobLinks} aria-label="Primary">
            <a href="#uses">What it does</a>
            <a href="#packages">Packages</a>
            <a href="#site">Site & search</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">Questions</a>
            <a href="#about">About</a>
          </nav>
        </div>
      </header>

      <main id="content">
        <section className={styles.hero}>
          <div className={`${styles.shell} ${styles.heroGrid}`}>
            <div className={styles.heroTop}>
              <p className={styles.place}>Folsom, California. Sacramento, Roseville, El Dorado Hills, and nearby.</p>
              <p className={styles.booked}>BOOKED.</p>
              <h1>Never miss another lead.</h1>
              <p className={styles.lead}>
                Websites, local search, and AI assistants for small businesses in Sacramento, Folsom, Roseville, and
                El Dorado Hills.
              </p>
              <p className={styles.punch}>You were under a sink. The lead texted the next guy.</p>
            </div>
            <HeroLoop />
            <a className={styles.foldCall} href={CONTACT_PHONE_TEL}>
              Call or text Dan
            </a>
            <PhoneMockup />
            <div className={styles.heroRest}>
              <p className={styles.support}>
                A missed call gets a text back within 60 seconds. The estimate gets a follow-up. The job lands on the
                calendar. You get a flat monthly bill after setup.
              </p>
              <div className={styles.actions}>
                <a className={styles.primary} href={CONTACT_PHONE_TEL}>
                  Call or text Dan
                </a>
                <a className={styles.textLink} href="#pricing">
                  See pricing
                </a>
              </div>
              <p className={styles.phoneLine}>
                <a href={CONTACT_PHONE_TEL}>{CONTACT_PHONE_DISPLAY}</a>
              </p>
              <SmsDisclosure />
              <p className={styles.who}>
                Dan Johnson, Folsom. Lead AI Solutions Engineer. Builds AI agents for enterprise companies. Ex-RAAF.
              </p>
              <a className={styles.linkedin} href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                Dan Johnson on LinkedIn
                <small>linkedin.com/in/danjohnsondata</small>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.section} id="uses" aria-labelledby="uses-heading">
          <div className={`${styles.shell} ${styles.story}`}>
            <div>
              <p className={styles.kicker}>What it does</p>
              <h2 id="uses-heading">While you were on the job.</h2>
              <p className={styles.intro}>The call still gets handled. Here is the order.</p>
              <StoryList>
                <li>
                  <h3>Missed call</h3>
                  <p>You are on the roof, under a sink, or in the chair. The phone rings out.</p>
                </li>
                <li>
                  <h3>Text sent</h3>
                  <p>A text goes out in your shop&apos;s voice, so the lead is not sitting in silence.</p>
                </li>
                <li>
                  <h3>Customer replies</h3>
                  <p>They say what they need. The thread stays on the phone they already use.</p>
                </li>
                <li>
                  <h3>Job booked</h3>
                  <p>A time lands on the calendar, with a reminder before you roll.</p>
                </li>
                <li>
                  <h3>Review requested</h3>
                  <p>When the work is done, a happy customer gets asked for the review.</p>
                </li>
              </StoryList>
            </div>
          </div>
        </section>

        <section className={styles.section} id="packages" aria-labelledby="packages-heading">
          <div className={styles.shell}>
            <p className={styles.kicker}>Workflow packages</p>
            <h2 id="packages-heading">Prebuilt setups, adjusted for your shop.</h2>
            <p className={styles.intro}>
              Proven templates. About 80% is ready-made, and about 20% is written for your shop, so setup is fast. It
              plugs into the calendar, QuickBooks, a CRM, and the texting you already use. A human signs off on
              anything risky before it goes out.
            </p>
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
              <p className={styles.kicker}>Site and search</p>
              <h3>Found before they call.</h3>
              <p className={styles.intro}>
                A site for one shop, and the search work that tells Google and AI tools what that shop does. Priced on
                their own, separate from the assistant packages above.
              </p>
            </div>
            <div className={styles.packages}>
              {SITE_OFFERINGS.map((item) => (
                <article className={styles.package} key={item.name}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.outcome}</p>
                    <p className={styles.fit}>{item.tier}</p>
                  </div>
                  <Flow steps={item.steps} />
                </article>
              ))}
            </div>
            <div className={styles.showcase} id="showcase">
              <p className={styles.kicker}>Samples</p>
              <h2>See it for your business</h2>
              <p className={styles.intro}>
                Four sample sites. Not real shops. Every call button rings DANZUS.
              </p>
              <div className={styles.cards}>
                {TRADES.map((trade) => (
                  <a className={styles.card} href={trade.path} key={trade.id}>
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
            </div>
          </div>
        </section>

        <section className={styles.section} id="how" aria-labelledby="how-heading">
          <div className={styles.shell}>
            <p className={styles.kicker}>How it works</p>
            <h2 id="how-heading">Three steps, then it runs.</h2>
            <div className={styles.howList}>
              {STEPS.map((step, index) => (
                <article className={styles.how} key={step.title}>
                  <span className={styles.num}>{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <ResultsCounters />
        <section className={styles.section} id="pricing" aria-labelledby="pricing-heading">
          <div className={styles.shell}>
            <p className={styles.kicker}>Pricing</p>
            <h2 id="pricing-heading">Starting prices.</h2>
            <p className={styles.intro}>
              Every number here is a starting range. The free call turns it into a fixed quote for your shop. A website
              is a project. Search and the assistants are monthly.
            </p>
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
            <p className={styles.priceNote}>
              Pilot and Starter each cover one assistant package. Growth runs Lead to Booked Job, Quote to Cash, and Job
              Closeout together. Custom covers Back Office, live status, and connections into tools you already use. A
              website starts at $1,500. SEO and AI search starts at $300 a month, or $150 a month to start with your
              Google listing.
            </p>
          </div>
        </section>

        <section className={styles.section} id="faq" aria-labelledby="faq-heading">
          <div className={styles.shell}>
            <p className={styles.kicker}>Questions</p>
            <h2 id="faq-heading">Before the free call.</h2>
            <div className={styles.faq}>
              {FAQS.map((item) => (
                <article key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} id="about" aria-labelledby="about-heading">
          <div className={`${styles.shell} ${styles.about}`}>
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
              <p className={styles.kicker}>About</p>
              <h2 id="about-heading">Dan Johnson, in Folsom.</h2>
              <div className={styles.bio}>
                <p>
                  He lives here and sets this up for contractors, trades, and local services in Sacramento, Folsom,
                  Roseville, El Dorado Hills, and nearby.
                </p>
                <p>
                  He is a Lead AI Solutions Engineer. He builds AI agents for enterprise companies.
                  Before that, he served in the Royal Australian Air Force.
                </p>
                <p>
                  The work on this page is that same standard of care, scoped for a shop. Assistants and search are a flat
                  monthly price. A website is a project. The company is DANZUS Holdings LLC.
                </p>
                <a className={styles.linkedin} href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                  Dan Johnson on LinkedIn
                  <small>linkedin.com/in/danjohnsondata</small>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.contact} id="contact" aria-labelledby="contact-heading">
          <div className={`${styles.shell} ${styles.contactGrid}`}>
            <div>
              <p className={styles.kicker}>Contact</p>
              <h2 id="contact-heading">Call or text Dan.</h2>
              <a className={styles.contactNumber} href={CONTACT_PHONE_TEL}>
                {CONTACT_PHONE_DISPLAY}
              </a>
              <SmsDisclosure />
              <p className={styles.intro}>
                Tell him which lead keeps getting away. The form books a time by email. Your number on the form is
                optional.
              </p>
              <a className={styles.contactMail} href={mailto}>
                {CONTACT_EMAIL}
              </a>
            </div>
            <ContactForm />
          </div>
        </section>

        <section className={styles.products} id="products" aria-labelledby="products-heading">
          <div className={styles.shell}>
            <p className={styles.kicker}>Products</p>
            <h2 id="products-heading">Other work from DANZUS.</h2>
            <p className={styles.intro}>
              DimeVision and Agent Audit Trail are separate products. They show the kind of software behind the
              assistant.
            </p>
            <a className={styles.product} href="https://dimevision.app" target="_blank" rel="noopener noreferrer">
              <strong>DimeVision</strong>
              <p>A free AI welding coach for students and apprentices, including BeadBuilder.</p>
              <span>dimevision.app</span>
            </a>
            <a className={styles.product} href="https://aiagentaudit.dev" target="_blank" rel="noopener noreferrer">
              <strong>Agent Audit Trail</strong>
              <p>Logs and policy checks for AI agents that need a record of what they did.</p>
              <span>aiagentaudit.dev</span>
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
