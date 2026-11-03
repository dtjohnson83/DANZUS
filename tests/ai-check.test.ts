import { readFileSync } from 'node:fs'
import { inflateSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'
import { isBlockedAddress, UnsafeUrlError, assertPublicHttpUrl } from '@/lib/ai-check/guard'
import { renderReportPdf } from '@/lib/ai-check/pdf'
import { scoreLabel } from '@/lib/ai-check/copy'
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
    expect(full.scoreLabel).toBe('Strong')
    expect(full.opening).toBe(
      "When people ask ChatGPT or Google for a plumber in Folsom, here's how ready your website is to be recommended.",
    )
    expect(full.passed).toHaveLength(full.signals.length)
    expect(full.fixes).toHaveLength(0)
    expect(full.note).toMatch(/readiness check/i)
    expect(full.note).not.toMatch(/—|DimeVision|App Orchid/i)
    for (const signal of full.signals) {
      const copy = `${signal.label} ${signal.benefit} ${signal.fix} ${signal.detail}`
      expect(copy).not.toMatch(/schema|robots\.txt|llms\.txt|viewport|HTTPS|\bH1\b|\bKB\b|\bms\b|HTML|status/i)
      expect(copy).not.toMatch(/—|DimeVision|App Orchid/i)
    }

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
    expect(partial.scoreLabel).toBe('Needs work')
    expect(partial.signals.filter((signal) => signal.status === 'unmeasured').length).toBeGreaterThan(0)
    expect(partial.signals.find((signal) => signal.id === 'schema')?.status).toBe('unmeasured')
    expect(partial.signals.find((signal) => signal.id === 'schema')?.label).toBe(
      'Google and AI can read your business details',
    )
    expect(partial.fixes.map((signal) => signal.id)).toEqual(['robots'])
  })

  it('keeps spaces inside quoted site text', () => {
    const report = buildReport(
      snapshot({
        html: html.replace(
          'Plumber in Folsom.',
          'local plumbing\u00A0expertise\u00A0to every job. Call &#160;today.',
        ),
      }),
    )
    const description = report.signals.find((signal) => signal.id === 'description')
    expect(description?.detail).toContain('plumbing expertise to')
    expect(description?.detail).not.toContain('plumbingexpertiseto')
    expect(description?.detail).toContain('Call today')
  })

  it('uses plain labels for a middle score', () => {
    const report = buildReport(
      snapshot({
        html: html.replace(/<script\b[\s\S]*?<\/script>/i, ''),
        llmsStatus: 404,
        llmsBytes: 0,
        llmsText: false,
        sitemapStatus: 404,
        sitemapXml: false,
        robotsStatus: 404,
        robotsBody: '',
      }),
    )
    expect(report.score).toBeLessThan(90)
    expect(report.score).toBeGreaterThanOrEqual(50)
    expect(report.scoreLabel).toBe('Good')
    expect(scoreLabel(80)).toBe('Good')
    expect(scoreLabel(90)).toBe('Strong')
    expect(scoreLabel(49)).toBe('Needs work')
    expect(report.fixes[0]?.benefit).toBeTruthy()
    expect(report.fixes.map((item) => item.label).join(' ')).not.toMatch(/robots\.txt|llms\.txt|schema/i)
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
    const text = pdfPlainText(pdf)
    expect(text).toContain('Not scored')
    expect(text).toContain('We could not read enough of the site to suggest a change.')
    expect(text).not.toContain('already in place')
    const page = readFileSync('app/ai-search/page.tsx', 'utf8')
    const form = readFileSync('app/ai-search/CheckForm.tsx', 'utf8')
    const email = readFileSync('lib/ai-check/email.ts', 'utf8')
    const pdfSource = readFileSync('lib/ai-check/pdf.ts', 'utf8')
    for (const text of [page, form, email, pdfSource]) {
      expect(text).not.toMatch(/—|DimeVision|App Orchid/i)
    }
    expect(form).not.toContain('defaultChecked')
    expect(form).toContain('What would help most')
    expect(form).not.toContain('Top fixes')
    expect(page).not.toContain('Call or text')
    expect(email).not.toContain('Call or text')
    expect(email).not.toContain('Top fixes')
    expect(pdfSource).toContain('Call (916) 404-6129')
    expect(pdfSource).toContain('What would help most')
  })

  it('prints quoted site text with spaces in the PDF', async () => {
    const report = buildReport(
      snapshot({
        html: html.replace('Plumber in Folsom.', 'local plumbing\u00A0expertise\u00A0to every job.'),
      }),
    )
    const pdf = Buffer.from(await renderReportPdf(report))
    const text = pdfPlainText(pdf)
    expect(text).toContain('plumbing expertise to')
    expect(text).not.toContain('plumbingexpertiseto')
    expect(text).toContain('What would help most')
    expect(text).toContain('Call (916) 404-6129')
    expect(text).toContain('Strong')
    expect(text).not.toMatch(/Call or text|Top fixes|—/)
  })
})

function pdfPlainText(pdf: Buffer): string {
  const latin = pdf.toString('latin1')
  let raw = latin
  for (const match of latin.matchAll(/stream\r?\n([\s\S]*?)endstream/g)) {
    try {
      raw += inflateSync(Buffer.from(match[1] ?? '', 'latin1')).toString('latin1')
    } catch {
      // A stream that is not compressed still leaves its literal text above.
    }
  }
  return raw.replace(/<([0-9A-Fa-f\s]+)>/g, (_, hex: string) => {
    const clean = hex.replace(/\s+/g, '')
    if (clean.length < 2 || clean.length % 2 !== 0) return ''
    let text = ''
    for (let index = 0; index < clean.length; index += 2) {
      const code = Number.parseInt(clean.slice(index, index + 2), 16)
      text += code >= 32 && code <= 126 ? String.fromCharCode(code) : ' '
    }
    return text
  })
}
