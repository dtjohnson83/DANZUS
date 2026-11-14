import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  AI_HELP_DESCRIPTION,
  AI_HELP_FAQS,
  AI_HELP_PATH,
  AI_HELP_TITLE,
  FAQS,
  HOME_DESCRIPTION,
  HOME_TITLE,
  PACKAGE_SERVICES,
  SERVICE_AREA,
  aiHelpPageJsonLd,
  siteJsonLd,
} from '@/lib/site-schema'

const Bots = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'GoogleOther',
  'DuckDuckBot',
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
    expect(business?.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Folsom',
      addressRegion: 'CA',
      addressCountry: 'US',
    })
    expect(business?.address?.streetAddress).toBeUndefined()
    expect(JSON.stringify(business)).not.toContain('2108')
    expect(JSON.stringify(business)).not.toContain('95816')
    expect(business?.sameAs).toContain('https://linkedin.com/in/danjohnsondata')
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
    const homePage = graph.find((node) => node['@type'] === 'WebPage')
    expect(graph.filter((node) => node['@type'] === 'WebPage')).toHaveLength(1)
    expect(homePage?.url).toBe('https://danzus.co/')
    expect(homePage?.name).toBe(HOME_TITLE)
    expect(published).not.toContain('aggregateRating')
    expect(published).not.toContain('reviewCount')
    expect(published).not.toContain('2108 N St')
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
      'Do you help small businesses with AI?',
    ])
    expect(FAQS.at(-1)?.answer).toContain('AI help for small businesses')
    expect(FAQS.at(-1)?.answer).toContain('https://danzus.co/small-business-ai-help')
    expect(HOME_TITLE).toContain('AI help for small businesses')
    expect(HOME_DESCRIPTION).toContain('AI help for small businesses')
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
    const aiHelp = readFileSync('app/small-business-ai-help/page.tsx', 'utf8')
    const chatgptGuide = readFileSync('app/get-listed-in-chatgpt/page.tsx', 'utf8')
    for (const text of [HOME_TITLE, HOME_DESCRIPTION, AI_HELP_TITLE, AI_HELP_DESCRIPTION, llms, full, home, layout, aiSearch, aiHelp, chatgptGuide, terms, schema, agentReadiness, agentLlms]) {
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
    expect(llms).toContain('AI help for small businesses')
    expect(full).toContain('AI help for small businesses')
    expect(llms).toContain('https://danzus.co/small-business-ai-help')
    expect(full).toContain('https://danzus.co/small-business-ai-help')
    expect(llms).toContain('2108 N St #18348')
    expect(llms).toContain('not a shop to visit')
    expect(sitemap).toContain('https://danzus.co/')
    expect(sitemap).toContain('https://danzus.co/small-business-ai-help')
    expect(sitemap).toContain('<lastmod>2026-11-06</lastmod>')
    expect(sitemap).toContain('<loc>https://danzus.co/privacy</loc>\n    <lastmod>2026-11-04</lastmod>')
    expect(sitemap).toContain('<loc>https://danzus.co/terms</loc>\n    <lastmod>2026-11-04</lastmod>')
    expect(sitemap).toContain('<loc>https://danzus.co/cancel</loc>\n    <lastmod>2026-11-04</lastmod>')
    expect(sitemap).toContain('<loc>https://danzus.co/unsubscribe</loc>\n    <lastmod>2026-11-04</lastmod>')
    expect(sitemap).toContain('https://danzus.co/ai-search')
    expect(sitemap).toContain('https://danzus.co/get-listed-in-chatgpt')
    expect(sitemap).toContain('<loc>https://danzus.co/get-listed-in-chatgpt</loc>\n    <lastmod>2026-11-10</lastmod>')
    expect(llms).toContain('https://danzus.co/get-listed-in-chatgpt')
    expect(full).toContain('https://danzus.co/get-listed-in-chatgpt')
    expect(sitemap).toContain('https://danzus.co/privacy')
    expect(sitemap).toContain('https://danzus.co/terms')
    expect(sitemap).not.toContain('agent-readiness')
    expect(sitemap).not.toContain('family-agent')
    expect(sitemap).not.toContain('contextkit')
  })

  it('publishes one AI help page with the offer, towns, prices, and FAQ', () => {
    const page = readFileSync('app/small-business-ai-help/page.tsx', 'utf8')
    const css = readFileSync('app/small-business-ai-help/ai-help.module.css', 'utf8')
    const nav = readFileSync('app/PrimaryNav.tsx', 'utf8')
    const mobile = readFileSync('app/MobileNav.tsx', 'utf8')
    const home = readFileSync('app/page.tsx', 'utf8')
    const aiSearch = readFileSync('app/ai-search/page.tsx', 'utf8')
    expect(page).toContain('AI help for small businesses in Sacramento and Folsom')
    expect(page).toContain('Roseville')
    expect(page).toContain('El Dorado Hills')
    expect(page).toContain('not a shop to visit')
    expect(page).toContain("groupId: 'textback-pricing'")
    expect(page).toContain("groupId: 'website-pricing'")
    expect(page).toContain("groupId: 'search-pricing'")
    expect(page).toContain("groupId: 'growth-pricing'")
    expect(page).toContain('CheckoutGroup {...payGroup(offer.groupId)}')
    expect(page).not.toContain('aggregateRating')
    expect(css).not.toContain('100svh')
    expect(css).not.toContain('100vh')
    expect(nav).toContain('href="/small-business-ai-help"')
    expect(nav).toContain('AI help')
    expect(mobile).toContain('href="/small-business-ai-help"')
    expect(home).toContain('href="/small-business-ai-help"')
    expect(home).toContain('Never miss another lead.')
    expect(aiSearch).toContain('href="/small-business-ai-help"')
    expect(aiSearch).toContain('AI help for small businesses')
    expect(AI_HELP_PATH).toBe('/small-business-ai-help')
    expect(AI_HELP_TITLE).toContain('AI help for small businesses')
    expect(AI_HELP_DESCRIPTION).toContain('small business AI help')
    expect(AI_HELP_FAQS.map((item) => item.question)).toEqual([
      'Do you help small businesses with AI?',
      'What is that help?',
      'Which towns do you cover?',
      'How do I start?',
    ])
    for (const price of ['$99', '$1,500', '$49', '$199', '$299', '$750']) {
      expect(AI_HELP_FAQS[1]?.answer).toContain(price)
    }
    const helpGraph = aiHelpPageJsonLd()['@graph'] as Array<Record<string, any>>
    const helpTypes = helpGraph.map((node) => node['@type'])
    expect(helpTypes).toContainEqual(['Organization', 'LocalBusiness', 'ProfessionalService'])
    expect(helpGraph.some((node) => node['@type'] === 'FAQPage')).toBe(true)
    expect(helpGraph.find((node) => node['@type'] === 'FAQPage')?.mainEntity).toHaveLength(AI_HELP_FAQS.length)
    expect(JSON.stringify(helpGraph)).not.toContain('aggregateRating')
    const helpBusiness = helpGraph.find((node) => Array.isArray(node['@type']))
    expect(helpBusiness?.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Folsom',
      addressRegion: 'CA',
      addressCountry: 'US',
    })
    expect(helpBusiness?.telephone).toBe('+1-916-404-6129')
    expect(helpBusiness?.email).toBe('dan@danzus.co')
    const helpServices = helpGraph.filter((node) => node['@type'] === 'Service').map((node) => node.name)
    expect(helpServices).toEqual(['Missed-call text-back', 'Website', 'Google and AI search', 'DANZUS Growth'])
    expect(helpServices).not.toContain('Lead to Booked Job')
    const helpPage = helpGraph.find((node) => node['@type'] === 'WebPage')
    expect(helpPage?.url).toBe('https://danzus.co/small-business-ai-help')
    expect(JSON.stringify(helpGraph)).not.toContain('2108')
  })

  it('publishes a ChatGPT listing guide with steps, caveats, and a free check', () => {
    const page = readFileSync('app/get-listed-in-chatgpt/page.tsx', 'utf8')
    const footer = readFileSync('app/SiteFooter.tsx', 'utf8')
    const aiSearch = readFileSync('app/ai-search/page.tsx', 'utf8')
    expect(page).toContain('How to get a small business listed in ChatGPT')
    expect(page).toContain('chatgpt.com/business-hub')
    expect(page).toContain('Coming Soon')
    expect(page).toContain('does not guarantee')
    expect(page).toContain('does not promise rankings')
    expect(page).toContain('Business Agents are only for US e-commerce')
    expect(page).toContain('$199')
    expect(page).toContain('$299')
    expect(page).toContain('$1,500')
    expect(page).toContain('href="/ai-search#check"')
    expect(page).toContain('Free AI Search Check')
    expect(page).toContain("'@type': 'HowTo'")
    expect(page).not.toContain('aggregateRating')
    expect(page).not.toContain('—')
    expect(footer).toContain('href="/get-listed-in-chatgpt"')
    expect(aiSearch).toContain('href="/get-listed-in-chatgpt"')
  })
})
