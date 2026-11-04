import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { contactLeadBody } from '@/app/ContactForm'
import { demoClient } from '@/config/clients/demo'
import { SMS_HELP_REPLY } from '@/lib/lead-flow/handle-sms'

const MISSED_CALL =
  "Hey, this is Dan at DANZUS. Sorry I missed your call. Text me what you need and I'll get right back to you. Reply STOP to opt out."

function flat(source: string) {
  return source.replace(/\s+/g, ' ')
}

describe('A2P SMS copy', () => {
  it('keeps opt-in data off third parties and drops the carrier delivery sentence', () => {
    const privacy = flat(readFileSync('app/privacy/page.tsx', 'utf8'))
    expect(privacy).toContain('Text messaging (SMS)')
    expect(privacy).toContain(
      'We do not share, sell, rent, or trade mobile phone numbers or SMS opt-in data and consent with any third parties or affiliates for any purpose, including marketing or promotional purposes.',
    )
    expect(privacy).toContain(
      'Text messaging originator opt-in data and consent will not be shared with any third parties.',
    )
    expect(privacy).not.toContain('for marketing')
    expect(privacy).not.toContain('texting provider')
    expect(privacy).not.toMatch(/—/)
  })

  it('publishes the text messaging program on the terms page', () => {
    const terms = flat(readFileSync('app/terms/page.tsx', 'utf8'))
    expect(terms).toContain('DANZUS Text Messaging Program')
    expect(terms).toContain('check the SMS consent box')
    expect(terms).toContain('Consent is not a condition of purchase.')
    expect(terms).toContain('https://danzus.co/privacy')
    const sms = terms.slice(terms.indexOf('DANZUS Text Messaging Program'), terms.indexOf('Monthly plans'))
    expect(sms).not.toContain('<ul>')
    expect(terms).not.toMatch(/—/)
  })

  it('stores an unchecked-by-default consent value on the lead note', () => {
    const form = readFileSync('app/ContactForm.tsx', 'utf8')
    expect(form).toContain('name="smsConsent"')
    expect(form).toContain('type="checkbox"')
    expect(form).not.toContain('defaultChecked')
    expect(form).toContain('I agree to receive text messages from DANZUS Holdings LLC')
    expect(form).toContain('href="/privacy"')
    expect(form).toContain('href="/terms"')
    expect(
      contactLeadBody({
        name: 'Ada',
        business: 'North Side',
        email: 'ada@example.com',
        phone: '916-555-0100',
        workflow: 'Missed-call text-back',
        details: '',
        smsConsent: false,
      }),
    ).toContain('SMS consent: no')
    expect(
      contactLeadBody({
        name: 'Ada',
        business: 'North Side',
        email: 'ada@example.com',
        phone: '',
        workflow: 'Not sure yet',
        details: 'Call me.',
        smsConsent: true,
      }),
    ).toContain('SMS consent: yes')
  })

  it('uses the HELP line and a missed-call text with no em dash', () => {
    expect(SMS_HELP_REPLY).toBe(
      'DANZUS Holdings LLC: For help, email dan@danzus.co or call (916) 404-6129. Msg freq varies. Msg&data rates may apply. Reply STOP to opt out.',
    )
    expect(demoClient.missedCallSms).toBe(MISSED_CALL)
    expect(demoClient.missedCallSms).not.toMatch(/—/)
    const footer = readFileSync('app/SiteFooter.tsx', 'utf8')
    expect(footer).toContain('Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help.')
  })
})
