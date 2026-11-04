import { Hanken_Grotesk, IBM_Plex_Mono, Saira } from 'next/font/google'

/**
 * Site-wide faces. next/font downloads these at build and serves them
 * from this app, so the browser does not call fonts.googleapis.com.
 */
export const saira = Saira({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-saira',
  adjustFontFallback: true,
})

export const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-hanken',
  adjustFontFallback: true,
})

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
  adjustFontFallback: true,
})
