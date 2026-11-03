import { Source_Sans_3, Source_Serif_4 } from 'next/font/google'
import { SampleSite, demoMetadata } from '@/app/sample-sites/SampleSite'
import { TRADES } from '@/app/sample-sites/trades'

const display = Source_Serif_4({
  subsets: ['latin'],
  weight: '600',
  display: 'swap',
  variable: '--font-display',
})

const body = Source_Sans_3({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-body',
})

const trade = TRADES[0]

export const metadata = demoMetadata(trade)

export default function Page() {
  return <SampleSite trade={trade} className={`${display.variable} ${body.variable}`} />
}
