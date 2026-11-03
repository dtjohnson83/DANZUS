import { assertPublicHttpUrl } from '@/lib/ai-check/guard'
import type { Snapshot } from '@/lib/ai-check/types'

const PAGE_LIMIT = 1_500_000
const FILE_LIMIT = 200_000
const TIMEOUT_MS = 8000
const HOPS = 4

const USER_AGENT = 'DANZUS-AI-Check/1.0 (+https://danzus.co/ai-search)'

export async function measureSite(input: {
  url: string
  businessName: string
  cityTrade?: string
  now?: Date
}): Promise<Snapshot> {
  const started = input.now ?? new Date()
  const page = await fetchPage(input.url)
  const origin = page.finalUrl ? new URL(page.finalUrl).origin : null
  const [robots, llms, sitemap] = origin
    ? await Promise.all([readSmall(`${origin}/robots.txt`), readSmall(`${origin}/llms.txt`), readSmall(`${origin}/sitemap.xml`)])
    : [null, null, null]
  return {
    requestedUrl: input.url,
    finalUrl: page.finalUrl,
    html: page.html,
    status: page.status,
    responseMs: page.responseMs,
    htmlBytes: page.htmlBytes,
    robotsStatus: robots?.status ?? null,
    robotsBody: robots ? robots.text.slice(0, 4000) : null,
    llmsStatus: llms?.status ?? null,
    llmsBytes: llms?.bytes ?? null,
    llmsText: llms ? !llms.text.trim().startsWith('<') : null,
    sitemapStatus: sitemap?.status ?? null,
    sitemapXml: sitemap ? /<(urlset|sitemapindex)\b/i.test(sitemap.text) : null,
    businessName: input.businessName,
    cityTrade: input.cityTrade?.trim() ?? '',
    checkedAt: started.toISOString(),
  }
}

async function fetchPage(raw: string): Promise<{
  finalUrl: string | null
  html: string | null
  status: number | null
  responseMs: number | null
  htmlBytes: number | null
}> {
  const started = Date.now()
  try {
    let current = await assertPublicHttpUrl(raw)
    for (let hop = 0; hop < HOPS; hop += 1) {
      const response = await fetch(current, {
        redirect: 'manual',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { accept: 'text/html,application/xhtml+xml', 'user-agent': USER_AGENT },
      })
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location')
        if (!location) break
        current = await assertPublicHttpUrl(new URL(location, current).href)
        continue
      }
      const body = await readBody(response, PAGE_LIMIT)
      return {
        finalUrl: current.href,
        html: body.text,
        status: response.status,
        responseMs: Date.now() - started,
        htmlBytes: body.truncated ? PAGE_LIMIT + 1 : body.bytes,
      }
    }
    return { finalUrl: current.href, html: null, status: null, responseMs: Date.now() - started, htmlBytes: null }
  } catch {
    return { finalUrl: null, html: null, status: null, responseMs: null, htmlBytes: null }
  }
}

async function readSmall(url: string): Promise<{ status: number; text: string; bytes: number } | null> {
  try {
    const target = await assertPublicHttpUrl(url)
    const response = await fetch(target, {
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'user-agent': USER_AGENT },
    })
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      if (!location) return { status: response.status, text: '', bytes: 0 }
      return readSmall(new URL(location, target).href)
    }
    const body = await readBody(response, FILE_LIMIT)
    return { status: response.status, text: body.text, bytes: body.bytes }
  } catch {
    return null
  }
}

async function readBody(response: Response, max: number): Promise<{ text: string; bytes: number; truncated: boolean }> {
  const reader = response.body?.getReader()
  if (!reader) {
    const text = await response.text()
    return { text: text.slice(0, max), bytes: Buffer.byteLength(text), truncated: Buffer.byteLength(text) > max }
  }
  const chunks: Uint8Array[] = []
  let bytes = 0
  let truncated = false
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (!value) continue
    if (bytes + value.byteLength > max) {
      chunks.push(value.slice(0, max - bytes))
      bytes = max
      truncated = true
      await reader.cancel()
      break
    }
    chunks.push(value)
    bytes += value.byteLength
  }
  return { text: Buffer.concat(chunks).toString('utf8'), bytes, truncated }
}
