import { Inter } from 'next/font/google'

/** Display face for the homepage. Optical size tracks the headline scale. */
export const display = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  axes: ['opsz'],
  variable: '--font-display',
  adjustFontFallback: true,
})
