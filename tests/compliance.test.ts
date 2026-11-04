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

  it('states monthly renewal, the cancel path, and where to send a copyright notice', () => {
    const terms = read(files.terms)
    expect(terms).toContain('Billing & cancellation')
    expect(terms).toContain('Renews monthly at $99 until you cancel.')
    expect(terms).toContain('After month 6 it continues month to month at $299 until cancelled.')
    expect(terms).toContain('Consent is not a condition of purchase.')
    expect(terms).toContain('https://danzus.co/cancel')
    expect(terms).toContain('Renews monthly at $99')
    expect(terms).toContain('Renews monthly at $49')
    expect(terms).toContain('Renews monthly at $199')
    expect(terms).toContain('Renews monthly at $299')
    expect(terms).toContain('If you think we used your photo, writing, or other work without permission, email us. Include:')
    expect(terms).toContain('<ul>')
    expect(terms).toContain('Send copyright notices to')
    expect(terms).toContain('dan@danzus.co')
    expect(terms).not.toContain('DESIGNATED_AGENT')
    expect(terms).not.toContain('Daniel must register')
    expect(terms).not.toMatch(/—/)
  })

  it('puts the same renewal facts on the pricing section and the cancel page', () => {
    const home = read(files.home)
    const cancel = read(files.cancel)
    expect(home).toContain('Renews monthly at $99 until you cancel. Cancel any time by email or phone.')
    expect(home).toContain('Renews monthly at $49 until you cancel. Cancel any time by email or phone.')
    expect(home).toContain('Renews monthly at $199 until you cancel. Cancel any time by email or phone.')
    expect(home).toContain('After month 6 it continues month to month at $299 until cancelled.')
    expect(home).toContain('Monthly plans renew each month until you cancel.')
    expect(home).toContain('The $1,500 website is paid once.')
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
    expect(read(files.email)).toContain("replyTo: REPORT_REPLY_TO")
    expect(read(files.email)).toContain('List-Unsubscribe')
    expect(read(files.privacy)).toContain('It includes a way to stop further email')
    expect(read(files.privacy)).not.toContain('postal address')
    expect(read('.env.example')).toContain('BUSINESS_POSTAL_ADDRESS=')
  })
})
