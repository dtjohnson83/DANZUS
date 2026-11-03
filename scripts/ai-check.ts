import { writeFile } from 'node:fs/promises'
import { UnsafeUrlError, assertPublicHttpUrl } from '../lib/ai-check/guard'
import { measureSite } from '../lib/ai-check/measure'
import { renderReportPdf } from '../lib/ai-check/pdf'
import { buildReport } from '../lib/ai-check/score'

const urlArg = process.argv[2]
const out = process.argv[3]

const businessName = process.argv[4] ?? ''
const cityTrade = process.argv[5] ?? ''

if (!urlArg || !out) {
  console.error('Usage: npx tsx scripts/ai-check.ts <url> <out.pdf> [business name] [city, trade]')
  process.exit(1)
}

const url = /^https?:\/\//i.test(urlArg) ? urlArg : `https://${urlArg}`

async function main() {
  try {
    await assertPublicHttpUrl(url)
    const snapshot = await measureSite({ url, businessName, cityTrade })
    const report = buildReport(snapshot)
    await writeFile(out, await renderReportPdf(report))
    console.log(`${report.score === null ? 'unscored' : report.score} ${report.businessName} ${out}`)
  } catch (error) {
    console.error(error instanceof UnsafeUrlError ? error.message : 'The check could not read that site.')
    process.exit(1)
  }
}

void main()
