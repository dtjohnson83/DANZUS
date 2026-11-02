import { emptyLead } from '@/lib/lead-flow/lead'
import { normalizePhone } from '@/lib/lead-flow/phone'
import {
  dialOwnerTwiml,
  hangupOnly,
  isMissedDial,
  isValidTwilioRequest,
  readTwilioForm,
  sayAndHangup,
  twimlResponse,
} from '@/lib/lead-flow/twilio'
import type { ClientConfig, LeadStore, SendSms } from '@/lib/lead-flow/types'

export type VoiceDeps = {
  authToken: string
  store: LeadStore
  clientForNumber: (to: string) => ClientConfig | undefined
  sendSms: SendSms
  now: () => Date
}

/**
 * Inbound call: ring the owner's cell first.
 * The Dial action posts back here with DialCallStatus. The missed-call
 * greeting and text-back run only for no-answer, busy, or failed.
 * An answered call (completed) gets a hangup and nothing else.
 * Numbers that are not in the client registry get a silent hangup and no dial.
 */
export async function handleVoiceRequest(request: Request, deps: VoiceDeps): Promise<Response> {
  if (!deps.authToken) {
    console.error('TWILIO_AUTH_TOKEN is not set')
    return new Response('Server error', { status: 500 })
  }

  const { params, url } = await readTwilioForm(request)
  const signature = request.headers.get('x-twilio-signature')
  if (!isValidTwilioRequest(deps.authToken, signature, url, params)) {
    console.error('Rejected voice webhook with an invalid Twilio signature')
    return new Response('Forbidden', { status: 403 })
  }

  const to = normalizePhone(params.get('To'))
  const config = to ? deps.clientForNumber(to) : undefined
  if (!config) {
    console.error('Ignored voice webhook for an unconfigured number')
    return twimlResponse(hangupOnly())
  }

  const dialStatus = params.get('DialCallStatus')
  if (dialStatus && !isMissedDial(dialStatus)) {
    return twimlResponse(hangupOnly())
  }

  const from = normalizePhone(params.get('From'))
  if (!dialStatus) {
    return twimlResponse(
      dialOwnerTwiml({
        forwardTo: config.forwardTo,
        callerId: from ?? config.twilioNumber,
        timeoutSeconds: config.ringTimeoutSeconds,
        actionUrl: url,
      }),
    )
  }

  const greeting = twimlResponse(sayAndHangup(config.greeting))
  if (!from) return greeting

  const callSid = params.get('CallSid') || `call-${deps.now().toISOString()}`
  const messageId = `call:${callSid}`
  const now = deps.now().toISOString()
  const existing = await deps.store.get(config.id, from)
  const prior = existing?.messages.find((message) => message.id === messageId)
  if (prior?.delivery === 'sent') return greeting

  const lead = existing ?? emptyLead(config, from, now)
  lead.messages = lead.messages.filter((message) => message.id !== messageId)
  lead.messages.push({
    id: messageId,
    direction: 'out',
    body: config.missedCallSms,
    at: now,
    delivery: 'pending',
  })
  if (lead.status === 'new') lead.status = 'qualifying'
  lead.updatedAt = now
  await deps.store.save(lead)

  try {
    await deps.sendSms({ to: from, from: config.twilioNumber, body: config.missedCallSms })
    const saved = await deps.store.get(config.id, from)
    if (saved) {
      saved.messages = saved.messages.map((message) =>
        message.id === messageId ? { ...message, delivery: 'sent' } : message,
      )
      saved.updatedAt = deps.now().toISOString()
      await deps.store.save(saved)
    }
  } catch (error) {
    console.error('Missed-call SMS failed', { callSid, dialStatus })
    console.error(error)
    const saved = await deps.store.get(config.id, from)
    if (saved) {
      saved.messages = saved.messages.map((message) =>
        message.id === messageId ? { ...message, delivery: 'failed' } : message,
      )
      await deps.store.save(saved)
    }
  }

  return greeting
}
