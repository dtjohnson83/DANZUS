import { readFileSync } from 'node:fs'
import { createElement, type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { businessPostalAddress, commercialEmailFooter } from '@/lib/business-address'
import { demoClient } from '@/config/clients/demo'
import { CheckoutGroup, HeaderReach, HeroReach, PAY_GROUPS } from '@/app/pay-choices'

vi.mock('@/app/home.module.css', () => ({
  default: new Proxy(
    {},
    {
      get: (_target, prop) => String(prop),
    },
  ),
}))

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
    expect(terms).toContain('If you cancel before month 6, the website is $1,500 and we bill the other $750.')
    expect(terms).toContain('Consent is not a condition of purchase.')
    expect(terms).toContain('https://danzus.co/cancel')
    expect(terms).toContain('Renews monthly at $99')
    expect(terms).toContain('Renews monthly at $49')
    expect(terms).toContain('Renews monthly at $199')
    expect(terms).toContain('Renews monthly at $299')
    expect(terms).toContain(
      'If you think we used your photo, writing, or other work without permission, send the designated agent a takedown notice. Include:',
    )
    expect(terms).toContain('designated agent is Daniel Johnson, 2108 N St #18348, Sacramento, CA 95816')
    expect(terms).toContain('DMCA-1085182')
    expect(terms).toContain('https://dmca.copyright.gov/osp/')
    expect(terms).toContain('under penalty of perjury')
    expect(terms).toContain('<ul>')
    expect(terms).toContain('Send copyright notices by email to')
    expect(terms).toContain('dan@danzus.co')
    expect(terms).not.toContain('DESIGNATED_AGENT')
    expect(terms).not.toContain('Daniel must register')
    expect(terms).not.toMatch(/—/)
  })

  it('renders each Stripe checkout with its label, disclosure, and nearby contact links', () => {
    const paySource = read('app/pay-choices.tsx')
    expect(paySource.match(/buy\.stripe\.com/g)).toHaveLength(5)
    expect(paySource).not.toMatch(/—/)

    const page = read(files.home)
    expect(page.indexOf("payGroup('textback-services')")).toBeLessThan(page.indexOf('PACKAGES.map'))
    expect(page).toContain('<HeaderReach />')
    expect(page).toContain('<HeroReach />')
    expect(page).toContain('CheckoutGroup {...payGroup(item.groupId)}')
    expect(page).toContain('CheckoutGroup {...payGroup(tier.groupId)}')
    expect(page).not.toContain('If you cancel before month 6')
    for (const group of PAY_GROUPS) {
      expect(page).toContain(`'${group.groupId}'`)
    }

    const rendered = PAY_GROUPS.map((group) => ({
      group,
      html: renderToStaticMarkup(createElement(CheckoutGroup, group) as ReactElement),
    }))

    const pairs = [
      ['textback-services', 'https://buy.stripe.com/28EaEWfuUfvmefRfZe8Ra02', 'Start missed-call text-back'],
      ['textback-pricing', 'https://buy.stripe.com/28EaEWfuUfvmefRfZe8Ra02', 'Start missed-call text-back'],
      ['website-services', 'https://buy.stripe.com/00w00i2I81Ewc7J3cs8Ra03', 'Pay the website deposit'],
      ['website-pricing', 'https://buy.stripe.com/00w00i2I81Ewc7J3cs8Ra03', 'Pay the website deposit'],
      ['search-services', 'https://buy.stripe.com/3cIcN46Yo1Ew6Np3cs8Ra04', 'Start Google + AI search'],
      ['search-pricing', 'https://buy.stripe.com/3cIcN46Yo1Ew6Np3cs8Ra04', 'Start Google + AI search'],
      ['growth-services', 'https://buy.stripe.com/9B64gy6Yogzq7RtbIY8Ra05', 'Start Growth month to month'],
      ['growth-pricing', 'https://buy.stripe.com/9B64gy6Yogzq7RtbIY8Ra05', 'Start Growth month to month'],
      ['growth-services', 'https://buy.stripe.com/3cIcN4gyY5UMfjV9AQ8Ra06', 'Start the 6-month plan and pay the website deposit'],
      ['growth-pricing', 'https://buy.stripe.com/3cIcN4gyY5UMfjV9AQ8Ra06', 'Start the 6-month plan and pay the website deposit'],
    ] as const

    for (const { group, html } of rendered) {
      expect(html).toContain('href="tel:+19164046129"')
      expect(html).toContain('href="sms:+19164046129"')
      expect(html).toContain('href="mailto:dan@danzus.co')
      expect(html).toContain('(916) 404-6129')
      expect(html).toContain('dan@danzus.co')
      expect(html).toContain(`data-checkout="${group.groupId}"`)
      const stripeHrefs = html.match(/https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+/g) ?? []
      expect(new Set(stripeHrefs)).toEqual(new Set(group.links.map((link) => link.href)))
    }

    for (const [groupId, href, label] of pairs) {
      const html = rendered.find((item) => item.group.groupId === groupId)?.html ?? ''
      const anchor = html.match(new RegExp(`<a[^>]*href="${href}"[^>]*>[\\s\\S]*?</a>`))?.[0] ?? ''
      expect(anchor).toContain(label)
    }

    const websiteDisclosure =
      'The website is $1,500. $750 is due now, and $750 is invoiced at launch. Hosting is $49 a month. The first hosting month is also charged today, so the initial subtotal is $799 before tax.'
    for (const groupId of ['website-services', 'website-pricing']) {
      const html = rendered.find((item) => item.group.groupId === groupId)?.html ?? ''
      expect(html.indexOf(websiteDisclosure)).toBeGreaterThan(-1)
      expect(html.indexOf(websiteDisclosure)).toBeLessThan(html.indexOf('https://buy.stripe.com/00w00i2I81Ewc7J3cs8Ra03'))
    }

    for (const groupId of ['growth-services', 'growth-pricing']) {
      const html = rendered.find((item) => item.group.groupId === groupId)?.html ?? ''
      const month = html.indexOf('https://buy.stripe.com/9B64gy6Yogzq7RtbIY8Ra05')
      const wordOr = html.indexOf('>or<')
      const six = html.indexOf('https://buy.stripe.com/3cIcN4gyY5UMfjV9AQ8Ra06')
      const early = html.indexOf('If you cancel before month 6, the website is $1,500 and we bill the other $750.')
      expect(html).toContain('Choose one way to start.')
      expect(html.slice(0, wordOr)).toContain('Growth is $299 a month, with no new website.')
      expect(html.slice(0, wordOr)).not.toContain('If you cancel before month 6')
      expect(html.slice(0, wordOr)).not.toContain('After month 6')
      expect(wordOr).toBeGreaterThan(month)
      expect(early).toBeGreaterThan(wordOr)
      expect(early).toBeLessThan(six)
      expect(html.slice(wordOr, six)).toContain('$375 is due now, and $375 is invoiced at launch, plus $299 this month, so the initial subtotal is $674 before tax.')
      expect(html.slice(wordOr, six)).toContain('After month 6 it continues month to month at $299 until cancelled.')
    }

    for (const node of [createElement(HeaderReach), createElement(HeroReach)]) {
      const html = renderToStaticMarkup(node)
      expect(html).toContain('(916) 404-6129')
      expect(html).toContain('dan@danzus.co')
      expect(html).toContain('href="tel:+19164046129"')
      expect(html).toContain('href="sms:+19164046129"')
      expect(html).toContain('Call (916) 404-6129')
      expect(html).toContain('Text (916) 404-6129')
      expect(html).not.toContain('Call or text Dan')
    }
  })

  it('puts the same renewal facts on the pricing section and the cancel page', () => {
    const home = `${read(files.home)} ${read('app/pay-choices.tsx')}`
    const cancel = read(files.cancel)
    expect(home).toContain('Renews monthly at $99 until you cancel. Cancel any time online, by email, or by phone.')
    expect(home).toContain('Renews monthly at $49 until you cancel. Cancel any time online, by email, or by phone.')
    expect(home).toContain('Renews monthly at $199 until you cancel. Cancel any time online, by email, or by phone.')
    expect(home).toContain('After month 6 it continues month to month at $299 until cancelled.')
    expect(home).toContain('If you cancel before month 6, the website is $1,500 and we bill the other $750.')
    expect(read('app/cancel/page.tsx')).toContain('If you cancel before month 6, the website is $1,500 and we bill the other $750.')
    expect(read('public/llms.txt')).toContain('If you cancel before month 6, the website is $1,500 and we bill the other $750.')
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
