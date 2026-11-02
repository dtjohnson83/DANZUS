import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { FAQS, HOME_DESCRIPTION, HOME_TITLE, PACKAGE_SERVICES, SERVICE_AREA, siteJsonLd } from '@/lib/site-schema'

const Bots = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
]

describe('search metadata', () => {
  const graph = siteJsonLd()['@graph'] as Array<Record<string, any>>
  const types = graph.map((node) => node['@type'])

  it('publishes organization, local business, services, FAQ, videos, and Dan', () => {
    expect(types).toContainEqual(['Organization', 'LocalBusiness', 'ProfessionalService'])
    expect(graph.filter((node) => node['@type'] === 'Service')).toHaveLength(PACKAGE_SERVICES.length)
    expect(graph.some((node) => node['@type'] === 'FAQPage')).toBe(true)
    expect(graph.filter((node) => node['@type'] === 'VideoObject')).toHaveLength(5)
    expect(graph.some((node) => node['@type'] === 'Person' && node.name === 'Dan Johnson')).toBe(true)
  })

  it('uses the published price ranges and the Sacramento-area cities', () => {
    const business = graph.find((node) => Array.isArray(node['@type']))
    expect(business?.legalName).toBe('DANZUS Holdings LLC')
    expect(business?.telephone).toBe('+1-916-404-6129')
    expect(business?.email).toBe('dan@danzus.co')
    expect(business?.areaServed?.map((place: { name: string }) => place.name)).toEqual([
      ...SERVICE_AREA,
      'Sacramento region, California',
    ])
    const lead = graph.find((node) => node['@type'] === 'Service' && node.name === 'Lead to Booked Job')
    expect(lead?.offers).toMatchObject({ lowPrice: '200', highPrice: '600', priceCurrency: 'USD' })
    const website = graph.find((node) => node['@type'] === 'Service' && node.name === 'Website')
    expect(website?.offers).toMatchObject({ lowPrice: '1500', priceCurrency: 'USD' })
    expect(website?.offers.highPrice).toBeUndefined()
    const search = graph.find((node) => node['@type'] === 'Service' && node.name === 'SEO and AI search')
    expect(search?.offers).toMatchObject({ lowPrice: '300', unitText: 'MONTH', priceCurrency: 'USD' })
    const listing = graph.find((node) => node['@type'] === 'Service' && node.name === 'Google Business Profile and AI listing')
    expect(listing?.offers).toMatchObject({ lowPrice: '150', unitText: 'MONTH', priceCurrency: 'USD' })
    const video = graph.find((node) => node['@type'] === 'VideoObject')
    expect(video?.duration).toBe('PT1M15S')
    expect(video?.contentUrl).toMatch(/\.mp4$/)
    expect(video?.thumbnailUrl).toMatch(/-poster\.jpg$/)
    expect(FAQS.map((item) => item.question)).toEqual([
      'What does it cost?',
      'How long does setup take?',
      'Do I need new software?',
      'Is it secure?',
      'What if the AI says something wrong?',
      'Do you work in person?',
    ])
  })

  it('keeps DimeVision and App Orchid out of titles, descriptions, and llms files', () => {
    const llms = readFileSync('public/llms.txt', 'utf8')
    const full = readFileSync('public/llms-full.txt', 'utf8')
    const robots = readFileSync('public/robots.txt', 'utf8')
    const sitemap = readFileSync('public/sitemap.xml', 'utf8')
    for (const text of [HOME_TITLE, HOME_DESCRIPTION, llms, full]) {
      expect(text.toLowerCase()).not.toContain('dimevision')
      expect(text.toLowerCase()).not.toContain('app orchid')
    }
    for (const bot of Bots) {
      expect(robots).toContain(`User-agent: ${bot}`)
      expect(robots).toMatch(new RegExp(`User-agent: ${bot}\\nAllow: /`))
    }
    expect(sitemap).toContain('https://danzus.co/')
    expect(sitemap).toContain('https://danzus.co/privacy')
    expect(sitemap).toContain('https://danzus.co/terms')
    expect(sitemap).not.toContain('agent-readiness')
    expect(sitemap).not.toContain('family-agent')
    expect(sitemap).not.toContain('contextkit')
  })
})
