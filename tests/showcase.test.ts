import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { RESULTS } from '@/config/results'
import { HERO_LOOP } from '@/app/hero-loop'
import { TRADES } from '@/app/sample-sites/trades'
import { CONTACT_PHONE_TEL } from '@/app/site'

describe('sample sites and home extras', () => {
  it('links four invented trades and calls the DANZUS line', () => {
    expect(TRADES.map((trade) => trade.path)).toEqual(['/demo/plumber', '/demo/hvac', '/demo/auto', '/demo/salon'])
    expect(TRADES.map((trade) => trade.name)).toEqual([
      'Ridgeline Plumbing Co.',
      'Comfort Peak Heating & Air',
      'Oak Avenue Auto Works',
      'Willow & Brass Studio',
    ])
    expect(CONTACT_PHONE_TEL).toBe('tel:+19164046129')
    const copy = JSON.stringify(TRADES)
    expect(copy).not.toMatch(/—|DimeVision|App Orchid|GoHighLevel/i)
  })

  it('keeps demo pages out of the sitemap and leaves robots open', () => {
    const sitemap = readFileSync('public/sitemap.xml', 'utf8')
    const robots = readFileSync('public/robots.txt', 'utf8')
    expect(sitemap).not.toContain('/demo')
    expect(robots).toContain('Allow: /')
    expect(robots).not.toContain('Disallow: /demo')
  })

  it('ships an empty results list and a swappable hero loop', () => {
    expect(RESULTS).toEqual([])
    expect(HERO_LOOP.poster).toBe('/hero-loop-poster.svg')
    expect(HERO_LOOP).toHaveProperty('mp4')
    expect(HERO_LOOP).toHaveProperty('webm')
  })
})
