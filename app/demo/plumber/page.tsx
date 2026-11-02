import { SampleSite, demoMetadata } from '@/app/sample-sites/SampleSite'
import { TRADES } from '@/app/sample-sites/trades'

const trade = TRADES[0]

export const metadata = demoMetadata(trade)

export default function Page() {
  return <SampleSite trade={trade} />
}
