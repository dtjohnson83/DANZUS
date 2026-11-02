import './globals.css'
import type { Metadata } from 'next'

const SITE_URL = 'https://danzus.co'
const SITE_NAME = 'DANZUS'
const DEFAULT_TITLE = 'AI Assistants for Sacramento and Folsom Small Businesses | DANZUS'
const DEFAULT_DESCRIPTION =
  'DANZUS in Folsom sets up AI assistants for Sacramento-area contractors and local services. Missed calls, follow-up, booking, and reviews. Flat monthly price.'

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
    'Sacramento AI assistant',
    'Folsom small business',
    'AI assistant for contractors',
    'missed call text back',
    'DimeVision',
    'Agent Audit Trail',
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Saira:wght@400;500;600;700&family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
