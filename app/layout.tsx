import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { hanken, plexMono, saira } from './brand-fonts'
import { ClickTracker } from './ClickTracker'

const SITE_URL = 'https://danzus.co'
const SITE_NAME = 'DANZUS'
const DEFAULT_TITLE = 'AI help for small businesses in Sacramento and Folsom | DANZUS'
const DEFAULT_DESCRIPTION =
  'DANZUS provides AI help for small businesses in Sacramento, Folsom, Roseville, and El Dorado Hills. Text-back is $99 a month after a free 30-day pilot. A website is $1,500 plus $49 a month. Google and AI search is $199 a month. DANZUS Growth is $299 a month, and the website is $750 with a 6-month commitment. If you cancel before month 6, the website is $1,500 and we bill the other $750.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s · DANZUS',
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'DANZUS',
    'DANZUS Holdings LLC',
    'AI help for small businesses',
    'small business AI help',
    'AI assistant for small business Sacramento',
    'small business automation Folsom',
    'AI assistant Roseville',
    'AI assistant El Dorado Hills',
    'missed call text back',
    'small business website Folsom',
    'local SEO Sacramento',
  ],
  authors: [
    { name: 'Dan Johnson', url: 'https://linkedin.com/in/danjohnsondata' },
    { name: 'DANZUS Holdings LLC', url: SITE_URL },
  ],
  creator: 'Dan Johnson',
  publisher: 'DANZUS Holdings LLC',
  applicationName: SITE_NAME,
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DANZUS Holdings' }],
  },
  twitter: {
    card: 'summary',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  other: {
    // GEO: explicit allow for AI crawlers at the document level
    'GPTBot': 'index, follow',
    'ClaudeBot': 'index, follow',
    'anthropic-ai': 'index, follow',
    'PerplexityBot': 'index, follow',
    'Google-Extended': 'index, follow',
    'CCBot': 'index, follow',
    'geo.region': 'US-CA',
    'geo.placename': 'Folsom, California',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${saira.variable} ${hanken.variable} ${plexMono.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
        <ClickTracker />
      </body>
    </html>
  )
}
