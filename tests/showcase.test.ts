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

  it('keeps a full-bleed hero and natural scroll', () => {
    const css = readFileSync('app/home.module.css', 'utf8')
    const page = readFileSync('app/page.tsx', 'utf8')
    const nav = readFileSync('app/MobileNav.tsx', 'utf8')
    expect(page).toContain('Never miss another lead.')
    expect(page).toContain('You were under a sink. The lead texted the next guy.')
    expect(page).toContain('Sacramento, Roseville, and El Dorado Hills')
    expect(page).not.toContain('BOOKED.')
    expect(page).not.toContain('storyPin')
    expect(css).not.toContain('240vh')
    expect(css).not.toContain('animation-timeline')
    expect(css).toContain('100svh')
    expect(nav).toContain('Open menu')
    expect(nav).toContain('aria-expanded')
    expect(nav).toContain('#work')
  })

  it('ships an empty results list and the approved hero loop', () => {
    expect(RESULTS).toEqual([])
    expect(HERO_LOOP.poster).toBe(
      'https://ic048emi0kpty2jd.public.blob.vercel-storage.com/demos/hero/danzus-hero-poster.webp',
    )
    expect(HERO_LOOP.posterJpg).toContain('danzus-hero-poster.jpg')
    expect(HERO_LOOP.mp4).toContain('danzus-hero.mp4')
    expect(HERO_LOOP.webm).toContain('danzus-hero.webm')
  })
})
