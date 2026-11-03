import { IBM_Plex_Sans, Oswald } from 'next/font/google'
import { SampleSite, demoMetadata } from '@/app/sample-sites/SampleSite'
import { TRADES } from '@/app/sample-sites/trades'

const display = Oswald({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  variable: '--font-display',
})

const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-body',
})

const trade = TRADES[2]

export const metadata = demoMetadata(trade)

export default function Page() {
  return <SampleSite trade={trade} className={`${display.variable} ${body.variable}`} />
}
