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

const NOTE =
  'This score is the share of points on signals the check actually measured. It is not a ranking in ChatGPT, Google AI Overviews, or Perplexity.'

export function buildReport(snapshot: Snapshot): CheckReport {
  const signals = buildSignals(snapshot)
  const measured = signals.filter((signal) => signal.status !== 'unmeasured')
  const earned = measured.filter((signal) => signal.status === 'pass').reduce((sum, signal) => sum + signal.points, 0)
  const possible = measured.reduce((sum, signal) => sum + signal.points, 0)
  const name = snapshot.businessName.trim() || titleText(snapshot.html) || hostOf(snapshot.finalUrl || snapshot.requestedUrl)
  return {
    businessName: name || 'This business',
    url: snapshot.finalUrl || snapshot.requestedUrl,
    cityTrade: snapshot.cityTrade,
    checkedAt: snapshot.checkedAt,
    score: possible === 0 ? null : Math.round((earned / possible) * 100),
    signals,
    passed: signals.filter((signal) => signal.status === 'pass'),
    fixes: signals
      .filter((signal) => signal.status === 'fail')
      .sort((a, b) => b.points - a.points)
      .slice(0, 3),
    note: NOTE,
  }
}

function buildSignals(snapshot: Snapshot): Signal[] {
  const html = snapshot.html
  const readable = html !== null
  return [
    httpsSignal(snapshot),
    readable ? viewportSignal(html) : unmeasured('viewport', 'Mobile viewport', POINTS.viewport, 'Add a viewport tag so the site fits a phone.'),
    readable ? titleSignal(html) : unmeasured('title', 'Page title', POINTS.title, 'Add a page title that names the business and the town.'),
    readable
      ? descriptionSignal(html)
      : unmeasured('description', 'Meta description', POINTS.description, 'Add a meta description that says what you do and where.'),
    readable ? h1Signal(html) : unmeasured('h1', 'Main heading', POINTS.h1, 'Add one clear heading that says what the business is.'),
    readable
      ? schemaSignal(html)
      : unmeasured('schema', 'LocalBusiness schema', POINTS.schema, 'Add LocalBusiness structured data with the name, address, and phone.'),
    readable
      ? napSignal(html, snapshot.businessName)
      : unmeasured('nap', 'Name, address, and phone', POINTS.nap, 'Put the business name, street address, and phone on the page.'),
    speedSignal(snapshot),
    robotsSignal(snapshot),
    llmsSignal(snapshot),
    sitemapSignal(snapshot),
  ]
}

function httpsSignal(snapshot: Snapshot): Signal {
  if (!snapshot.finalUrl) {
    return unmeasured('https', 'HTTPS', POINTS.https, 'Serve the site over HTTPS so the address starts with https.')
  }
  const pass = snapshot.finalUrl.startsWith('https://')
  return signal(
    'https',
    'HTTPS',
    POINTS.https,
    pass ? 'pass' : 'fail',
    pass ? 'The final address uses HTTPS.' : `The final address is ${snapshot.finalUrl}.`,
    'Serve the site over HTTPS so the address starts with https.',
  )
}

function viewportSignal(html: string): Signal {
  const content = metaContent(html, 'viewport')
  const pass = /width\s*=\s*device-width/i.test(content)
  return signal(
    'viewport',
    'Mobile viewport',
    POINTS.viewport,
    pass ? 'pass' : 'fail',
    pass ? 'The page sets a device-width viewport.' : 'No device-width viewport tag was found.',
    'Add a viewport tag so the site fits a phone.',
  )
}

function titleSignal(html: string): Signal {
  const title = titleText(html)
  return signal(
    'title',
    'Page title',
    POINTS.title,
    title ? 'pass' : 'fail',
    title ? `Title: ${clip(title)}` : 'The page has no title.',
    'Add a page title that names the business and the town.',
  )
}

function descriptionSignal(html: string): Signal {
  const description = metaContent(html, 'description')
  return signal(
    'description',
    'Meta description',
    POINTS.description,
    description.trim() ? 'pass' : 'fail',
    description.trim() ? `Description: ${clip(description.trim())}` : 'The page has no meta description.',
    'Add a meta description that says what you do and where.',
  )
}

function h1Signal(html: string): Signal {
  const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)
  const text = match ? visibleText(match[1] ?? '').replace(/\s+/g, ' ').trim() : ''
  return signal(
    'h1',
    'Main heading',
    POINTS.h1,
    text ? 'pass' : 'fail',
    text ? `Heading: ${clip(text)}` : 'The page has no H1.',
    'Add one clear heading that says what the business is.',
  )
}

function schemaSignal(html: string): Signal {
  const found = jsonLdNodes(html).some(hasLocalBusiness)
  return signal(
    'schema',
    'LocalBusiness schema',
    POINTS.schema,
    found ? 'pass' : 'fail',
    found ? 'A LocalBusiness (or a local subtype) is in the structured data.' : 'No LocalBusiness structured data was found.',
    'Add LocalBusiness structured data with the name, address, and phone.',
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
  const missing = [name ? '' : 'name', phone ? '' : 'phone', address ? '' : 'address'].filter(Boolean)
  return signal(
    'nap',
    'Name, address, and phone',
    POINTS.nap,
    pass ? 'pass' : 'fail',
    pass ? 'The page shows a business name, a phone number, and an address.' : `Missing on the page: ${missing.join(', ')}.`,
    'Put the business name, street address, and phone on the page.',
  )
}

function speedSignal(snapshot: Snapshot): Signal {
  if (snapshot.responseMs === null || snapshot.htmlBytes === null) {
    return unmeasured(
      'speed',
      'Page weight and response time',
      POINTS.speed,
      'Cut the page weight and the wait before the first bytes.',
    )
  }
  const pass = snapshot.responseMs <= SPEED_MS && snapshot.htmlBytes <= SPEED_BYTES
  return signal(
    'speed',
    'Page weight and response time',
    POINTS.speed,
    pass ? 'pass' : 'fail',
    `Response ${snapshot.responseMs} ms. HTML ${formatBytes(snapshot.htmlBytes)}. Pass is under ${SPEED_MS} ms and under ${formatBytes(SPEED_BYTES)}.`,
    'Cut the page weight and the wait before the first bytes.',
  )
}

function robotsSignal(snapshot: Snapshot): Signal {
  if (snapshot.robotsStatus === null) {
    return unmeasured('robots', 'robots.txt', POINTS.robots, 'Publish a robots.txt file.')
  }
  const body = snapshot.robotsBody?.trim() ?? ''
  const pass = snapshot.robotsStatus >= 200 && snapshot.robotsStatus < 300 && body.length > 0 && !body.startsWith('<')
  return signal(
    'robots',
    'robots.txt',
    POINTS.robots,
    pass ? 'pass' : 'fail',
    `robots.txt responded ${snapshot.robotsStatus}.`,
    'Publish a robots.txt file.',
  )
}

function llmsSignal(snapshot: Snapshot): Signal {
  if (snapshot.llmsStatus === null || snapshot.llmsBytes === null || snapshot.llmsText === null) {
    return unmeasured('llms', 'llms.txt', POINTS.llms, 'Publish an llms.txt file with a short description of the business.')
  }
  const pass =
    snapshot.llmsStatus >= 200 && snapshot.llmsStatus < 300 && snapshot.llmsBytes > 0 && snapshot.llmsText
  const detail = snapshot.llmsText
    ? `llms.txt responded ${snapshot.llmsStatus} (${formatBytes(snapshot.llmsBytes)}).`
    : `llms.txt responded ${snapshot.llmsStatus}, but the body is HTML rather than a text file.`
  return signal(
    'llms',
    'llms.txt',
    POINTS.llms,
    pass ? 'pass' : 'fail',
    detail,
    'Publish an llms.txt file with a short description of the business.',
  )
}

function sitemapSignal(snapshot: Snapshot): Signal {
  if (snapshot.sitemapStatus === null) {
    return unmeasured('sitemap', 'Sitemap', POINTS.sitemap, 'Publish a sitemap.xml file.')
  }
  const pass = snapshot.sitemapStatus >= 200 && snapshot.sitemapStatus < 300 && snapshot.sitemapXml === true
  return signal(
    'sitemap',
    'Sitemap',
    POINTS.sitemap,
    pass ? 'pass' : 'fail',
    `sitemap.xml responded ${snapshot.sitemapStatus}.`,
    'Publish a sitemap.xml file.',
  )
}

function signal(
  id: string,
  label: string,
  points: number,
  status: SignalStatus,
  detail: string,
  fix: string,
): Signal {
  return { id, label, points, status, detail, fix }
}

function unmeasured(id: string, label: string, points: number, fix: string): Signal {
  return signal(id, label, points, 'unmeasured', 'Not measured. The check could not read this.', fix)
}

function titleText(html: string | null): string {
  if (!html) return ''
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)
  return visibleText(match?.[1] ?? '').replace(/\s+/g, ' ').trim()
}

function metaContent(html: string, name: string): string {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? []
  for (const tag of tags) {
    const named = tag.match(/\b(?:name|property)\s*=\s*["']([^"']+)["']/i)
    if (!named || named[1]?.toLowerCase() !== name) continue
    const content = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)
    if (content?.[1]) return decode(content[1])
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
  return decode(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
}

function decode(value: string): string {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
}

function norm(value: string): string {
  return value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim()
}

function clip(value: string): string {
  return value.length > 140 ? `${value.slice(0, 137)}...` : value
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}
