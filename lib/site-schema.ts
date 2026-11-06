import {
  CONTACT_EMAIL,
  CONTACT_PHONE_SCHEMA,
  LINKEDIN_URL,
  SITE_URL,
} from '@/app/site'

export const HOME_TITLE =
  'AI help for small businesses in Sacramento, Folsom, Roseville, and El Dorado Hills | DANZUS'

export const HOME_DESCRIPTION =
  'DANZUS provides AI help for small businesses in Sacramento, Folsom, Roseville, and El Dorado Hills. Dan Johnson in Folsom sets up missed-call text-back, websites, and Google and AI search. Missed-call text-back is $99 a month after a free 30-day pilot. A website is $1,500 plus $49 a month. Google and AI search is $199 a month. DANZUS Growth is $299 a month. With a 6-month commitment, the website is $750. If you cancel before month 6, the website is $1,500 and we bill the other $750.'

export const AI_HELP_PATH = '/small-business-ai-help'

export const AI_HELP_TITLE = 'AI help for small businesses in Sacramento and Folsom | DANZUS'

export const AI_HELP_DESCRIPTION =
  'DANZUS provides small business AI help in Sacramento, Folsom, Roseville, and El Dorado Hills. Missed-call text-back is $99 a month after a free 30-day pilot. A website is $1,500 plus $49 a month. Google and AI search is $199 a month. DANZUS Growth is $299 a month. With a 6-month commitment, the website is $750. If you cancel before month 6, the website is $1,500 and we bill the other $750. Call or text (916) 404-6129.'

const DEMO_BASE = 'https://ic048emi0kpty2jd.public.blob.vercel-storage.com/demos'

export const SERVICE_AREA = ['Sacramento', 'Folsom', 'Roseville', 'El Dorado Hills'] as const

export const FAQS = [
  {
    question: 'What does it cost?',
    answer:
      'Missed-call text-back is $99 a month after a free 30-day pilot. There is no setup fee, and it is month to month. That is the founding client price. A website is $1,500 one time, plus $49 a month for hosting and small edits. You pay 50% up front and 50% at launch, and you keep the site. Google and AI search is $199 a month. DANZUS Growth is $299 a month and includes missed-call text-back, Google and AI search, and hosting. With a 6-month commitment, the website is $750. If you cancel before month 6, the website is $1,500 and we bill the other $750. Those monthly charges renew each month at the same price until you cancel. Cancel online at https://danzus.co/cancel, email dan@danzus.co, or call (916) 404-6129.',
  },
  {
    question: 'How long does setup take?',
    answer:
      'The free call is where you walk through where the leads leak and pick the first job. Most of it is ready to go, and the rest is written for your shop. DANZUS connects it to the calendar, QuickBooks, your customer list, or the texts you already use. You read the replies before it runs, and each month we read what it sent and fix what sounds off. Missed-call text-back has no setup fee.',
  },
  {
    question: 'Do I need new software?',
    answer:
      'No. It connects to the calendar, QuickBooks, your customer list, and the texting you already use.',
  },
  {
    question: 'Is it secure?',
    answer:
      'You read the replies. A person signs off on anything risky before it reaches a customer. Mobile phone numbers and SMS opt-in data and consent are not shared with any third parties or affiliates. The privacy notice is at danzus.co/privacy.',
  },
  {
    question: 'What if the AI says something wrong?',
    answer:
      'A person signs off on anything risky before it goes out. Each month we read what the assistant sent and fix what sounds off. If a customer is upset or unsure, the owner follows up.',
  },
  {
    question: 'Do you work in person?',
    answer:
      'Dan Johnson is in Folsom. Call or text (916) 404-6129, or email dan@danzus.co, including for the free call. DANZUS sets these assistants up for shops in Sacramento, Folsom, Roseville, El Dorado Hills, and nearby.',
  },
  {
    question: 'Do you help small businesses with AI?',
    answer:
      'Yes. DANZUS provides AI help for small businesses in Sacramento, Folsom, Roseville, and El Dorado Hills. That help is missed-call text-back, a website built so the next step is a call or a lead, and Google and AI search so Google and ChatGPT can describe the shop. The page is https://danzus.co/small-business-ai-help. Call or text (916) 404-6129, or email dan@danzus.co.',
  },
] as const

export const AI_HELP_FAQS = [
  {
    question: 'Do you help small businesses with AI?',
    answer:
      'Yes. DANZUS provides AI help for small businesses in Sacramento, Folsom, Roseville, and El Dorado Hills.',
  },
  {
    question: 'What is that help?',
    answer:
      'Missed-call text-back sends a text when a call is missed. A website is built so the next step is a call or a lead. Google and AI search helps Google and ChatGPT describe the shop. Missed-call text-back is $99 a month after a free 30-day pilot, with no setup fee, month to month. That is the founding client price. A website is $1,500 one time, plus $49 a month for hosting and small edits. You pay 50% up front and 50% at launch, and you keep the site. Google and AI search is $199 a month. DANZUS Growth is $299 a month for text-back, Google and AI search, and hosting. With a 6-month commitment, the website is $750. If you cancel before month 6, the website is $1,500 and we bill the other $750.',
  },
  {
    question: 'Which towns do you cover?',
    answer:
      'Sacramento, Folsom, Roseville, El Dorado Hills, and nearby. Dan Johnson lives and works from Folsom.',
  },
  {
    question: 'How do I start?',
    answer:
      'Call or text (916) 404-6129, or email dan@danzus.co. You can also start from the buttons on this page. Cancel a monthly plan at https://danzus.co/cancel.',
  },
] as const

type ListedService = {
  name: string
  description: string
  price?: string
  unitText?: string
  offerNote?: string
  serviceType?: string
  anchor?: string
}

export const PACKAGE_SERVICES: ListedService[] = [
  {
    name: 'Missed-call text-back',
    description:
      'When a call is missed, a text goes back in the shop voice. Free 30-day pilot, then $99 a month. No setup fee. Month to month. Founding client price.',
    price: '99',
    unitText: 'MONTH',
    offerNote:
      '$99 a month after a free 30-day pilot. No setup fee. Month to month. It renews each month until you cancel. Founding client price.',
    serviceType: 'Missed-call text-back',
    anchor: '#pricing',
  },
  {
    name: 'Website',
    description:
      'A custom website for one local business. Fast on a phone, with a way to call or send a lead. $1,500 one time, plus $49 a month for hosting and small edits. Paid 50% up front and 50% at launch. The client keeps the site.',
    price: '1500',
    offerNote:
      '$1,500 one time, plus $49 a month for hosting and small edits. The $49 charge renews each month until you cancel. Paid 50% up front and 50% at launch. You keep the site.',
    serviceType: 'Website design for a local business',
    anchor: '#pricing',
  },
  {
    name: 'Google and AI search',
    description:
      'Your Google listing, the towns you serve, and pages Google and ChatGPT can read.',
    price: '199',
    unitText: 'MONTH',
    offerNote: '$199 a month. It renews each month until you cancel.',
    serviceType: 'Local SEO and AI search',
    anchor: '#pricing',
  },
  {
    name: 'DANZUS Growth',
    description:
      'Missed-call text-back, Google and AI search, and hosting. $299 a month. With a 6-month commitment, the website is $750. If you cancel before month 6, the website is $1,500 and we bill the other $750.',
    price: '299',
    unitText: 'MONTH',
    offerNote:
      '$299 a month for missed-call text-back, Google and AI search, and hosting. The $299 charge renews each month until you cancel. With a 6-month commitment, the website is $750. If you cancel before month 6, the website is $1,500 and we bill the other $750.',
    serviceType: 'DANZUS Growth bundle',
    anchor: '#pricing',
  },
  {
    name: 'Lead to Booked Job',
    description: 'A new inquiry becomes a time on the calendar. Capture the lead, reply, ask the right questions, then book and remind.',
    serviceType: 'AI assistant for a small business',
  },
  {
    name: 'Estimate to payment',
    description: 'An estimate becomes money in the account. Draft the estimate, follow up, send the invoice, and chase the payment.',
    serviceType: 'AI assistant for a small business',
  },
  {
    name: 'Job Closeout',
    description: 'A finished job leaves a review and a referral. Completion photos, a review request, and a referral ask.',
    serviceType: 'AI assistant for a small business',
  },
  {
    name: 'Back Office',
    description: 'The inbox, the bills, and the week land in one place. Sort your email, enter bills into your bookkeeping, and a weekly summary.',
    serviceType: 'AI assistant for a small business',
  },
  {
    name: 'Customer Service',
    description: 'The customer gets an answer, a status, or you. FAQ answers, job or order status, and a handoff to a person.',
    serviceType: 'AI assistant for a small business',
  },
]

export const DEMO_VIDEOS = [
  ['01-lead-to-booked-job', 'Lead to Booked Job'],
  ['02-quote-to-cash', 'Estimate to payment'],
  ['03-job-closeout', 'Job Closeout'],
  ['04-back-office', 'Back Office'],
  ['05-customer-service', 'Customer Service'],
] as const

function areaServed() {
  return [
    ...SERVICE_AREA.map((name) => ({
      '@type': 'City',
      name,
      containedInPlace: { '@type': 'State', name: 'California' },
    })),
    { '@type': 'AdministrativeArea', name: 'Sacramento region, California' },
  ]
}

const businessId = `${SITE_URL}/#business`
const personId = `${SITE_URL}/#dan-johnson`

function businessNode() {
  return {
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    '@id': businessId,
    name: 'DANZUS',
    legalName: 'DANZUS Holdings LLC',
    url: SITE_URL,
    image: `${SITE_URL}/dan-johnson.jpg`,
    logo: `${SITE_URL}/danzus-mark-512.png`,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_SCHEMA,
    description: HOME_DESCRIPTION,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Folsom',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT_PHONE_SCHEMA,
      email: CONTACT_EMAIL,
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: 'English',
    },
    areaServed: areaServed(),
    founder: { '@id': personId },
    sameAs: [LINKEDIN_URL],
  }
}

function personNode() {
  return {
    '@type': 'Person',
    '@id': personId,
    name: 'Dan Johnson',
    url: LINKEDIN_URL,
    jobTitle: 'Lead AI Solutions Engineer',
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_SCHEMA,
    worksFor: { '@id': businessId },
    homeLocation: {
      '@type': 'Place',
      name: 'Folsom, California',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Folsom',
        addressRegion: 'CA',
        addressCountry: 'US',
      },
    },
    sameAs: [LINKEDIN_URL],
  }
}

function namedServices(names: readonly string[]) {
  return names.map((name) => {
    const service = PACKAGE_SERVICES.find((item) => item.name === name)
    if (!service) throw new Error(`Missing service: ${name}`)
    return serviceNode(service)
  })
}

function serviceNode(service: ListedService) {
  return {
    '@type': 'Service',
    '@id': `${SITE_URL}/#service-${service.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: service.name,
    description: service.description,
    serviceType: service.serviceType ?? 'AI assistant for a small business',
    provider: { '@id': businessId },
    areaServed: areaServed(),
    url: `${SITE_URL}/${service.anchor ?? '#packages'}`,
    ...(service.price
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: service.price,
            ...(service.unitText ? { unitText: service.unitText } : {}),
            description: service.offerNote,
          },
        }
      : {}),
  }
}

function faqNode(id: string, url: string, items: readonly { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    '@id': id,
    url,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      businessNode(),
      personNode(),
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'DANZUS',
        url: SITE_URL,
        description: HOME_DESCRIPTION,
        publisher: { '@id': businessId },
        inLanguage: 'en-US',
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: HOME_TITLE,
        description: HOME_DESCRIPTION,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': businessId },
        inLanguage: 'en-US',
      },
      ...PACKAGE_SERVICES.map((service) => serviceNode(service)),
      faqNode(`${SITE_URL}/#faq`, `${SITE_URL}/#faq`, FAQS),
      ...DEMO_VIDEOS.map(([slug, name]) => ({
        '@type': 'VideoObject',
        '@id': `${SITE_URL}/#video-${slug}`,
        name: `${name} demo`,
        description: `A 75-second narrated demo of the ${name} package from DANZUS. Captions are burned in.`,
        thumbnailUrl: `${DEMO_BASE}/${slug}-poster.jpg`,
        contentUrl: `${DEMO_BASE}/${slug}.mp4`,
        embedUrl: `${SITE_URL}/#packages`,
        duration: 'PT1M15S',
        uploadDate: '2026-11-02',
        publisher: { '@id': businessId },
      })),
    ],
  }
}

export function aiHelpPageJsonLd() {
  const pageUrl = `${SITE_URL}${AI_HELP_PATH}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      businessNode(),
      personNode(),
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: AI_HELP_TITLE,
        description: AI_HELP_DESCRIPTION,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': businessId },
        inLanguage: 'en-US',
      },
      faqNode(`${pageUrl}#faq`, pageUrl, AI_HELP_FAQS),
      ...namedServices(['Missed-call text-back', 'Website', 'Google and AI search', 'DANZUS Growth']),
    ],
  }
}
