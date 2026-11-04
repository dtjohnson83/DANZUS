import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { businessPostalAddress, commercialEmailFooter } from '@/lib/business-address'
import { demoClient } from '@/config/clients/demo'

const files = {
  layout: 'app/layout.tsx',
  privacy: 'app/privacy/page.tsx',
  terms: 'app/terms/page.tsx',
  cancel: 'app/cancel/page.tsx',
  home: 'app/page.tsx',
  email: 'lib/ai-check/email.ts',
  contextkit: 'public/contextkit/index.html',
  contextkitSource: 'contextkit/index.html',
} as const

function read(path: string) {
  return readFileSync(path, 'utf8').replace(/\s+/g, ' ')
}

describe('compliance copy', () => {
  it('says the service is not for children under 13', () => {
    const privacy = read(files.privacy)
    expect(privacy).toContain('This service is not for children under 13.')
    expect(privacy).toContain('do not knowingly collect personal information from anyone under 13')
    expect(privacy).not.toContain('for marketing')
    expect(privacy).not.toMatch(/—/)
  })

  it('discloses Vercel measurement and says visits are not played back', () => {
    const privacy = read(files.privacy)
    expect(privacy).toContain('Vercel Web Analytics')
    expect(privacy).toContain('Vercel Speed Insights')
    expect(privacy).toContain('do not record a playback of your visit')
  })

  it('states monthly renewal, the cancel path, and a DMCA placeholder', () => {
    const terms = read(files.terms)
    expect(terms).toContain('renews every month at that price until you cancel')
    expect(terms).toContain('https://danzus.co/cancel')
    expect(terms).toContain('$99 a month')
    expect(terms).toContain('$49 a month')
    expect(terms).toContain('$199 a month')
    expect(terms).toContain('$299 a month')
    expect(terms).toContain('[DESIGNATED_AGENT_NAME]')
    expect(terms).toContain('[DMCA_REGISTRATION_NUMBER]')
    expect(terms).toContain('mailto:${CONTACT_EMAIL}')
    expect(read('app/site.ts')).toContain('dan@danzus.co')
    expect(terms).not.toContain('<ul>')
    expect(terms).not.toMatch(/—/)
  })

  it('puts the same renewal facts on the pricing section and the cancel page', () => {
    const home = read(files.home)
    const cancel = read(files.cancel)
    expect(home).toContain('Each monthly plan renews')
    expect(home).toContain('href="/cancel"')
    expect(home).not.toMatch(/—/)
    expect(cancel).toContain('This page is')
    expect(cancel).toContain('how you cancel online')
    expect(cancel).toContain('$99 a month')
    expect(cancel).not.toMatch(/—/)
  })

  it('does not load Google Fonts from the CDN', () => {
    for (const path of [files.layout, files.contextkit, files.contextkitSource]) {
      const text = read(path)
      expect(text).not.toContain('fonts.googleapis.com')
      expect(text).not.toContain('fonts.gstatic.com')
    }
    expect(read('public/contextkit/fonts/fonts.css')).toContain("font-family: 'Barlow Condensed'")
    expect(read('app/brand-fonts.ts')).toContain("next/font/google")
  })

  it('keeps STOP on the missed-call text', () => {
    expect(demoClient.missedCallSms).toContain('Reply STOP to opt out')
  })

  it('prints a postal address only when BUSINESS_POSTAL_ADDRESS is set', () => {
    const previous = process.env.BUSINESS_POSTAL_ADDRESS
    delete process.env.BUSINESS_POSTAL_ADDRESS
    expect(businessPostalAddress()).toBe('')
    expect(commercialEmailFooter()).toContain('https://danzus.co/unsubscribe')
    expect(commercialEmailFooter()).not.toMatch(/\d{3,5}\s+\w+\s+(Street|St|Avenue|Ave|Road|Rd)/i)

    process.env.BUSINESS_POSTAL_ADDRESS = '100 Capitol Mall\nSacramento, CA 95814'
    expect(businessPostalAddress()).toBe('100 Capitol Mall Sacramento, CA 95814')
    expect(commercialEmailFooter()).toContain('100 Capitol Mall Sacramento, CA 95814')

    if (previous === undefined) delete process.env.BUSINESS_POSTAL_ADDRESS
    else process.env.BUSINESS_POSTAL_ADDRESS = previous

    expect(read(files.email)).toContain('commercialEmailFooter()')
    expect(read('.env.example')).toContain('BUSINESS_POSTAL_ADDRESS=')
  })
})
