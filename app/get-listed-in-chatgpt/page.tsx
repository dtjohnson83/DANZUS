import type { Metadata } from 'next'
import Link from 'next/link'
import { MobileNav } from '../MobileNav'
import { PrimaryNav } from '../PrimaryNav'
import { SiteFooter } from '../SiteFooter'
import { SiteHeader } from '../SiteHeader'
import { condensed, sans } from '../fonts'
import home from '../home.module.css'
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, SITE_URL } from '../site'
import search from '../ai-search/ai-search.module.css'
import styles from './guide.module.css'

export const GUIDE_PATH = '/get-listed-in-chatgpt'

const TITLE = 'How to get a small business listed in ChatGPT | DANZUS'
const DESCRIPTION =
  'Customers now ask ChatGPT who to call. Here is how a small business can claim a ChatGPT profile where that is supported, what to do if it is not yet, and how DANZUS can help. Start with a free AI Search Check, or call (916) 404-6129.'

const FAQS = [
  {
    question: 'Can every business claim a ChatGPT profile today?',
    answer:
      'No. ChatGPT Business Hub currently lets businesses with a physical location or an online store add or claim a profile. The Through a service option, for mobile or service-area businesses, is marked Coming Soon. A plumber, HVAC tech, cleaner, or welder who goes to the customer cannot claim that way yet.',
  },
  {
    question: 'Does claiming a profile mean ChatGPT will name my shop?',
    answer:
      'No. Claiming a profile does not guarantee that ChatGPT will show or recommend your business. DANZUS does not promise rankings in ChatGPT or Google.',
  },
  {
    question: 'What are Business Agents?',
    answer:
      'Business Agents are a separate ChatGPT product. They are only for US e-commerce and online-service businesses, not a typical local trade shop.',
  },
  {
    question: 'What should I do if I go to the customer?',
    answer:
      'Keep your Google Business Profile accurate, and make sure your website says what you do, which towns you serve, and how to call. Use the same name, phone, and address everywhere. You can come back to the Business Hub when the service option opens.',
  },
  {
    question: 'How can DANZUS help?',
    answer:
      'Google and AI search is $199 a month. It includes your Google listing, the towns you serve, pages Google and ChatGPT can read, and a ChatGPT business profile claimed and kept up to date where ChatGPT supports your type of business. DANZUS Growth is $299 a month and includes that work, plus missed-call text-back and hosting. Start with the free AI Search Check at https://danzus.co/ai-search.',
  },
  {
    question: 'What does this cost?',
    answer:
      'Google and AI search is $199 a month. A website is $1,500, plus $49 a month for hosting and small edits. You pay half up front and half at launch, and you keep the site. DANZUS Growth is $299 a month for missed-call text-back, Google and AI search, and hosting. With a 6-month commitment, the website is $750. If you cancel before month 6, the website is $1,500 and we bill the other $750. Missed-call text-back alone is $99 a month after a free 30-day pilot, with no setup fee, month to month. That is the founding client price. Those monthly charges renew each month at the same price until you cancel. Cancel online at https://danzus.co/cancel, email dan@danzus.co, or call (916) 404-6129.',
  },
] as const

const STEPS = [
  {
    title: 'Open the ChatGPT Business Hub',
    body: 'Go to chatgpt.com/business-hub and sign in. This is the official place to add or claim a business profile.',
  },
  {
    title: 'Pick how customers usually reach you',
    body: 'The form asks how customers usually interact with you: a physical location, an online store, or through a service. Choose the one that matches your shop.',
  },
  {
    title: 'Add or claim the profile if your type is open',
    body: 'If you have a shop people walk into, such as a salon or auto shop, or you sell through an online store, you can add or claim a profile today. Complete the verification with a business phone, business email, website domain, or Shopify, then the ID check.',
  },
  {
    title: 'If you go to the customer, wait on the profile for now',
    body: 'If you are a plumber, HVAC tech, cleaner, welder, or another mobile trade, Through a service is still marked Coming Soon. You cannot claim a profile that way yet. Skip ahead to your Google listing and website.',
  },
  {
    title: 'Keep your Google listing accurate',
    body: 'Set the right name, phone, hours, and service area. Add photos and ask happy customers for reviews. ChatGPT and other AI tools still use this public information.',
  },
  {
    title: 'Make the website easy to describe',
    body: 'Say what you do, which towns you serve, and how to call. Use the same name, phone, and address on the site, on Google, and in directories. A site that loads quickly on a phone helps too.',
  },
] as const

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'listed in ChatGPT',
    'ChatGPT business profile',
    'ChatGPT Business Hub',
    'AI search small business',
    'AI help for small businesses',
    'Folsom',
    'Sacramento',
  ],
  alternates: { canonical: GUIDE_PATH },
  openGraph: {
    type: 'article',
    locale: 'en_US',
    url: `${SITE_URL}${GUIDE_PATH}`,
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
      '@id': `${SITE_URL}${GUIDE_PATH}#webpage`,
      url: `${SITE_URL}${GUIDE_PATH}`,
      name: TITLE,
      description: DESCRIPTION,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#business` },
      inLanguage: 'en-US',
    },
    {
      '@type': 'HowTo',
      '@id': `${SITE_URL}${GUIDE_PATH}#howto`,
      name: 'How to get a small business listed in ChatGPT',
      description: DESCRIPTION,
      inLanguage: 'en-US',
      step: STEPS.map((item, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: item.title,
        text: item.body,
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}${GUIDE_PATH}#faq`,
      url: `${SITE_URL}${GUIDE_PATH}`,
      mainEntity: FAQS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
}

export default function GetListedInChatGptPage() {
  return (
    <div className={`${home.page} ${condensed.variable} ${sans.variable}`}>
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
              className={`${home.call} ${search.navCall}`}
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

      <main id="content" className={search.main}>
        <header className={search.hero}>
          <p className={search.kicker}>A plain guide for local shops</p>
          <h1>How to get a small business listed in ChatGPT</h1>
          <p className={search.lede}>
            Customers now ask ChatGPT and other AI tools who to call. OpenAI has a Business Hub where some businesses
            can add or claim a profile. Here is what you can do yourself, what is not open yet, and how DANZUS can help.
          </p>
        </header>

        <section className={search.block} aria-labelledby="why-title">
          <h2 id="why-title">Why this matters</h2>
          <p>
            When someone asks ChatGPT for a plumber, a salon, or an auto shop nearby, the answer is often a short list
            of names, not a page of links. The customer usually calls one of those names. If your shop is not in the
            answer, the call goes to someone else.
          </p>
          <p>
            A claimed ChatGPT profile is one way to give ChatGPT your official name, phone, and website. It is not a
            guarantee that ChatGPT will name you. The work that still helps every shop is a clear Google listing and a
            website that is easy to describe.
          </p>
        </section>

        <section className={search.block} aria-labelledby="who-title">
          <h2 id="who-title">Who can claim a profile today</h2>
          <p>
            As of November 2026, ChatGPT Business Hub lets businesses with a physical location or an online store add or
            claim a profile. A salon, auto shop, or storefront in Folsom or Sacramento can start there. So can a
            business that sells through an online store.
          </p>
          <p>
            The Through a service option, for mobile or service-area businesses, is marked Coming Soon. If you go to the
            customer, you cannot claim a profile that way yet. Check the hub yourself, because that option may open later.
          </p>
        </section>

        <section className={search.block} aria-labelledby="steps-title">
          <h2 id="steps-title">What you can do yourself</h2>
          <ol className={styles.steps}>
            {STEPS.map((item, index) => (
              <li key={item.title}>
                <span className={styles.stepNum}>{index + 1}</span>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={search.block} aria-labelledby="caveats-title">
          <h2 id="caveats-title">What this does not do</h2>
          <ul>
            <li>Claiming a profile does not guarantee that ChatGPT will show or recommend your business.</li>
            <li>DANZUS does not promise rankings in ChatGPT, Google, or any other AI search tool.</li>
            <li>
              Business Agents are only for US e-commerce and online-service businesses, not a typical local trade shop.
            </li>
            <li>
              If your type of business is still Coming Soon in the hub, there is no workaround. Focus on Google and your
              website until the service option opens.
            </li>
          </ul>
        </section>

        <section className={search.block} aria-labelledby="help-title">
          <h2 id="help-title">How DANZUS can help</h2>
          <p>
            DANZUS is a small-business agency in Folsom. We set this up for local shops, along with the Google and
            website work that still matters when a profile cannot be claimed yet.
          </p>
          <ul>
            <li>
              Google and AI search is $199 a month. It includes your Google listing, the towns you serve, pages Google
              and ChatGPT can read, and a ChatGPT business profile claimed and kept up to date where ChatGPT supports
              your type of business.
            </li>
            <li>
              DANZUS Growth is $299 a month for missed-call text-back, Google and AI search, and hosting. With a 6-month
              commitment, the website is $750. If you cancel before month 6, the website is $1,500 and we bill the other
              $750.
            </li>
            <li>
              A website on its own is $1,500, plus $49 a month for hosting and small edits. You pay half up front and
              half at launch, and you keep the site.
            </li>
          </ul>
          <p>
            The same menu is on the <Link href="/small-business-ai-help">AI help</Link> page. Monthly plans renew until
            you cancel, at <Link href="/cancel">danzus.co/cancel</Link>.
          </p>
        </section>

        <section className={search.faq} aria-labelledby="faq-title">
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

        <section className={search.cta} id="check" aria-labelledby="check-title">
          <h2 id="check-title">Start with a free AI Search Check</h2>
          <p>
            See how ready your website is to be described when someone asks ChatGPT or Google for a shop like yours. The
            check scores only what it can see on the public site. It is not a ranking.
          </p>
          <p>
            <Link className={search.primary} href="/ai-search#check">
              Free AI Search Check
            </Link>
          </p>
          <p>
            Or call{' '}
            <a
              href={CONTACT_PHONE_TEL}
              data-track="call_click"
              data-track-location="section"
              data-track-label={`Call ${CONTACT_PHONE_DISPLAY}`}
              data-track-section="chatgpt-guide"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
