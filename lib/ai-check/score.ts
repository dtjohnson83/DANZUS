import { checkCopy, normalizeSpaces, openingLine, READINESS_NOTE, scoreLabel, scoreMeaning, type CheckId } from '@/lib/ai-check/copy'
import type { CheckReport, Signal, SignalStatus, Snapshot } from '@/lib/ai-check/types'

export const SPEED_MS = 2000
export const SPEED_BYTES = 1_500_000

const POINTS = {
  https: 10,
  viewport: 10,
  title: 8,
  description: 8,
  h1: 8,
  schema: 14,
  nap: 14,
  speed: 10,
  robots: 6,
  llms: 6,
  sitemap: 6,
} as const

const LOCAL_TYPES = new Set([
  'LocalBusiness',
  'Plumber',
  'Electrician',
  'HVACBusiness',
  'RoofingContractor',
  'GeneralContractor',
  'HomeAndConstructionBusiness',
  'Locksmith',
  'HousePainter',
  'AutoRepair',
  'AutoBodyShop',
  'AutomotiveBusiness',
  'HairSalon',
  'BeautySalon',
  'NailSalon',
  'BarberShop',
  'HealthAndBeautyBusiness',
  'Dentist',
  'MedicalBusiness',
  'Attorney',
  'LegalService',
  'ProfessionalService',
  'Restaurant',
  'Store',
  'MovingCompany',
  'RealEstateAgent',
  'FoodEstablishment',
])

export function buildReport(snapshot: Snapshot): CheckReport {
  const signals = buildSignals(snapshot)
  const measured = signals.filter((signal) => signal.status !== 'unmeasured')
  const earned = measured.filter((signal) => signal.status === 'pass').reduce((sum, signal) => sum + signal.points, 0)
  const possible = measured.reduce((sum, signal) => sum + signal.points, 0)
  const name = snapshot.businessName.trim() || titleText(snapshot.html) || hostOf(snapshot.finalUrl || snapshot.requestedUrl)
  const score = possible === 0 ? null : Math.round((earned / possible) * 100)
  return {
    businessName: name || 'This business',
    url: snapshot.finalUrl || snapshot.requestedUrl,
    cityTrade: snapshot.cityTrade,
    checkedAt: snapshot.checkedAt,
    score,
    scoreLabel: scoreLabel(score),
    meaning: scoreMeaning(score),
    opening: openingLine(snapshot.cityTrade),
    signals,
    passed: signals.filter((signal) => signal.status === 'pass'),
    fixes: signals
      .filter((signal) => signal.status === 'fail')
      .sort((a, b) => b.points - a.points)
      .slice(0, 3),
    note: READINESS_NOTE,
  }
}

function buildSignals(snapshot: Snapshot): Signal[] {
  const html = snapshot.html
  const readable = html !== null
  return [
    httpsSignal(snapshot),
    readable ? viewportSignal(html) : unmeasured('viewport'),
    readable ? titleSignal(html) : unmeasured('title'),
    readable ? descriptionSignal(html) : unmeasured('description'),
    readable ? h1Signal(html) : unmeasured('h1'),
    readable ? schemaSignal(html) : unmeasured('schema'),
    readable ? napSignal(html, snapshot.businessName) : unmeasured('nap'),
    speedSignal(snapshot),
    robotsSignal(snapshot),
    llmsSignal(snapshot),
    sitemapSignal(snapshot),
  ]
}

function httpsSignal(snapshot: Snapshot): Signal {
  if (!snapshot.finalUrl) return unmeasured('https')
  const pass = snapshot.finalUrl.startsWith('https://')
  return done('https', pass, pass ? 'The address shows a secure connection.' : 'The address does not show the padlock.')
}

function viewportSignal(html: string): Signal {
  const content = metaContent(html, 'viewport')
  const pass = /width\s*=\s*device-width/i.test(content)
  return done('viewport', pass, pass ? 'The page is set to fit a phone screen.' : 'The page is not set to fit a phone screen.')
}

function titleSignal(html: string): Signal {
  const title = titleText(html)
  return done('title', Boolean(title), title ? `The title says: "${clip(title)}".` : 'The page does not have a title yet.')
}

function descriptionSignal(html: string): Signal {
  const description = normalizeSpaces(metaContent(html, 'description'))
  return done(
    'description',
    Boolean(description),
    description ? `The summary says: "${clip(description)}".` : 'The page does not have a short summary yet.',
  )
}

function h1Signal(html: string): Signal {
  const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)
  const text = match ? visibleText(match[1] ?? '') : ''
  return done('h1', Boolean(text), text ? `The headline says: "${clip(text)}".` : 'The page does not have a clear headline yet.')
}

function schemaSignal(html: string): Signal {
  const found = jsonLdNodes(html).some(hasLocalBusiness)
  return done(
    'schema',
    found,
    found
      ? 'Your name, phone, and address are on the page in a form these tools can read.'
      : 'These tools cannot read a clean set of your business details.',
  )
}

function napSignal(html: string, businessName: string): Signal {
  const text = visibleText(html)
  const nodes = jsonLdNodes(html)
  const schemaText = nodes.map((node) => JSON.stringify(node)).join(' ')
  const name = namePresent(`${text} ${schemaText}`, businessName)
  const phone = phonePresent(`${text} ${schemaText}`)
  const address = addressPresent(text, nodes)
  const pass = name && phone && address
  const missing = [name ? '' : 'the name', phone ? '' : 'the phone', address ? '' : 'the address'].filter(Boolean)
  const detail = pass
    ? 'The page shows a business name, a phone number, and an address.'
    : `The page is missing ${plainList(missing)}.`
  return done('nap', pass, detail)
}

function speedSignal(snapshot: Snapshot): Signal {
  if (snapshot.responseMs === null || snapshot.htmlBytes === null) return unmeasured('speed')
  const pass = snapshot.responseMs <= SPEED_MS && snapshot.htmlBytes <= SPEED_BYTES
  return done('speed', pass, pass ? 'The page opens quickly.' : 'The page is slow to open.')
}

function robotsSignal(snapshot: Snapshot): Signal {
  if (snapshot.robotsStatus === null) return unmeasured('robots')
  const body = snapshot.robotsBody?.trim() ?? ''
  const pass = snapshot.robotsStatus >= 200 && snapshot.robotsStatus < 300 && body.length > 0 && !body.startsWith('<')
  return done(
    'robots',
    pass,
    pass ? 'Search engines are welcome to read the site.' : 'Search engines may not be able to read the site.',
  )
}

function llmsSignal(snapshot: Snapshot): Signal {
  if (snapshot.llmsStatus === null || snapshot.llmsBytes === null || snapshot.llmsText === null) return unmeasured('llms')
  const pass = snapshot.llmsStatus >= 200 && snapshot.llmsStatus < 300 && snapshot.llmsBytes > 0 && snapshot.llmsText
  return done(
    'llms',
    pass,
    pass ? 'A short summary for AI assistants is on the site.' : 'There is no short summary written for AI assistants.',
  )
}

function sitemapSignal(snapshot: Snapshot): Signal {
  if (snapshot.sitemapStatus === null) return unmeasured('sitemap')
  const pass = snapshot.sitemapStatus >= 200 && snapshot.sitemapStatus < 300 && snapshot.sitemapXml === true
  return done(
    'sitemap',
    pass,
    pass ? 'Search engines have a list of the pages.' : 'Search engines do not have a list of all the pages.',
  )
}

function done(id: CheckId, pass: boolean, detail: string): Signal {
  const copy = checkCopy(id)
  return signal(id, copy.label, POINTS[id], pass ? 'pass' : 'fail', detail, copy.benefit)
}

function signal(
  id: string,
  label: string,
  points: number,
  status: SignalStatus,
  detail: string,
  benefit: string,
): Signal {
  return { id, label, points, status, detail, benefit, fix: benefit }
}

function unmeasured(id: CheckId): Signal {
  const copy = checkCopy(id)
  return signal(id, copy.label, POINTS[id], 'unmeasured', 'We could not read this part of the site.', copy.benefit)
}

function titleText(html: string | null): string {
  if (!html) return ''
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)
  return visibleText(match?.[1] ?? '')
}

function metaContent(html: string, name: string): string {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? []
  for (const tag of tags) {
    const named = tag.match(/\b(?:name|property)\s*=\s*["']([^"']+)["']/i)
    if (!named || named[1]?.toLowerCase() !== name) continue
    const content = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)
    if (content?.[1]) return normalizeSpaces(decode(content[1]))
  }
  return ''
}

function jsonLdNodes(html: string): unknown[] {
  const nodes: unknown[] = []
  const pattern = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  for (const match of html.matchAll(pattern)) {
    try {
      nodes.push(JSON.parse(match[1] ?? ''))
    } catch {
      // Ignore a broken block. Other blocks can still count.
    }
  }
  return nodes
}

function hasLocalBusiness(node: unknown): boolean {
  if (Array.isArray(node)) return node.some(hasLocalBusiness)
  if (!node || typeof node !== 'object') return false
  const record = node as Record<string, unknown>
  const types = Array.isArray(record['@type']) ? record['@type'] : record['@type'] ? [record['@type']] : []
  if (types.some((type) => typeof type === 'string' && (type === 'LocalBusiness' || LOCAL_TYPES.has(type)))) return true
  if (Array.isArray(record['@graph']) && hasLocalBusiness(record['@graph'])) return true
  return false
}

function namePresent(text: string, businessName: string): boolean {
  const want = norm(businessName)
  const hay = norm(text)
  if (!want) return /[a-z]{3,}/.test(hay)
  if (hay.includes(want)) return true
  const words = want.split(' ').filter((word) => word.length > 2)
  return words.length > 0 && words.every((word) => hay.includes(word))
}

function phonePresent(text: string): boolean {
  return /(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]\d{4}/.test(text)
}

function addressPresent(text: string, nodes: unknown[]): boolean {
  if (/\b\d{1,6}\s+[a-z0-9.'-]+\s+(?:st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|way|ln|lane|ct|court|pkwy|parkway)\b/i.test(text)) {
    return true
  }
  if (/\b\d{5}(?:-\d{4})?\b/.test(text)) return true
  return nodes.some(hasStreet)
}

function hasStreet(node: unknown): boolean {
  if (Array.isArray(node)) return node.some(hasStreet)
  if (!node || typeof node !== 'object') return false
  const record = node as Record<string, unknown>
  const address = record.address
  if (address && typeof address === 'object' && 'streetAddress' in address) {
    const street = (address as { streetAddress?: unknown }).streetAddress
    if (typeof street === 'string' && street.trim()) return true
  }
  if (Array.isArray(record['@graph'])) return hasStreet(record['@graph'])
  return false
}

function visibleText(html: string): string {
  return normalizeSpaces(
    decode(
      html
        .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' '),
    ),
  )
}

function decode(value: string): string {
  return value
    .replace(/&nbsp;|&#160;|&#x0*a0;/gi, ' ')
    .replace(/&#(\d+);/g, (_, digits: string) => character(Number(digits)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => character(parseInt(hex, 16)))
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
}

function character(code: number): string {
  if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff) return ''
  if (code === 0xa0 || code === 0x1680 || (code >= 0x2000 && code <= 0x200a) || code === 0x202f || code === 0x205f || code === 0x3000) {
    return ' '
  }
  return String.fromCodePoint(code)
}

function norm(value: string): string {
  return value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim()
}

function clip(value: string): string {
  const text = normalizeSpaces(value)
  return text.length > 140 ? `${text.slice(0, 137)}...` : text
}

function plainList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}
