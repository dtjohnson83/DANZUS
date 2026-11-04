import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  handleRecordingRequest,
  handleTranscriptionRequest,
  type RecordingDeps,
} from '@/lib/lead-flow/handle-recording'
import { handleSmsRequest } from '@/lib/lead-flow/handle-sms'
import { handleVoiceRequest } from '@/lib/lead-flow/handle-voice'
import { createMemoryStore } from '@/lib/lead-flow/memory-store'
import { clientById, clientForInboundNumber, clients } from '@/lib/lead-flow/registry'
import { exampleSlots } from '@/lib/lead-flow/slots'
import { sendTwilioSms, twilioSignature, xmlEscape } from '@/lib/lead-flow/twilio'
import type { Qualify, QualifyResult, SendSms } from '@/lib/lead-flow/types'
import type { SendVoicemailEmail } from '@/lib/lead-flow/voicemail-email'

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
    expect(clients[0]?.ownerEmail).toBe('dan@danzus.co')
    expect(clients[0]?.greeting).toBe(
      "Sorry we missed you. Leave a message after the tone and we'll also text you right now.",
    )
    expect(clients[0]?.voicemail).toMatchObject({ enabled: true, maxLengthSeconds: 120, playBeep: true, transcribe: true })
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
      expect(xml).toContain(`<Say>${xmlEscape(clients[0].greeting)}</Say>`)
      expect(xml).toContain('action="https://danzus.co/api/twilio/voice/recording"')
      expect(xml).toContain('recordingStatusCallback="https://danzus.co/api/twilio/voice/recording"')
      expect(xml).toContain('maxLength="120"')
      expect(xml).toContain('playBeep="true"')
      expect(xml).toContain('transcribe="true"')
      expect(xml).toContain('transcribeCallback="https://danzus.co/api/twilio/voice/transcription"')
      expect(xml).not.toContain('<Hangup/>')
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
    const xml = await response.text()
    expect(xml).toContain('Sorry we missed you')
    expect(xml).toContain('<Record')
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

  it('hangs up after the greeting when voicemail is turned off for the client', async () => {
    const sendSms = vi.fn<SendSms>()
    const quiet = {
      ...clients[0],
      greeting: 'Sorry we missed you, we will text you right now',
      voicemail: { ...clients[0].voicemail, enabled: false },
    }
    const response = await handleVoiceRequest(
      signedRequest('/api/twilio/voice', { To: DEMO, From: CALLER, CallSid: 'CA-quiet', DialCallStatus: 'no-answer' }),
      {
        authToken: TOKEN,
        store: createMemoryStore(),
        clientForNumber: () => quiet,
        sendSms,
        now: () => NOW,
      },
    )
    const xml = await response.text()
    expect(xml).toContain(`<Say>${xmlEscape(quiet.greeting)}</Say><Hangup/>`)
    expect(xml).not.toContain('<Record')
    expect(sendSms).toHaveBeenCalledTimes(1)
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

  it('replaces an off-menu price and keeps an approved menu quote', async () => {
    const firm = vi.fn<Qualify>(async () => blankTurn({ reply: "That'll be $75 flat." }))
    const firmResponse = await handleSmsRequest(
      signedRequest('/api/twilio/sms', { To: DEMO, From: CALLER, Body: 'How much?', MessageSid: 'SM10' }),
      deps(firm),
    )
    const firmXml = await firmResponse.text()
    expect(firmXml).not.toMatch(/\$75(?!\d)/)
    expect(firmXml).not.toContain('$200')
    expect(firmXml).toContain('$99')
    expect(firmXml).toContain('$1,500')
    expect(firmXml).toContain('$49')
    expect(firmXml).toContain('$199')
    expect(firmXml).toContain('$299')
    expect(firmXml).toContain('$750')
    expect(firmXml).toContain('30-day pilot')
    expect(firmXml).not.toMatch(/GoHighLevel|App Orchid|DimeVision/i)

    const menu = vi.fn<Qualify>(async () =>
      blankTurn({
        reply:
          'Missed-call text-back is $99 a month after a free 30-day pilot. A website is $1,500 plus $49 a month. Google and AI search is $199 a month. The bundle is $299 a month, and the website is $750 with a 6-month commitment.',
      }),
    )
    const menuResponse = await handleSmsRequest(
      signedRequest('/api/twilio/sms', { To: DEMO, From: '+19165550200', Body: 'How much for text-back?', MessageSid: 'SM11' }),
      deps(menu),
    )
    const menuXml = await menuResponse.text()
    expect(menuXml).toContain('Missed-call text-back is $99')
    expect(menuXml).toContain('$750 with a 6-month commitment')
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

describe('voicemail webhooks', () => {
  const RECORDING_URL = 'https://api.twilio.com/2010-04-01/Accounts/ACxxx/Recordings/RE1'

  function harness(store = createMemoryStore(), sendOwnerEmail?: SendVoicemailEmail, sendSms = vi.fn<SendSms>()): RecordingDeps {
    return {
      authToken: TOKEN,
      store,
      clientForNumber: clientForInboundNumber,
      clientById,
      sendSms,
      sendOwnerEmail:
        sendOwnerEmail ??
        vi.fn<SendVoicemailEmail>(async () => ({ sent: true, skipped: false, duplicate: false })),
      now: () => NOW,
    }
  }

  it('rejects an invalid recording signature', async () => {
    const sendOwnerEmail = vi.fn<SendVoicemailEmail>()
    const response = await handleRecordingRequest(
      signedRequest('/api/twilio/voice/recording', { CallSid: 'CA-vm', RecordingUrl: RECORDING_URL, To: DEMO, From: CALLER }),
      { ...harness(createMemoryStore(), sendOwnerEmail), authToken: 'nope' },
    )
    expect(response.status).toBe(403)
    expect(sendOwnerEmail).not.toHaveBeenCalled()
  })

  it('stores the recording, emails the owner, and does not text the caller', async () => {
    const store = createMemoryStore()
    const callerSms = vi.fn<SendSms>()
    await handleVoiceRequest(
      signedRequest('/api/twilio/voice', { To: DEMO, From: CALLER, CallSid: 'CA-vm', DialCallStatus: 'no-answer' }),
      {
        authToken: TOKEN,
        store,
        clientForNumber: clientForInboundNumber,
        sendSms: callerSms,
        now: () => NOW,
      },
    )
    expect(callerSms).toHaveBeenCalledTimes(1)

    const sendSms = vi.fn<SendSms>()
    const sendOwnerEmail = vi.fn<SendVoicemailEmail>(async () => ({ sent: true, skipped: false, duplicate: false }))
    const response = await handleRecordingRequest(
      signedRequest('/api/twilio/voice/recording', {
        To: DEMO,
        From: CALLER,
        CallSid: 'CA-vm',
        RecordingSid: 'RE1',
        RecordingUrl: RECORDING_URL,
        RecordingDuration: '18',
      }),
      harness(store, sendOwnerEmail, sendSms),
    )
    expect(await response.text()).toContain('Thanks. We got your message.')
    expect(sendSms).not.toHaveBeenCalled()
    expect(sendOwnerEmail).toHaveBeenCalledTimes(1)
    expect(sendOwnerEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'dan@danzus.co',
        caller: '+1 (916) 555-0199',
        durationSeconds: 18,
        recordingUrl: RECORDING_URL,
        transcript: '',
        kind: 'recording',
      }),
    )
    const lead = await store.get(clients[0].id, CALLER)
    expect(lead?.voicemails[0]).toMatchObject({
      callSid: 'CA-vm',
      recordingSid: 'RE1',
      recordingUrl: RECORDING_URL,
      durationSeconds: 18,
      ownerTexted: false,
    })
    expect(lead?.voicemails[0]?.ownerEmailedAt).not.toBe('')
    expect(lead?.messages[0]?.body).toBe(clients[0].missedCallSms)
  })

  it('emails once when the recording status callback repeats', async () => {
    const store = createMemoryStore()
    await handleVoiceRequest(
      signedRequest('/api/twilio/voice', { To: DEMO, From: CALLER, CallSid: 'CA-status', DialCallStatus: 'busy' }),
      {
        authToken: TOKEN,
        store,
        clientForNumber: clientForInboundNumber,
        sendSms: vi.fn<SendSms>(),
        now: () => NOW,
      },
    )
    const sendOwnerEmail = vi.fn<SendVoicemailEmail>(async () => ({ sent: true, skipped: false, duplicate: false }))
    const deps = harness(store, sendOwnerEmail)
    const request = () =>
      signedRequest('/api/twilio/voice/recording', {
        CallSid: 'CA-status',
        RecordingSid: 'RE2',
        RecordingUrl: RECORDING_URL,
        RecordingDuration: '9',
        RecordingStatus: 'completed',
      })
    const first = await handleRecordingRequest(request(), deps)
    const second = await handleRecordingRequest(request(), deps)
    expect(first.status).toBe(200)
    expect(second.status).toBe(200)
    expect(sendOwnerEmail).toHaveBeenCalledTimes(1)
    expect((await store.get(clients[0].id, CALLER))?.voicemails).toHaveLength(1)
  })

  it('texts the owner only when that client flag is on', async () => {
    const store = createMemoryStore()
    const texting = { ...clients[0], voicemail: { ...clients[0].voicemail, textOwner: true } }
    const sendSms = vi.fn<SendSms>()
    const response = await handleRecordingRequest(
      signedRequest('/api/twilio/voice/recording', {
        To: DEMO,
        From: CALLER,
        CallSid: 'CA-text',
        RecordingSid: 'RE3',
        RecordingUrl: RECORDING_URL,
        RecordingDuration: '4',
      }),
      {
        ...harness(store, undefined, sendSms),
        clientForNumber: () => texting,
      },
    )
    expect(response.status).toBe(200)
    expect(sendSms).toHaveBeenCalledTimes(1)
    expect(sendSms).toHaveBeenCalledWith(
      expect.objectContaining({ to: OWNER, from: DEMO, body: expect.stringContaining(RECORDING_URL) }),
    )
    expect(sendSms.mock.calls[0]?.[0].body).not.toContain(TOKEN)
    expect((await store.get(clients[0].id, CALLER))?.voicemails[0]?.ownerTexted).toBe(true)
  })

  it('keeps the recording when email is not configured', async () => {
    const store = createMemoryStore()
    const sendOwnerEmail = vi.fn<SendVoicemailEmail>(async () => ({ sent: false, skipped: true, duplicate: false }))
    const response = await handleRecordingRequest(
      signedRequest('/api/twilio/voice/recording', {
        To: DEMO,
        From: CALLER,
        CallSid: 'CA-skip',
        RecordingSid: 'RE4',
        RecordingUrl: RECORDING_URL,
        RecordingDuration: '6',
        RecordingStatus: 'completed',
      }),
      harness(store, sendOwnerEmail),
    )
    expect(response.status).toBe(200)
    const saved = (await store.get(clients[0].id, CALLER))?.voicemails[0]
    expect(saved?.recordingUrl).toBe(RECORDING_URL)
    expect(saved?.ownerEmailedAt).toBe('')
  })

  it('asks Twilio to retry a failed owner email on the status callback', async () => {
    const store = createMemoryStore()
    const sendOwnerEmail = vi.fn<SendVoicemailEmail>()
    sendOwnerEmail.mockResolvedValueOnce({ sent: false, skipped: false, duplicate: false })
    sendOwnerEmail.mockResolvedValueOnce({ sent: true, skipped: false, duplicate: false })
    const deps = harness(store, sendOwnerEmail)
    const request = () =>
      signedRequest('/api/twilio/voice/recording', {
        To: DEMO,
        From: CALLER,
        CallSid: 'CA-retry',
        RecordingSid: 'RE5',
        RecordingUrl: RECORDING_URL,
        RecordingDuration: '11',
        RecordingStatus: 'completed',
      })
    const first = await handleRecordingRequest(request(), deps)
    expect(first.status).toBe(500)
    expect((await store.get(clients[0].id, CALLER))?.voicemails[0]?.ownerEmailedAt).toBe('')
    const second = await handleRecordingRequest(request(), deps)
    expect(second.status).toBe(200)
    expect((await store.get(clients[0].id, CALLER))?.voicemails[0]?.ownerEmailedAt).not.toBe('')
  })

  it('rejects an invalid transcription signature', async () => {
    const sendOwnerEmail = vi.fn<SendVoicemailEmail>()
    const response = await handleTranscriptionRequest(
      signedRequest('/api/twilio/voice/transcription', {
        CallSid: 'CA-tr',
        TranscriptionStatus: 'completed',
        TranscriptionText: 'Need a website',
        To: DEMO,
        From: CALLER,
      }),
      { ...harness(createMemoryStore(), sendOwnerEmail), authToken: 'nope' },
    )
    expect(response.status).toBe(403)
    expect(sendOwnerEmail).not.toHaveBeenCalled()
  })

  it('stores the transcript and emails it after the recording notice', async () => {
    const store = createMemoryStore()
    const sendOwnerEmail = vi.fn<SendVoicemailEmail>(async () => ({ sent: true, skipped: false, duplicate: false }))
    const deps = harness(store, sendOwnerEmail)
    await handleRecordingRequest(
      signedRequest('/api/twilio/voice/recording', {
        To: DEMO,
        From: CALLER,
        CallSid: 'CA-tr',
        RecordingSid: 'RE6',
        RecordingUrl: RECORDING_URL,
        RecordingDuration: '15',
      }),
      deps,
    )
    const response = await handleTranscriptionRequest(
      signedRequest('/api/twilio/voice/transcription', {
        To: DEMO,
        From: CALLER,
        CallSid: 'CA-tr',
        RecordingSid: 'RE6',
        RecordingUrl: RECORDING_URL,
        TranscriptionStatus: 'completed',
        TranscriptionText: 'We missed a call yesterday.',
      }),
      deps,
    )
    expect(response.status).toBe(200)
    expect(sendOwnerEmail).toHaveBeenCalledTimes(2)
    expect(sendOwnerEmail.mock.calls[1]?.[0]).toMatchObject({
      kind: 'transcript',
      transcript: 'We missed a call yesterday.',
      recordingUrl: RECORDING_URL,
    })
    const saved = (await store.get(clients[0].id, CALLER))?.voicemails[0]
    expect(saved?.transcript).toBe('We missed a call yesterday.')
    expect(saved?.transcriptEmailedAt).not.toBe('')
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
