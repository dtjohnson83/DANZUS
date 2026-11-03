import { Fraunces, Nunito_Sans } from 'next/font/google'
import { SampleSite, demoMetadata } from '@/app/sample-sites/SampleSite'
import { TRADES } from '@/app/sample-sites/trades'

const display = Fraunces({
  subsets: ['latin'],
  weight: '600',
  display: 'swap',
  variable: '--font-display',
})

const body = Nunito_Sans({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-body',
})

const trade = TRADES[1]

export const metadata = demoMetadata(trade)

export default function Page() {
  return <SampleSite trade={trade} className={`${display.variable} ${body.variable}`} />
}
