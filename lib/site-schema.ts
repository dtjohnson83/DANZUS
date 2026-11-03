import {
  CONTACT_EMAIL,
  CONTACT_PHONE_SCHEMA,
  LINKEDIN_URL,
  SITE_URL,
} from '@/app/site'

export const HOME_TITLE =
  'Websites and AI Assistants for Small Businesses in Sacramento, Folsom, Roseville, and El Dorado Hills | DANZUS'

export const HOME_DESCRIPTION =
  'DANZUS Holdings LLC in Folsom builds websites and sets up AI assistants and local search for small businesses in Sacramento, Folsom, Roseville, and El Dorado Hills. A website starts at $1,500. SEO and AI search starts at $300 a month.'

const DEMO_BASE = 'https://ic048emi0kpty2jd.public.blob.vercel-storage.com/demos'

export const SERVICE_AREA = ['Sacramento', 'Folsom', 'Roseville', 'El Dorado Hills'] as const

export const FAQS = [
  {
    question: 'What does it cost?',
    answer:
      'Prices on this page are starting ranges. A website starts at $1,500. SEO and AI search starts at $300 a month, and a Google Business Profile plus AI listing starter starts at $150 a month. Pilot is $150 a month, starting at $250 setup, for the first three Sacramento-area shops in exchange for an honest testimonial. Starter is $200 to $300 a month, starting at $500 setup, for one assistant package. Growth is $400 to $600 a month, starting at $1,000 to $1,500 setup, for Lead to Booked Job, Quote to Cash, and Job Closeout. Custom work starts at $1,500, or $100 to $150 an hour, when the assistant has to write into QuickBooks, a CRM, or another system you already run. The free call turns the range into a fixed quote before any setup begins.',
  },
  {
    question: 'How long does setup take?',
    answer:
      'The free call is where you walk through where the leads leak and pick the first job for the assistant. About 80% of a package is a ready-made template, and about 20% is written for your shop. DANZUS connects it to the calendar, QuickBooks, the CRM, or the texts you already use. You read the replies before it runs, and each month we read what it sent and fix what sounds off.',
  },
  {
    question: 'Do I need new software?',
    answer:
      'No. The assistant plugs into the calendar, QuickBooks, a CRM, and the texting you already use. Custom work is only for a package that has to write into one of those systems.',
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
] as const

type ListedService = {
  name: string
  description: string
  lowPrice: string
  highPrice?: string
  unitText?: string
  offerNote: string
  serviceType?: string
  anchor?: string
}

export const PACKAGE_SERVICES: ListedService[] = [
  {
    name: 'Lead to Booked Job',
    description: 'A new inquiry becomes a time on the calendar. Capture the lead, reply, qualify, then book and remind.',
    lowPrice: '200',
    highPrice: '600',
    unitText: 'MONTH',
    offerNote: 'Monthly starting range. One step can start on Starter. The full package fits Growth. Setup is separate.',
  },
  {
    name: 'Quote to Cash',
    description: 'An estimate becomes money in the account. Draft the estimate, follow up, send the invoice, and chase the payment.',
    lowPrice: '200',
    highPrice: '600',
    unitText: 'MONTH',
    offerNote: 'Follow-up alone can start on Starter. The full package fits Growth. QuickBooks is Custom. Setup is separate.',
  },
  {
    name: 'Job Closeout',
    description: 'A finished job leaves a review and a referral. Completion photos, a review request, and a referral ask.',
    lowPrice: '400',
    highPrice: '600',
    unitText: 'MONTH',
    offerNote: 'Fits Growth. Setup for Growth starts at $1,000 to $1,500.',
  },
  {
    name: 'Back Office',
    description: 'The inbox, the bills, and the week land in one place. Inbox triage, receipts and bills into the books, and a weekly summary.',
    lowPrice: '100',
    highPrice: '150',
    unitText: 'HOUR',
    offerNote: 'Fits Custom. Inbox triage alone can start on Starter. Custom setup starts at $1,500.',
  },
  {
    name: 'Customer Service',
    description: 'The customer gets an answer, a status, or you. FAQ answers, job or order status, and a handoff to a person.',
    lowPrice: '200',
    highPrice: '300',
    unitText: 'MONTH',
    offerNote: 'FAQ answers fit Starter. Live job or order status is Custom.',
  },
  {
    name: 'Website',
    description:
      'A custom website for one local business. Fast on a phone, with a way to call or send a lead.',
    lowPrice: '1500',
    offerNote: 'Starting at $1,500. A project, not a monthly assistant.',
    serviceType: 'Website design for a local business',
    anchor: '#site',
  },
  {
    name: 'SEO and AI search',
    description:
      'Google Business Profile, local SEO, schema, an llms.txt file, and pages so the business can be described in Google and in AI answers.',
    lowPrice: '300',
    unitText: 'MONTH',
    offerNote: 'Starting at $300 per month. A Google Business Profile and AI listing starter starts at $150 per month.',
    serviceType: 'Local SEO and AI search',
    anchor: '#site',
  },
  {
    name: 'Google Business Profile and AI listing',
    description:
      'A starter for the Google Business Profile and an AI listing, before the fuller SEO and AI search package.',
    lowPrice: '150',
    unitText: 'MONTH',
    offerNote: 'Starting at $150 per month.',
    serviceType: 'Google Business Profile and AI listing',
    anchor: '#site',
  },
]

export const DEMO_VIDEOS = [
  ['01-lead-to-booked-job', 'Lead to Booked Job'],
  ['02-quote-to-cash', 'Quote to Cash'],
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

export function siteJsonLd() {
  const businessId = `${SITE_URL}/#business`
  const personId = `${SITE_URL}/#dan-johnson`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
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
        areaServed: areaServed(),
        founder: { '@id': personId },
        sameAs: [LINKEDIN_URL],
      },
      {
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
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'DANZUS',
        url: SITE_URL,
        description: HOME_DESCRIPTION,
        publisher: { '@id': businessId },
        inLanguage: 'en-US',
      },
      ...PACKAGE_SERVICES.map((service) => ({
        '@type': 'Service',
        '@id': `${SITE_URL}/#service-${service.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: service.name,
        description: service.description,
        serviceType: service.serviceType ?? 'AI assistant for a small business',
        provider: { '@id': businessId },
        areaServed: areaServed(),
        url: `${SITE_URL}/${service.anchor ?? '#packages'}`,
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: service.lowPrice,
          ...(service.highPrice ? { highPrice: service.highPrice } : {}),
          ...(service.unitText ? { unitText: service.unitText } : {}),
          description: service.offerNote,
        },
      })),
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        url: `${SITE_URL}/#faq`,
        mainEntity: FAQS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
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
