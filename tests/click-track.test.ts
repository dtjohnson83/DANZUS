import { describe, expect, it } from 'vitest'
import { eventsFromTrackElement } from '@/lib/click-track'

function el(attrs: Record<string, string>) {
  return {
    getAttribute(name: string) {
      return Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : null
    },
  } as Element
}

describe('click tracking', () => {
  it('records a phone link with its location', () => {
    expect(
      eventsFromTrackElement(el({ href: 'tel:+19164046129', 'data-track': 'call_click', 'data-track-location': 'footer' })),
    ).toEqual([{ name: 'call_click', data: { location: 'footer' } }])
  })

  it('records a text link', () => {
    expect(
      eventsFromTrackElement(el({ href: 'sms:+19164046129', 'data-track': 'text_click', 'data-track-location': 'footer' })),
    ).toEqual([{ name: 'text_click', data: { location: 'footer' } }])
  })

  it('records a phone button as both a call and a CTA', () => {
    expect(
      eventsFromTrackElement(
        el({
          href: 'tel:+19164046129',
          'data-track': 'call_click',
          'data-track-location': 'hero',
          'data-track-label': 'Call or text Dan',
          'data-track-section': 'hero',
        }),
      ),
    ).toEqual([
      { name: 'call_click', data: { location: 'hero' } },
      { name: 'cta_click', data: { label: 'Call or text Dan', section: 'hero' } },
    ])
  })

  it('records section CTAs, nav, samples, and outbound links', () => {
    expect(
      eventsFromTrackElement(
        el({
          href: '#reply',
          'data-track': 'cta_click',
          'data-track-label': 'See the text',
          'data-track-section': 'services',
        }),
      ),
    ).toEqual([{ name: 'cta_click', data: { label: 'See the text', section: 'services' } }])
    expect(
      eventsFromTrackElement(
        el({
          href: '#pricing',
          'data-track': 'nav_click',
          'data-track-label': 'Pricing',
          'data-track-location': 'desktop',
        }),
      ),
    ).toEqual([{ name: 'nav_click', data: { label: 'Pricing', location: 'desktop' } }])
    expect(
      eventsFromTrackElement(el({ href: '/demo/plumber', 'data-track': 'sample_open', 'data-track-slug': 'plumber' })),
    ).toEqual([{ name: 'sample_open', data: { slug: 'plumber' } }])
    expect(
      eventsFromTrackElement(
        el({
          href: 'https://linkedin.com/in/danjohnsondata',
          'data-track': 'outbound_click',
          'data-track-label': 'LinkedIn',
        }),
      ),
    ).toEqual([{ name: 'outbound_click', data: { label: 'LinkedIn' } }])
  })

  it('records the mobile menu only when it opens', () => {
    expect(eventsFromTrackElement(el({ 'data-track': 'menu_open', 'aria-expanded': 'false' }))).toEqual([
      { name: 'menu_open' },
    ])
    expect(eventsFromTrackElement(el({ 'data-track': 'menu_open', 'aria-expanded': 'true' }))).toEqual([])
  })
})
