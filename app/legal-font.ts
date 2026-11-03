import { Inter } from 'next/font/google'

/** Optical-size Inter for the legal pages. */
export const display = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  axes: ['opsz'],
  variable: '--font-display',
  adjustFontFallback: true,
})
