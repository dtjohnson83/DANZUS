export const CHECKS = [
  {
    id: 'https',
    label: 'Secure site (the padlock)',
    benefit: 'People are more willing to trust the page and call.',
  },
  {
    id: 'viewport',
    label: 'Looks right on phones',
    benefit: 'Customers can read the page and tap to call.',
  },
  {
    id: 'title',
    label: 'A clear page title',
    benefit: 'The shop name and the town can show up when someone searches.',
  },
  {
    id: 'description',
    label: 'A short summary under the name',
    benefit: 'Search results can say what you do and where you work.',
  },
  {
    id: 'h1',
    label: 'A clear headline',
    benefit: 'The first line tells people what the business is.',
  },
  {
    id: 'schema',
    label: 'Google and AI can read your business details',
    benefit: 'They can recommend you with the right phone and address.',
  },
  {
    id: 'nap',
    label: 'Your name, address, and phone',
    benefit: 'People can match the shop to the right number and location.',
  },
  {
    id: 'speed',
    label: 'Loads fast',
    benefit: 'People stay instead of leaving while the page is still opening.',
  },
  {
    id: 'robots',
    label: 'Search engines can find your pages',
    benefit: 'Google is welcome to read the site and show it to people.',
  },
  {
    id: 'llms',
    label: 'A short summary written for AI assistants',
    benefit: 'ChatGPT and similar tools get a plain description of the shop.',
  },
  {
    id: 'sitemap',
    label: 'Search engines can find all your pages',
    benefit: 'Google can reach every page, not only the home page.',
  },
] as const

export type CheckId = (typeof CHECKS)[number]['id']

export const READINESS_NOTE =
  'This is a readiness check of the public website. It is not a ranking in ChatGPT, Google, or any other AI answer.'

const MEANING = {
  Strong: 'The basics are in place for these tools to name you.',
  Good: 'A few gaps could keep you off the short list.',
  'Needs work': 'Important details are missing, so these tools may skip you.',
  'Not scored': 'We could not read the website, so there is no score.',
} as const

export function checkCopy(id: CheckId) {
  const found = CHECKS.find((item) => item.id === id)
  if (!found) throw new Error(`Unknown check: ${id}`)
  return found
}

export function scoreLabel(score: number | null): keyof typeof MEANING {
  if (score === null) return 'Not scored'
  if (score >= 90) return 'Strong'
  if (score >= 50) return 'Good'
  return 'Needs work'
}

export function scoreMeaning(score: number | null): string {
  return MEANING[scoreLabel(score)]
}

export function openingLine(cityTrade: string): string {
  const raw = normalizeSpaces(cityTrade)
  const parts = raw.split(',').map((part) => part.trim()).filter(Boolean)
  if (parts.length >= 2) {
    const city = parts[0] ?? ''
    const trade = parts.slice(1).join(' ')
    return `When people ask ChatGPT or Google for ${tradePhrase(trade)} in ${city}, here's how ready your website is to be recommended.`
  }
  if (raw) {
    return `When people ask ChatGPT or Google about ${raw}, here's how ready your website is to be recommended.`
  }
  return "When people ask ChatGPT or Google for a local shop like yours, here's how ready your website is to be recommended."
}

export function normalizeSpaces(value: string): string {
  return value
    .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ')
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function tradePhrase(trade: string): string {
  if (/^[A-Z0-9]{2,}(?:\s+[A-Z0-9]{2,})*$/.test(trade)) return trade
  return `${/^[aeiou]/i.test(trade) ? 'an' : 'a'} ${trade}`
}
