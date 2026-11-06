import type { Metadata } from 'next'
import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ContactForm } from './ContactForm'
import { PackageDemo } from './PackageDemo'
import { HeroLoop } from './HeroLoop'
import { MobileNav } from './MobileNav'
import { PhoneMockup } from './PhoneMockup'
import { Reveal } from './Reveal'
import { SiteHeader } from './SiteHeader'
import { SampleMenu } from './SampleMenu'
import { PACKAGE_DEMOS, type PackageName } from '@/lib/package-demos'
import { condensed, sans } from './fonts'
import { SiteFooter } from './SiteFooter'
import { SmsDisclosure } from './SmsDisclosure'
import styles from './home.module.css'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_SMS,
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
    tier: 'A text, then a time on the calendar.',
    steps: ['Capture the lead', 'Instant reply', 'Ask the right questions', 'Book and remind'],
  },
  {
    name: 'Estimate to payment',
    outcome: 'An estimate becomes money in the account.',
    tier: 'Follow-up after the estimate.',
    steps: ['Draft the estimate', 'Follow up', 'Send the invoice', 'Chase the payment'],
  },
  {
    name: 'Job Closeout',
    outcome: 'A finished job leaves a review.',
    tier: 'A review after the job is done.',
    steps: ['Completion photos', 'Review request', 'Referral ask'],
  },
  {
    name: 'Back Office',
    outcome: 'Inbox, bills, and the week, together.',
    tier: 'Inbox, bills, and the week.',
    steps: ['Sort your email', 'Enter bills into your bookkeeping', 'A weekly summary'],
  },
  {
    name: 'Customer Service',
    outcome: 'An answer, a status, or you.',
    tier: 'An answer, a status, or you.',
    steps: ['FAQ answers', 'Job or order status', 'Hand off to a person'],
  },
]

type CheckoutLink = {
  href: string
  label: string
  tone?: 'ghost'
}

/** Live Stripe payment links. Each checkout already asks for terms-of-service consent. */
const CHECKOUT = {
  textBack: {
    href: 'https://buy.stripe.com/28EaEWfuUfvmefRfZe8Ra02',
    label: 'Start missed-call text-back',
  },
  website: {
    href: 'https://buy.stripe.com/00w00i2I81Ewc7J3cs8Ra03',
    label: 'Pay the website deposit',
  },
  search: {
    href: 'https://buy.stripe.com/3cIcN46Yo1Ew6Np3cs8Ra04',
    label: 'Start Google + AI search',
  },
  growth: {
    href: 'https://buy.stripe.com/9B64gy6Yogzq7RtbIY8Ra05',
    label: 'Start Growth month to month',
  },
  growthWebsite: {
    href: 'https://buy.stripe.com/3cIcN4gyY5UMfjV9AQ8Ra06',
    label: 'Start the 6-month plan and pay the website deposit',
    tone: 'ghost',
  },
} as const satisfies Record<string, CheckoutLink>

const SITE_OFFERINGS: Array<{
  name: string
  outcome: string
  tier: string
  renewal: string
  steps: string[]
  checkout: CheckoutLink[]
  chooseOne?: boolean
}> = [
  {
    name: 'Website',
    outcome: 'A fast site with a way to call. You keep it.',
    tier: '$1,500 plus $49/mo hosting and small edits.',
    renewal: 'Renews monthly at $49 until you cancel. Cancel any time online, by email, or by phone.',
    steps: ['Services and towns', 'Works on a phone', 'Tap to call', 'Pages that load quickly'],
    checkout: [CHECKOUT.website],
  },
  {
    name: 'Google + AI search',
    outcome: 'Google and chat tools can describe you.',
    tier: '$199/mo.',
    renewal: 'Renews monthly at $199 until you cancel. Cancel any time online, by email, or by phone.',
    steps: ['Your Google listing', 'The towns you serve', 'What you do, stated plainly', 'Easy for ChatGPT to read'],
    checkout: [CHECKOUT.search],
  },
  {
    name: 'DANZUS Growth',
    outcome: 'Text-back, Google and AI search, and hosting.',
    tier: '$299/mo. Website is $750 with a 6-month commitment.',
    renewal:
      'Renews monthly at $299 until you cancel. Cancel any time online, by email, or by phone. After month 6 it continues month to month at $299 until cancelled. If you cancel before month 6, the website is $1,500 and we bill the other $750.',
    steps: ['Missed-call text-back', 'Google and AI search', 'Hosting and small edits'],
    checkout: [CHECKOUT.growth, CHECKOUT.growthWebsite],
    chooseOne: true,
  },
]

const TIERS: Array<{
  name: string
  who: string
  price: string
  setup: string
  renewal: string
  body: string
  checkout: CheckoutLink[]
  chooseOne?: boolean
}> = [
  {
    name: 'Missed-call text-back',
    who: 'Founding client price. Month to month.',
    price: '$99/mo',
    setup: 'Free 30-day pilot. No setup fee.',
    renewal: 'Renews monthly at $99 until you cancel. Cancel any time online, by email, or by phone.',
    body: 'A text goes back when you miss a call.',
    checkout: [CHECKOUT.textBack],
  },
  {
    name: 'Website',
    who: 'You keep the site.',
    price: '$1,500',
    setup: 'Plus $49/mo hosting and small edits.',
    renewal: 'Renews monthly at $49 until you cancel. Cancel any time online, by email, or by phone.',
    body: 'Paid 50% up front and 50% at launch.',
    checkout: [CHECKOUT.website],
  },
  {
    name: 'Google + AI search',
    who: 'Google and chat tools.',
    price: '$199/mo',
    setup: 'Your Google listing, your towns, and clear pages.',
    renewal: 'Renews monthly at $199 until you cancel. Cancel any time online, by email, or by phone.',
    body: 'So Google and AI answers can describe your shop.',
    checkout: [CHECKOUT.search],
  },
  {
    name: 'DANZUS Growth',
    who: 'Text-back, search, and hosting.',
    price: '$299/mo',
    setup: 'Website is $750 with a 6-month commitment.',
    renewal:
      'Renews monthly at $299 until you cancel. Cancel any time online, by email, or by phone. After month 6 it continues month to month at $299 until cancelled. If you cancel before month 6, the website is $1,500 and we bill the other $750.',
    body: 'Missed-call text-back, Google and AI search, and hosting.',
    checkout: [CHECKOUT.growth, CHECKOUT.growthWebsite],
    chooseOne: true,
  },
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

function CheckoutLinks({
  links,
  section,
  choice = false,
}: {
  links: readonly CheckoutLink[]
  section: string
  choice?: boolean
}) {
  return (
    <div className={styles.pay}>
      {choice ? <p className={styles.payChoice}>Choose one way to start.</p> : null}
      {links.map((link, index) => (
        <Fragment key={link.href}>
          {choice && index > 0 ? <p className={styles.payOr}>or</p> : null}
          <a
            className={link.tone === 'ghost' ? styles.ghost : styles.solid}
            href={link.href}
            data-track="cta_click"
            data-track-label={link.label}
            data-track-section={section}
          >
            {link.label}
            <span aria-hidden="true">→</span>
          </a>
        </Fragment>
      ))}
    </div>
  )
}

function ContactChoices({ section }: { section: string }) {
  return (
    <div className={styles.pay}>
      <a
        className={styles.ghost}
        href={CONTACT_PHONE_TEL}
        data-track="call_click"
        data-track-location={section}
        data-track-label={`Call ${CONTACT_PHONE_DISPLAY}`}
        data-track-section={section}
      >
        Call {CONTACT_PHONE_DISPLAY}
        <span aria-hidden="true">→</span>
      </a>
      <a
        className={styles.ghost}
        href={CONTACT_PHONE_SMS}
        data-track="text_click"
        data-track-location={section}
        data-track-label={`Text ${CONTACT_PHONE_DISPLAY}`}
        data-track-section={section}
      >
        Text {CONTACT_PHONE_DISPLAY}
        <span aria-hidden="true">→</span>
      </a>
      <a
        className={styles.ghost}
        href={mailto}
        data-track="cta_click"
        data-track-label={CONTACT_EMAIL}
        data-track-section={section}
      >
        {CONTACT_EMAIL}
        <span aria-hidden="true">→</span>
      </a>
    </div>
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
              <a href="/ai-search" data-track="nav_click" data-track-label="AI search" data-track-location="desktop">
                AI search
              </a>
              <SampleMenu />
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
            <Ghost href="#packages" section="booked">
              See the packages
            </Ghost>
          </Reveal>
        </section>

        <section className={styles.stack} id="packages" aria-labelledby="packages-title">
          <Reveal>
            <p className={styles.label}>Packages</p>
            <h2 id="packages-title">One shop. A few jobs.</h2>
            <p className={styles.line}>
              Missed-call text-back is $99 a month after a free 30-day pilot. No setup fee. Month to month. That is
              the founding client price.
            </p>
            <CheckoutLinks links={[CHECKOUT.textBack]} section="packages" />
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
              <p className={styles.line}>A site and search, on the same menu.</p>
            </div>
            <div className={styles.packages}>
              {SITE_OFFERINGS.map((item) => (
                <article className={styles.package} key={item.name}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.outcome}</p>
                    <p className={styles.fit}>{item.tier}</p>
                    <p className={styles.rateRenew}>{item.renewal}</p>
                    <Flow steps={item.steps} />
                    <CheckoutLinks links={item.checkout} section="packages" choice={item.chooseOne} />
                  </div>
                </article>
              ))}
            </div>
            <ContactChoices section="packages" />
          </Reveal>
        </section>

        <section className={styles.scene} id="pricing" aria-labelledby="pricing-title">
          <Reveal>
            <p className={styles.label}>Pricing</p>
            <h2 id="pricing-title">Simple prices.</h2>
            <p className={styles.line}>Monthly plans renew until you cancel.</p>
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
                  <p className={styles.rateRenew}>{tier.renewal}</p>
                  <CheckoutLinks links={tier.checkout} section="pricing" choice={tier.chooseOne} />
                </article>
              ))}
            </div>
            <ContactChoices section="pricing" />
            <p className={styles.priceNote}>
              Monthly plans renew each month until you cancel. Cancel any time on the{' '}
              <Link href="/cancel">cancel page</Link>, by email, or by phone. The $1,500 website is paid once.
            </p>
          </Reveal>
        </section>

        <section className={styles.stack} id="faq" aria-labelledby="faq-title">
          <Reveal>
            <p className={styles.label}>Questions</p>
            <h2 id="faq-title">Before the call.</h2>
            <div className={styles.faq}>
              {FAQS.map((item) => (
                <article key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
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
                  <p>Builds AI tools for large companies. Former Royal Australian Air Force.</p>
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
                <p className={styles.priceNote}>
                  Monthly plans renew each month until you cancel: $99, $49, $199, or $299, as listed above. Cancel
                  online at <Link href="/cancel">danzus.co/cancel</Link>.
                </p>
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
