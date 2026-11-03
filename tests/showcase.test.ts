import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { RESULTS } from '@/config/results'
import { HERO_LOOP } from '@/app/hero-loop'
import { SAMPLE_PHOTO_BASE, TRADES } from '@/app/sample-sites/trades'
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
    expect(TRADES.map((trade) => trade.photos.hero)).toEqual([
      `${SAMPLE_PHOTO_BASE}/plumber/hero.webp`,
      `${SAMPLE_PHOTO_BASE}/hvac/hero.webp`,
      `${SAMPLE_PHOTO_BASE}/auto/hero.webp`,
      `${SAMPLE_PHOTO_BASE}/salon/hero.webp`,
    ])
    expect(readFileSync('app/sample-sites/SampleSite.tsx', 'utf8')).toContain(
      'Sample site by DANZUS. Not a real business.',
    )
    expect(readFileSync('next.config.js', 'utf8')).toContain("pathname: '/samples-branded/**'")
    expect(readFileSync('app/page.tsx', 'utf8')).not.toContain('See it for your shop.')
    expect(readFileSync('app/SampleMenu.tsx', 'utf8')).toContain('sample_open')
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
    expect(nav).toContain('SampleMenuGroup')
    expect(nav).not.toContain('#work')
    expect(readFileSync('app/SampleMenu.tsx', 'utf8')).toContain('Sample sites')
  })

  it('ships an empty results list and the approved hero loop', () => {
    expect(RESULTS).toEqual([])
    expect(HERO_LOOP.desktop.mp4).toContain('danzus-hero-v3-desktop.mp4')
    expect(HERO_LOOP.desktop.webm).toContain('danzus-hero-v3-desktop.webm')
    expect(HERO_LOOP.desktop.poster).toContain('danzus-hero-v3-desktop-poster.webp')
    expect(HERO_LOOP.mobile.mp4).toContain('danzus-hero-v3-mobile.mp4')
    expect(HERO_LOOP.mobile.webm).toContain('danzus-hero-v3-mobile.webm')
    expect(HERO_LOOP.mobile.poster).toContain('danzus-hero-v3-mobile-poster.webp')
  })
})
