import { Barlow_Semi_Condensed, Inter } from 'next/font/google'

/** Condensed headings for the homepage. Not used as a body face. */
export const condensed = Barlow_Semi_Condensed({
  subsets: ['latin'],
  weight: '700',
  display: 'swap',
  variable: '--font-display',
  adjustFontFallback: true,
})

/** Body face for the homepage. */
export const sans = Inter({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-body',
  adjustFontFallback: true,
})
