import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { isBlockedAddress, UnsafeUrlError, assertPublicHttpUrl } from '@/lib/ai-check/guard'
import { renderReportPdf } from '@/lib/ai-check/pdf'
import { buildReport } from '@/lib/ai-check/score'
import type { Snapshot } from '@/lib/ai-check/types'

const html = `<!doctype html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>North Side Plumbing</title>
<meta name="description" content="Plumber in Folsom.">
<script type="application/ld+json">{"@type":"Plumber","name":"North Side Plumbing","address":{"@type":"PostalAddress","streetAddress":"10 Oak Ave"}}</script>
</head><body>
<h1>North Side Plumbing</h1>
<p>10 Oak Ave, Folsom, CA 95630. Call (916) 555-0199.</p>
</body></html>`

function snapshot(overrides: Partial<Snapshot> = {}): Snapshot {
  return {
    requestedUrl: 'https://north.example',
    finalUrl: 'https://north.example/',
    html,
    status: 200,
    responseMs: 400,
    htmlBytes: 1200,
    robotsStatus: 200,
    robotsBody: 'User-agent: *\nAllow: /',
    llmsStatus: 200,
    llmsBytes: 80,
    llmsText: true,
    sitemapStatus: 200,
    sitemapXml: true,
    businessName: 'North Side Plumbing',
    cityTrade: 'Folsom, plumber',
    checkedAt: '2026-11-03T18:00:00.000Z',
    ...overrides,
  }
}

describe('AI search check', () => {
  it('blocks private and loopback addresses', async () => {
    expect(isBlockedAddress('127.0.0.1')).toBe(true)
    expect(isBlockedAddress('10.1.1.1')).toBe(true)
    expect(isBlockedAddress('169.254.169.254')).toBe(true)
    expect(isBlockedAddress('8.8.8.8')).toBe(false)
    await expect(assertPublicHttpUrl('http://127.0.0.1/secret', async () => ['127.0.0.1'])).rejects.toBeInstanceOf(
      UnsafeUrlError,
    )
    await expect(assertPublicHttpUrl('https://shop.example', async () => ['10.0.0.5'])).rejects.toBeInstanceOf(
      UnsafeUrlError,
    )
    await expect(assertPublicHttpUrl('file:///etc/passwd', async () => [])).rejects.toBeInstanceOf(UnsafeUrlError)
  })

  it('scores only measured signals and does not invent a rank', () => {
    const full = buildReport(snapshot())
    expect(full.score).toBe(100)
    expect(full.passed).toHaveLength(full.signals.length)
    expect(full.fixes).toHaveLength(0)
    expect(full.note).not.toMatch(/—|DimeVision|App Orchid/i)

    const partial = buildReport(
      snapshot({
        finalUrl: null,
        html: null,
        responseMs: null,
        htmlBytes: null,
        robotsStatus: 404,
        robotsBody: '',
        llmsStatus: null,
        llmsBytes: null,
        sitemapStatus: null,
        sitemapXml: null,
      }),
    )
    expect(partial.score).toBe(0)
    expect(partial.signals.filter((signal) => signal.status === 'unmeasured').length).toBeGreaterThan(0)
    expect(partial.signals.find((signal) => signal.id === 'schema')?.status).toBe('unmeasured')
    expect(partial.fixes.map((signal) => signal.id)).toEqual(['robots'])
  })

  it('writes a branded PDF without inventing a score when nothing was read', async () => {
    const report = buildReport(
      snapshot({
        finalUrl: null,
        html: null,
        status: null,
        responseMs: null,
        htmlBytes: null,
        robotsStatus: null,
        robotsBody: null,
        llmsStatus: null,
        llmsBytes: null,
        sitemapStatus: null,
        sitemapXml: null,
      }),
    )
    expect(report.score).toBeNull()
    const pdf = Buffer.from(await renderReportPdf(report))
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
    const page = readFileSync('app/ai-search/page.tsx', 'utf8')
    expect(page).not.toMatch(/—|DimeVision|App Orchid/i)
    expect(readFileSync('app/ai-search/CheckForm.tsx', 'utf8')).not.toContain('defaultChecked')
  })
})
