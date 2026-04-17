import './globals.css'
import type { Metadata } from 'next'

const SITE_URL = 'https://danzus.co'
const SITE_NAME = 'DANZUS'
const DEFAULT_TITLE = 'DANZUS Holdings — AI Software for Trades & Compliance'
const DEFAULT_DESCRIPTION =
  'DANZUS Holdings builds AI-native software for the physical world — from AI welding coaches for trade students to compliance infrastructure for agentic AI systems.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s · DANZUS',
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'DANZUS',
    'AI-native software',
    'trades software',
    'compliance software',
    'AI agent',
    'chatbot vs agent',
    'ContextKit',
    'Claude Code',
    'AGENTS.md',
    'CLAUDE.md',
    'context engineering',
    'LLM agent',
  ],
  authors: [{ name: 'DANZUS Holdings LLC', url: SITE_URL }],
  creator: 'DANZUS Holdings LLC',
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
    images: [{ url: '/icon.svg', width: 512, height: 512, alt: 'DANZUS' }],
  },
  twitter: {
    card: 'summary',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ['/icon.svg'],
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  other: {
    // GEO: explicit allow for AI crawlers at the document level
    'GPTBot': 'index, follow',
    'ClaudeBot': 'index, follow',
    'anthropic-ai': 'index, follow',
    'PerplexityBot': 'index, follow',
    'Google-Extended': 'index, follow',
    'CCBot': 'index, follow',
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
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700&family=DM+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
