import { beforeEach, describe, expect, it, vi } from 'vitest'
import { handleSmsRequest } from '@/lib/lead-flow/handle-sms'
import { handleVoiceRequest } from '@/lib/lead-flow/handle-voice'
import { createMemoryStore } from '@/lib/lead-flow/memory-store'
import { clientForInboundNumber, clients } from '@/lib/lead-flow/registry'
import { exampleSlots } from '@/lib/lead-flow/slots'
import { sendTwilioSms, twilioSignature, xmlEscape } from '@/lib/lead-flow/twilio'
import type { Qualify, QualifyResult, SendSms } from '@/lib/lead-flow/types'

const TOKEN = 'test-auth-token'
const DEMO = '+19164046129'
const OWNER = '+19167490473'
const CALLER = '+19165550199'
const NOW = new Date('2026-11-04T18:00:00-08:00')

function blankTurn(overrides: Partial<QualifyResult> = {}): QualifyResult {
  return {
    reply: 'What needs doing?',
    action: 'continue',
    name: '',
    jobType: '',
    area: '',
    timing: '',
    budgetNote: '',
    selectedSlot: '',
    escalationReason: '',
    ...overrides,
  }
}

function signedRequest(path: string, fields: Record<string, string>, options?: { token?: string; host?: string }) {
  const token = options?.token ?? TOKEN
  const params = new URLSearchParams(fields)
  const url = `https://danzus.co${path}`
  const signature = twilioSignature(token, url, params)
  return new Request(`http://localhost:3000${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-forwarded-proto': 'https',
      'x-forwarded-host': options?.host ?? 'danzus.co',
      'x-twilio-signature': signature,
    },
    body: params.toString(),
  })
}

beforeEach(() => {
  delete process.env.TWILIO_WEBHOOK_BASE_URL
})

describe('client registry', () => {
  it('handles only the DANZUS business line', () => {
    expect(clients.map((client) => client.twilioNumber)).toEqual([DEMO])
    expect(clients[0]?.ownerPhone).toBe(OWNER)
    expect(clients[0]?.forwardTo).toBe(OWNER)
    expect(clients[0]?.ringTimeoutSeconds).toBe(20)
    expect(clients[0]?.greeting).toBe("Sorry we missed you, we'll text you right now")
    expect(clientForInboundNumber('+15550001111')).toBeUndefined()
  })
})

describe('voice webhook', () => {
  it('rejects a missing or invalid signature before any SMS', async () => {
    const sendSms = vi.fn<SendSms>()
    const store = createMemoryStore()
    const response = await handleVoiceRequest(signedRequest('/api/twilio/voice', { To: DEMO, From: CALLER, CallSid: 'CA1' }), {
      authToken: 'other-token',
      store,
      clientForNumber: clientForInboundNumber,
      sendSms,
      now: () => NOW,
    })
    expect(response.status).toBe(403)
    expect(sendSms).not.toHaveBeenCalled()
    expect(await store.list()).toEqual([])
  })

  it('hangs up on any other Twilio number and does not text', async () => {
    const sendSms = vi.fn<SendSms>()
    const response = await handleVoiceRequest(
      signedRequest('/api/twilio/voice', { To: '+15550001111', From: CALLER, CallSid: 'CA2' }),
      {
        authToken: TOKEN,
        store: createMemoryStore(),
        clientForNumber: clientForInboundNumber,
        sendSms,
        now: () => NOW,
      },
    )
    const xml = await response.text()
    expect(response.status).toBe(200)
    expect(xml).toContain('<Hangup/>')
    expect(xml).not.toContain('<Dial')
    expect(xml).not.toContain('Sorry we missed you')
    expect(sendSms).not.toHaveBeenCalled()
  })

  it('rings the owner with the caller id and does not text yet', async () => {
    const sendSms = vi.fn<SendSms>()
    const store = createMemoryStore()
    const response = await handleVoiceRequest(
      signedRequest('/api/twilio/voice', { To: DEMO, From: CALLER, CallSid: 'CA3' }),
      {
        authToken: TOKEN,
        store,
        clientForNumber: clientForInboundNumber,
        sendSms,
        now: () => NOW,
      },
    )
    const xml = await response.text()
    expect(xml).toContain(
      `<Dial action="https://danzus.co/api/twilio/voice" method="POST" timeout="${clients[0].ringTimeoutSeconds}" callerId="${CALLER}"><Number>${clients[0].forwardTo}</Number></Dial>`,
    )
    expect(xml).not.toContain('Sorry we missed you')
    expect(sendSms).not.toHaveBeenCalled()
    expect(await store.list()).toEqual([])
  })

  it('uses the Twilio number as callerId when the caller id is withheld', async () => {
    const sendSms = vi.fn<SendSms>()
    const response = await handleVoiceRequest(
      signedRequest('/api/twilio/voice', { To: DEMO, From: 'Anonymous', CallSid: 'CA5' }),
      {
        authToken: TOKEN,
        store: createMemoryStore(),
        clientForNumber: clientForInboundNumber,
        sendSms,
        now: () => NOW,
      },
    )
    const xml = await response.text()
    expect(xml).toContain(`callerId="${DEMO}"`)
    expect(xml).toContain(`<Number>${OWNER}</Number>`)
    expect(xml).not.toContain('Sorry we missed you')
    expect(sendSms).not.toHaveBeenCalled()
  })

  it.each(['no-answer', 'busy', 'failed'])(
    'plays the greeting and texts the caller when the forward is %s',
    async (dialStatus) => {
      const sendSms = vi.fn<SendSms>()
      const store = createMemoryStore()
      const response = await handleVoiceRequest(
        signedRequest('/api/twilio/voice', {
          To: DEMO,
          From: CALLER,
          CallSid: `CA-${dialStatus}`,
          DialCallStatus: dialStatus,
        }),
        {
          authToken: TOKEN,
          store,
          clientForNumber: clientForInboundNumber,
          sendSms,
          now: () => NOW,
        },
      )
      const xml = await response.text()
      expect(xml).toContain(`<Say>${xmlEscape(clients[0].greeting)}</Say><Hangup/>`)
      expect(xml).not.toContain('<Dial')
      expect(sendSms).toHaveBeenCalledTimes(1)
      expect(sendSms).toHaveBeenCalledWith({
        to: CALLER,
        from: DEMO,
        body: clients[0].missedCallSms,
      })
      const lead = await store.get(clients[0].id, CALLER)
      expect(lead?.status).toBe('qualifying')
      expect(lead?.messages[0]?.delivery).toBe('sent')
    },
  )

  it.each(['completed', 'answered', 'canceled'])(
    'does nothing else when DialCallStatus is %s',
    async (dialStatus) => {
      const sendSms = vi.fn<SendSms>()
      const store = createMemoryStore()
      const response = await handleVoiceRequest(
        signedRequest('/api/twilio/voice', {
          To: DEMO,
          From: CALLER,
          CallSid: `CA-${dialStatus}`,
          DialCallStatus: dialStatus,
        }),
        {
          authToken: TOKEN,
          store,
          clientForNumber: clientForInboundNumber,
          sendSms,
          now: () => NOW,
        },
      )
      const xml = await response.text()
      expect(xml).toContain('<Hangup/>')
      expect(xml).not.toContain('Sorry we missed you')
      expect(xml).not.toContain('<Dial')
      expect(sendSms).not.toHaveBeenCalled()
      expect(await store.list()).toEqual([])
    },
  )

  it('does not text a second time when Twilio retries the same missed call', async () => {
    const sendSms = vi.fn<SendSms>()
    const store = createMemoryStore()
    const deps = {
      authToken: TOKEN,
      store,
      clientForNumber: clientForInboundNumber,
      sendSms,
      now: () => NOW,
    }
    const request = () =>
      signedRequest('/api/twilio/voice', { To: DEMO, From: CALLER, CallSid: 'CA4', DialCallStatus: 'no-answer' })
    await handleVoiceRequest(request(), deps)
    await handleVoiceRequest(request(), deps)
    expect(sendSms).toHaveBeenCalledTimes(1)
  })

  it('says the greeting without a text when a missed call has no caller id', async () => {
    const sendSms = vi.fn<SendSms>()
    const response = await handleVoiceRequest(
      signedRequest('/api/twilio/voice', {
        To: DEMO,
        From: 'Anonymous',
        CallSid: 'CA5b',
        DialCallStatus: 'no-answer',
      }),
      {
        authToken: TOKEN,
        store: createMemoryStore(),
        clientForNumber: clientForInboundNumber,
        sendSms,
        now: () => NOW,
      },
    )
    expect(await response.text()).toContain('Sorry we missed you')
    expect(sendSms).not.toHaveBeenCalled()
  })

  it('still plays the greeting when the text fails, and a retry can send it', async () => {
    const sendSms = vi.fn<SendSms>()
    sendSms.mockRejectedValueOnce(new Error('twilio down'))
    const store = createMemoryStore()
    const deps = {
      authToken: TOKEN,
      store,
      clientForNumber: clientForInboundNumber,
      sendSms,
      now: () => NOW,
    }
    const request = () =>
      signedRequest('/api/twilio/voice', { To: DEMO, From: CALLER, CallSid: 'CA6', DialCallStatus: 'busy' })
    const first = await handleVoiceRequest(request(), deps)
    expect(first.status).toBe(200)
    expect((await store.get(clients[0].id, CALLER))?.messages[0]?.delivery).toBe('failed')
    await handleVoiceRequest(request(), deps)
    expect(sendSms).toHaveBeenCalledTimes(2)
    expect((await store.get(clients[0].id, CALLER))?.messages[0]?.delivery).toBe('sent')
  })
})

describe('SMS webhook', () => {
  const slots = exampleSlots(clients[0], NOW)

  function deps(qualify: Qualify, sendSms: SendSms = vi.fn<SendSms>()) {
    return {
      authToken: TOKEN,
      store: createMemoryStore(),
      clientForNumber: clientForInboundNumber,
      qualify,
      sendSms,
      now: () => NOW,
    }
  }

  it('answers HELP with the published program line and does not call the model', async () => {
    const qualify = vi.fn<Qualify>()
    const response = await handleSmsRequest(
      signedRequest('/api/twilio/sms', { To: DEMO, From: CALLER, Body: 'HELP', MessageSid: 'SM-help' }),
      deps(qualify),
    )
    const xml = await response.text()
    expect(xml).toContain(
      'DANZUS Holdings LLC: For help, email dan@danzus.co or call (916) 404-6129. Msg freq varies. Msg&amp;data rates may apply. Reply STOP to opt out.',
    )
    expect(xml).not.toContain('—')
    expect(qualify).not.toHaveBeenCalled()
  })

  it('rejects an invalid signature', async () => {
    const qualify = vi.fn<Qualify>()
    const response = await handleSmsRequest(
      signedRequest('/api/twilio/sms', { To: DEMO, From: CALLER, Body: 'Hi', MessageSid: 'SM1' }),
      { ...deps(qualify), authToken: 'nope' },
    )
    expect(response.status).toBe(403)
    expect(qualify).not.toHaveBeenCalled()
  })

  it('ignores texts to any other number', async () => {
    const qualify = vi.fn<Qualify>()
    const sendSms = vi.fn<SendSms>()
    const response = await handleSmsRequest(
      signedRequest('/api/twilio/sms', { To: '+15550001111', From: CALLER, Body: 'Hi', MessageSid: 'SM2' }),
      deps(qualify, sendSms),
    )
    expect(await response.text()).toBe('<?xml version="1.0" encoding="UTF-8"?><Response></Response>')
    expect(qualify).not.toHaveBeenCalled()
    expect(sendSms).not.toHaveBeenCalled()
  })

  it('saves a qualifying turn and escapes the TwiML reply', async () => {
    const qualify = vi.fn<Qualify>(async () =>
      blankTurn({
        reply: 'Got it — a leak. 5 < 6 & "ok". What area?',
        jobType: 'leak repair',
      }),
    )
    const harness = deps(qualify)
    const response = await handleSmsRequest(
      signedRequest('/api/twilio/sms', { To: DEMO, From: CALLER, Body: 'My sink is leaking', MessageSid: 'SM3' }),
      harness,
    )
    const xml = await response.text()
    expect(xml).toContain('5 &lt; 6 &amp; &quot;ok&quot;')
    expect(qualify).toHaveBeenCalledOnce()
    const lead = await harness.store.get(clients[0].id, CALLER)
    expect(lead?.jobType).toBe('leak repair')
    expect(lead?.status).toBe('qualifying')
    expect(lead?.messages.map((message) => message.direction)).toEqual(['in', 'out'])
  })

  it('confirms a booking on one of the stub slots and does not text the owner', async () => {
    const slot = slots[0]
    const sendSms = vi.fn<SendSms>()
    const qualify = vi.fn<Qualify>(async () =>
      blankTurn({
        reply: `You're booked for ${slot}. See you then.`,
        action: 'book',
        selectedSlot: slot,
        jobType: 'drain cleaning',
        area: 'Folsom',
        timing: 'this week',
      }),
    )
    const harness = deps(qualify, sendSms)
    const response = await handleSmsRequest(
      signedRequest('/api/twilio/sms', { To: DEMO, From: CALLER, Body: 'Thursday morning works', MessageSid: 'SM4' }),
      harness,
    )
    const xml = await response.text()
    expect(xml).toContain('See you then.')
    expect(xml).toContain(slot)
    expect(sendSms).not.toHaveBeenCalled()
    const lead = await harness.store.get(clients[0].id, CALLER)
    expect(lead?.status).toBe('booked')
    expect(lead?.bookedSlot).toBe(slot)
  })

  it('does not book a time that is not one of the offered slots', async () => {
    const qualify = vi.fn<Qualify>(async () =>
      blankTurn({
        reply: 'You are booked for tonight.',
        action: 'book',
        selectedSlot: 'tonight at 9',
      }),
    )
    const harness = deps(qualify)
    const response = await handleSmsRequest(
      signedRequest('/api/twilio/sms', { To: DEMO, From: CALLER, Body: 'Tonight', MessageSid: 'SM5' }),
      harness,
    )
    const xml = await response.text()
    expect(xml).toContain(slots[0])
    expect(xml).toContain(slots[1])
    const lead = await harness.store.get(clients[0].id, CALLER)
    expect(lead?.status).toBe('slots_offered')
    expect(lead?.bookedSlot).toBe('')
  })

  it('tells an upset lead the owner will follow up and texts the owner once', async () => {
    const sendSms = vi.fn<SendSms>()
    const qualify = vi.fn<Qualify>(async () => blankTurn({ reply: 'Happy to help with that.' }))
    const store = createMemoryStore()
    const shared = {
      authToken: TOKEN,
      store,
      clientForNumber: clientForInboundNumber,
      qualify,
      sendSms,
      now: () => NOW,
    }
    const first = await handleSmsRequest(
      signedRequest('/api/twilio/sms', {
        To: DEMO,
        From: CALLER,
        Body: 'This is ridiculous, I want the owner',
        MessageSid: 'SM6',
      }),
      shared,
    )
    const firstXml = await first.text()
    expect(firstXml).toContain(`The owner of ${clients[0].businessName} will follow up with you directly.`)
    expect(firstXml).not.toContain('Happy to help')
    expect(sendSms).toHaveBeenCalledTimes(1)
    expect(sendSms).toHaveBeenCalledWith(
      expect.objectContaining({ to: OWNER, from: DEMO }),
    )
    const ownerBody = sendSms.mock.calls[0]?.[0].body ?? ''
    expect(ownerBody).toContain(CALLER)
    expect(ownerBody).not.toContain(TOKEN)

    const second = await handleSmsRequest(
      signedRequest('/api/twilio/sms', { To: DEMO, From: CALLER, Body: 'Hello?', MessageSid: 'SM7' }),
      shared,
    )
    expect(second.status).toBe(200)
    expect(sendSms).toHaveBeenCalledTimes(1)
    expect((await store.get(clients[0].id, CALLER))?.status).toBe('escalated')
  })

  it('retries the owner text if the first send failed', async () => {
    const sendSms = vi.fn<SendSms>()
    sendSms.mockRejectedValueOnce(new Error('twilio down'))
    const qualify = vi.fn<Qualify>(async () =>
      blankTurn({ action: 'escalate', reply: 'The owner will follow up with you.', escalationReason: 'Unsure' }),
    )
    const store = createMemoryStore()
    const shared = {
      authToken: TOKEN,
      store,
      clientForNumber: clientForInboundNumber,
      qualify,
      sendSms,
      now: () => NOW,
    }
    await handleSmsRequest(
      signedRequest('/api/twilio/sms', { To: DEMO, From: CALLER, Body: "I'm not sure I want to book", MessageSid: 'SM8' }),
      shared,
    )
    expect((await store.get(clients[0].id, CALLER))?.ownerNotified).toBe(false)
    await handleSmsRequest(
      signedRequest('/api/twilio/sms', { To: DEMO, From: CALLER, Body: 'Still here', MessageSid: 'SM9' }),
      shared,
    )
    expect(sendSms).toHaveBeenCalledTimes(2)
    expect((await store.get(clients[0].id, CALLER))?.ownerNotified).toBe(true)
  })

  it('strips a firm price and keeps a configured range', async () => {
    const firm = vi.fn<Qualify>(async () => blankTurn({ reply: "That'll be $75 flat." }))
    const firmResponse = await handleSmsRequest(
      signedRequest('/api/twilio/sms', { To: DEMO, From: CALLER, Body: 'How much?', MessageSid: 'SM10' }),
      deps(firm),
    )
    const firmXml = await firmResponse.text()
    expect(firmXml).not.toContain('$75')
    expect(firmXml).toContain('firm price')
    expect(firmXml).toContain('$200')

    const range = vi.fn<Qualify>(async () =>
      blankTurn({ reply: 'One workflow usually runs $200 to $300 a month, and Dan confirms after a look.' }),
    )
    const rangeResponse = await handleSmsRequest(
      signedRequest('/api/twilio/sms', { To: DEMO, From: '+19165550200', Body: 'How much for a workflow?', MessageSid: 'SM11' }),
      deps(range),
    )
    const rangeXml = await rangeResponse.text()
    expect(rangeXml).toContain('$200')
    expect(rangeXml).toContain('$300')
    expect(rangeXml).not.toContain("can't give a firm price")
  })

  it('does not call the model again when Twilio retries a handled message', async () => {
    const qualify = vi.fn<Qualify>(async () => blankTurn({ reply: 'What area is the job in?' }))
    const harness = deps(qualify)
    const request = () =>
      signedRequest('/api/twilio/sms', { To: DEMO, From: CALLER, Body: 'Leak', MessageSid: 'SM12' })
    await handleSmsRequest(request(), harness)
    await handleSmsRequest(request(), harness)
    expect(qualify).toHaveBeenCalledOnce()
  })

  it('falls back to a qualifying question when the model fails', async () => {
    const qualify = vi.fn<Qualify>(async () => {
      throw new Error('gateway down')
    })
    const response = await handleSmsRequest(
      signedRequest('/api/twilio/sms', { To: DEMO, From: CALLER, Body: 'Hello', MessageSid: 'SM13' }),
      deps(qualify),
    )
    expect(await response.text()).toContain(clients[0].qualifyingQuestions[0])
    expect(response.status).toBe(200)
  })

  it('does not escalate an ordinary unsure-about-the-symptom text', async () => {
    const sendSms = vi.fn<SendSms>()
    const qualify = vi.fn<Qualify>(async () => blankTurn({ reply: 'A leaking sink — what city are you in?' }))
    const response = await handleSmsRequest(
      signedRequest('/api/twilio/sms', {
        To: DEMO,
        From: CALLER,
        Body: "Not sure what's wrong, the sink is leaking",
        MessageSid: 'SM14',
      }),
      deps(qualify, sendSms),
    )
    expect(await response.text()).toContain('what city')
    expect(sendSms).not.toHaveBeenCalled()
  })
})

describe('sendTwilioSms', () => {
  it('posts only to the Messages API and from the number it was given', async () => {
    const calls: { url: string; body: string; authorization: string }[] = []
    await sendTwilioSms({
      accountSid: 'ACxxxxxxxx',
      authToken: 'secret-token',
      to: OWNER,
      from: DEMO,
      body: 'A lead needs you.',
      fetchImpl: async (url, init) => {
        const headers = new Headers(init.headers)
        calls.push({
          url,
          body: String(init.body),
          authorization: headers.get('authorization') ?? '',
        })
        return new Response('{}', { status: 201 })
      },
    })
    expect(calls).toHaveLength(1)
    expect(calls[0]?.url).toBe('https://api.twilio.com/2010-04-01/Accounts/ACxxxxxxxx/Messages.json')
    expect(calls[0]?.url).not.toContain('IncomingPhoneNumbers')
    expect(calls[0]?.body).toContain(`From=${encodeURIComponent(DEMO)}`)
    expect(calls[0]?.body).toContain(`To=${encodeURIComponent(OWNER)}`)
    expect(calls[0]?.authorization.startsWith('Basic ')).toBe(true)
  })

  it('fails without echoing the auth token', async () => {
    await expect(
      sendTwilioSms({
        accountSid: 'ACxxxxxxxx',
        authToken: 'secret-token',
        to: CALLER,
        from: DEMO,
        body: 'Hi',
        fetchImpl: async () => new Response('{"code":30034}', { status: 400 }),
      }),
    ).rejects.toThrow(/30034/)
  })
})
