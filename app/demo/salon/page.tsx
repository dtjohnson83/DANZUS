import { Cormorant_Garamond, Outfit } from 'next/font/google'
import { SampleSite, demoMetadata } from '@/app/sample-sites/SampleSite'
import { TRADES } from '@/app/sample-sites/trades'

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: '500',
  style: 'italic',
  display: 'swap',
  variable: '--font-display',
})

const body = Outfit({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-body',
})

const trade = TRADES[3]

export const metadata = demoMetadata(trade)

export default function Page() {
  return <SampleSite trade={trade} className={`${display.variable} ${body.variable}`} />
}
