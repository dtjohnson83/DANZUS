import { describe, expect, it } from 'vitest'
import { isValidTwilioRequest, publicWebhookUrl, twilioSignature, webhookUrlForPath } from '@/lib/lead-flow/twilio'

describe('Twilio signature', () => {
  it('matches the documented HMAC-SHA1 example', () => {
    const params = new URLSearchParams()
    params.set('CallSid', 'CA1234567890ABCDE')
    params.set('Caller', '+14158675310')
    params.set('Digits', '1234')
    params.set('From', '+14158675310')
    params.set('To', '+18005551212')
    const url = 'https://example.com/myapp.php?foo=1&bar=2'
    expect(twilioSignature('12345', url, params)).toBe('L/OH5YylLD5NRKLltdqwSvS0BnU=')
    expect(isValidTwilioRequest('12345', 'L/OH5YylLD5NRKLltdqwSvS0BnU=', url, params)).toBe(true)
    expect(isValidTwilioRequest('12345', 'not-the-signature', url, params)).toBe(false)
    expect(isValidTwilioRequest('', 'L/OH5YylLD5NRKLltdqwSvS0BnU=', url, params)).toBe(false)
  })

  it('uses the forwarded public URL Twilio signed', () => {
    const previous = process.env.TWILIO_WEBHOOK_BASE_URL
    delete process.env.TWILIO_WEBHOOK_BASE_URL
    const request = new Request('http://localhost:3000/api/twilio/sms?x=1', {
      headers: {
        'x-forwarded-proto': 'https',
        'x-forwarded-host': 'danzus.co',
      },
    })
    expect(publicWebhookUrl(request)).toBe('https://danzus.co/api/twilio/sms?x=1')
    process.env.TWILIO_WEBHOOK_BASE_URL = 'https://preview.example.com/'
    expect(publicWebhookUrl(request)).toBe('https://preview.example.com/api/twilio/sms?x=1')
    expect(webhookUrlForPath(publicWebhookUrl(request), '/api/twilio/voice/recording')).toBe(
      'https://preview.example.com/api/twilio/voice/recording',
    )
    if (previous === undefined) delete process.env.TWILIO_WEBHOOK_BASE_URL
    else process.env.TWILIO_WEBHOOK_BASE_URL = previous
  })
})
