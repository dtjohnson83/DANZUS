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
    const textBack = graph.find((node) => node['@type'] === 'Service' && node.name === 'Missed-call text-back')
    expect(textBack?.offers).toMatchObject({ '@type': 'Offer', price: '99', unitText: 'MONTH', priceCurrency: 'USD' })
    expect(textBack?.offers.description).toContain('30-day pilot')
    expect(textBack?.offers.description).not.toMatch(/149/)
    const website = graph.find((node) => node['@type'] === 'Service' && node.name === 'Website')
    expect(website?.offers).toMatchObject({ '@type': 'Offer', price: '1500', priceCurrency: 'USD' })
    expect(website?.offers.unitText).toBeUndefined()
    expect(website?.offers.description).toContain('$49')
    expect(website?.offers.description).toContain('You keep the site')
    const search = graph.find((node) => node['@type'] === 'Service' && node.name === 'Google and AI search')
    expect(search?.offers).toMatchObject({ price: '199', unitText: 'MONTH', priceCurrency: 'USD' })
    const growth = graph.find((node) => node['@type'] === 'Service' && node.name === 'DANZUS Growth')
    expect(growth?.offers).toMatchObject({ price: '299', unitText: 'MONTH', priceCurrency: 'USD' })
    expect(growth?.offers.description).toContain('$750')
    const lead = graph.find((node) => node['@type'] === 'Service' && node.name === 'Lead to Booked Job')
    expect(lead?.offers).toBeUndefined()
    const published = JSON.stringify(graph)
    expect(published).not.toMatch(/\$149|\$150 a month|\$300 a month|\$200 to \$300|\$400 to \$600/)
    expect(FAQS[0]?.answer).toContain('$99')
    expect(FAQS[0]?.answer).toContain('$1,500')
    expect(FAQS[0]?.answer).toContain('$49')
    expect(FAQS[0]?.answer).toContain('$199')
    expect(FAQS[0]?.answer).toContain('$299')
    expect(FAQS[0]?.answer).toContain('$750')
    expect(FAQS[0]?.answer).not.toMatch(/\$149/)
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
    const home = `${readFileSync('app/page.tsx', 'utf8')}\n${readFileSync('app/pay-choices.tsx', 'utf8')}`
    const layout = readFileSync('app/layout.tsx', 'utf8')
    const aiSearch = readFileSync('app/ai-search/page.tsx', 'utf8')
    const terms = readFileSync('app/terms/page.tsx', 'utf8')
    const schema = readFileSync('lib/site-schema.ts', 'utf8')
    const agentReadiness = readFileSync('app/agent-readiness/page.tsx', 'utf8')
    const agentLlms = readFileSync('public/agent-readiness/llms.txt', 'utf8')
    for (const text of [HOME_TITLE, HOME_DESCRIPTION, llms, full, home, layout, aiSearch, terms, schema, agentReadiness, agentLlms]) {
      expect(text.toLowerCase()).not.toContain('dimevision')
      expect(text.toLowerCase()).not.toContain('app orchid')
      expect(text.toLowerCase()).not.toContain('gohighlevel')
      expect(text).not.toContain('—')
      expect(text).not.toMatch(/\$149/)
      expect(text).not.toMatch(/\$150\/mo|\$300\/mo|\$200 to \$300|\$400 to \$600|starting ranges/i)
    }
    for (const text of [llms, full, home, HOME_DESCRIPTION]) {
      expect(text).toContain('$99')
      expect(text).toContain('$1,500')
      expect(text).toContain('$49')
      expect(text).toContain('$199')
      expect(text).toContain('$299')
      expect(text).toContain('$750')
    }
    for (const bot of Bots) {
      expect(robots).toContain(`User-agent: ${bot}`)
      expect(robots).toMatch(new RegExp(`User-agent: ${bot}\\nAllow: /`))
    }
    expect(sitemap).toContain('https://danzus.co/')
    expect(sitemap).toContain('https://danzus.co/ai-search')
    expect(sitemap).toContain('https://danzus.co/privacy')
    expect(sitemap).toContain('https://danzus.co/terms')
    expect(sitemap).not.toContain('agent-readiness')
    expect(sitemap).not.toContain('family-agent')
    expect(sitemap).not.toContain('contextkit')
  })
})
