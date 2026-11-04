import { describe, expect, it } from 'vitest'
import { demoClient } from '@/config/clients/demo'
import { priceMenuGuide, sanitizePrices } from '@/lib/lead-flow/guard'
import { emptyLead } from '@/lib/lead-flow/lead'
import { qualifyInstructions } from '@/lib/lead-flow/qualify'
import { sendVoicemailEmail, voicemailEmailContent } from '@/lib/lead-flow/voicemail-email'

describe('approved price menu', () => {
  it('quotes the menu from the texting prompt and nowhere else', () => {
    const text = qualifyInstructions({
      config: demoClient,
      lead: emptyLead(demoClient, '+19165550199', '2026-11-04T18:00:00-08:00'),
      slots: [],
      inbound: 'How much?',
    })
    expect(text).toContain('$99 a month after a free 30-day pilot')
    expect(text).toContain('No setup fee')
    expect(text).toContain('month to month')
    expect(text).toContain('$1,500 one-time, plus $49 a month for hosting and edits')
    expect(text).toContain('$199 a month')
    expect(text).toContain('$299 a month')
    expect(text).toContain('6-month commitment the website is $750')
    expect(text).not.toContain('$200')
    expect(text).not.toContain('firm price')
    expect(text).not.toMatch(/GoHighLevel|App Orchid|DimeVision/i)

    const fallback = sanitizePrices('One workflow is $200 to $300 a month.', demoClient.priceMenu)
    expect(fallback).toBe(`Here's the menu, and Dan confirms it on a call. ${priceMenuGuide(demoClient.priceMenu)}`)
    expect(fallback.length).toBeLessThanOrEqual(480)
    expect(fallback).not.toContain('$200')
    expect(sanitizePrices('Text-back is $99 a month.', demoClient.priceMenu)).toContain('$99 a month')
  })
})

describe('voicemail email', () => {
  const notice = {
    to: 'dan@danzus.co',
    businessName: 'DANZUS',
    caller: '+1 (916) 555-0199',
    recordedAt: '2026-11-04T18:00:00-08:00',
    timeZone: 'America/Los_Angeles',
    durationSeconds: 18,
    recordingUrl: 'https://api.twilio.com/2010-04-01/Accounts/ACxxx/Recordings/RE1',
    transcript: 'Need a new website.',
    idempotencyId: 'RE1',
    kind: 'recording' as const,
  }

  it('includes the caller, time, duration, link, and transcript', () => {
    const content = voicemailEmailContent(notice)
    expect(content.subject).toBe('Voicemail for DANZUS')
    expect(content.text).toContain('Caller: +1 (916) 555-0199')
    expect(content.text).toContain('Duration: 18 seconds')
    expect(content.text).toContain(notice.recordingUrl)
    expect(content.text).toContain('Need a new website.')
    expect(content.text).toMatch(/2026/)
    expect(voicemailEmailContent({ ...notice, transcript: '', kind: 'transcript' }).text).toContain('not ready yet')
  })

  it('skips sending when RESEND_API_KEY is missing', async () => {
    const previous = process.env.RESEND_API_KEY
    delete process.env.RESEND_API_KEY
    const result = await sendVoicemailEmail(notice)
    expect(result).toEqual({ sent: false, skipped: true, duplicate: false })
    if (previous === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = previous
  })
})
