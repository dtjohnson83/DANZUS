import { needsHuman, sanitizePrices } from '@/lib/lead-flow/guard'
import { emptyLead, fillBlank } from '@/lib/lead-flow/lead'
import { normalizePhone, phonesEqual } from '@/lib/lead-flow/phone'
import { exampleSlots, matchSlot } from '@/lib/lead-flow/slots'
import { isValidTwilioRequest, messageTwiml, readTwilioForm, twimlResponse } from '@/lib/lead-flow/twilio'
import type {
  ClientConfig,
  Lead,
  LeadStatus,
  Qualify,
  QualifyAction,
  QualifyResult,
  LeadStore,
  SendSms,
} from '@/lib/lead-flow/types'

export type SmsDeps = {
  authToken: string
  store: LeadStore
  clientForNumber: (to: string) => ClientConfig | undefined
  qualify: Qualify
  sendSms: SendSms
  now: () => Date
}

const STOP = /^(stop|stopall|unsubscribe|cancel|end|quit)$/i
const START = /^(start|unstop)$/i
const HELP = /^(help|info)$/i

export const SMS_HELP_REPLY =
  'DANZUS Holdings LLC: For help, email dan@danzus.co or call (916) 404-6129. Msg freq varies. Msg&data rates may apply. Reply STOP to opt out.'

/**
 * Inbound SMS webhook. The reply is TwiML so Twilio sends it.
 * Owner escalation is a separate Messages API send from the client's number.
 */
export async function handleSmsRequest(request: Request, deps: SmsDeps): Promise<Response> {
  if (!deps.authToken) {
    console.error('TWILIO_AUTH_TOKEN is not set')
    return new Response('Server error', { status: 500 })
  }

  const { params, url } = await readTwilioForm(request)
  const signature = request.headers.get('x-twilio-signature')
  if (!isValidTwilioRequest(deps.authToken, signature, url, params)) {
    console.error('Rejected SMS webhook with an invalid Twilio signature')
    return new Response('Forbidden', { status: 403 })
  }

  const to = normalizePhone(params.get('To'))
  const config = to ? deps.clientForNumber(to) : undefined
  if (!config) {
    console.error('Ignored SMS webhook for an unconfigured number')
    return twimlResponse('')
  }

  const from = normalizePhone(params.get('From'))
  const messageSid = params.get('MessageSid') || ''
  if (!from || !messageSid) return twimlResponse('')

  const now = deps.now().toISOString()
  const existing = await deps.store.get(config.id, from)
  const lead = existing ?? emptyLead(config, from, now)
  const outboundId = `out:${messageSid}`
  const alreadyReplied = lead.messages.find((message) => message.id === outboundId)
  if (alreadyReplied) return twimlResponse(messageTwiml(alreadyReplied.body))

  const body = (params.get('Body') || '').trim()
  const numMedia = Number(params.get('NumMedia') || '0')
  const alreadyLogged = lead.messages.some((message) => message.id === messageSid)
  if (!alreadyLogged) {
    lead.messages.push({ id: messageSid, direction: 'in', body: body || '(no text)', at: now })
    lead.updatedAt = now
    await deps.store.save(lead)
  }

  const keywordReply = keywordResponse(config, lead, body)
  if (keywordReply !== null) {
    return finish(deps, config, lead, messageSid, keywordReply, false)
  }
  if (lead.optedOut) return twimlResponse('')

  if (!body && numMedia > 0) {
    return finish(
      deps,
      config,
      lead,
      messageSid,
      "I can't open pictures on this line yet. Can you describe the job in a sentence?",
      false,
    )
  }
  if (!body) {
    return finish(deps, config, lead, messageSid, config.qualifyingQuestions[0], false)
  }

  const slots = exampleSlots(config, deps.now())
  const history: Lead = { ...lead, messages: lead.messages.filter((message) => message.id !== messageSid) }
  let turn: QualifyResult
  try {
    turn = await deps.qualify({ config, lead: history, slots, inbound: body })
  } catch (error) {
    console.error('Lead qualify failed', { messageSid })
    console.error(error)
    turn = {
      reply: config.qualifyingQuestions[0],
      action: 'continue',
      name: '',
      jobType: '',
      area: '',
      timing: '',
      budgetNote: '',
      selectedSlot: '',
      escalationReason: '',
    }
  }

  const decided = decideTurn(config, lead, body, slots, turn)
  lead.name = fillBlank(lead.name, decided.name)
  lead.jobType = fillBlank(lead.jobType, decided.jobType)
  lead.area = fillBlank(lead.area, decided.area)
  lead.timing = fillBlank(lead.timing, decided.timing)
  lead.budgetNote = fillBlank(lead.budgetNote, decided.budgetNote)
  if (decided.action === 'book' && decided.slot) {
    lead.bookedSlot = decided.slot
    lead.status = 'booked'
  } else if (decided.action === 'escalate') {
    lead.status = 'escalated'
    lead.escalationReason = decided.escalationReason || lead.escalationReason || 'Lead needs a person'
  } else {
    lead.status = nextStatus(lead.status, decided.action)
  }

  const notifyOwner = lead.status === 'escalated' && !lead.ownerNotified && !phonesEqual(lead.phone, config.ownerPhone)
  return finish(deps, config, lead, messageSid, decided.reply, notifyOwner, body)
}

function keywordResponse(config: ClientConfig, lead: Lead, body: string): string | null {
  if (STOP.test(body)) {
    lead.optedOut = true
    return `You're unsubscribed from ${config.businessName} and won't get more texts. Reply START to opt back in.`
  }
  if (lead.optedOut && !START.test(body)) return null
  if (START.test(body)) {
    lead.optedOut = false
    lead.status = lead.status === 'new' ? 'qualifying' : lead.status
    return `Welcome back to ${config.businessName}. ${config.qualifyingQuestions[0]}`
  }
  if (HELP.test(body)) return SMS_HELP_REPLY
  return null
}

export function decideTurn(
  config: ClientConfig,
  lead: Lead,
  inbound: string,
  slots: string[],
  turn: QualifyResult,
): { action: QualifyAction; reply: string; slot: string; name: string; jobType: string; area: string; timing: string; budgetNote: string; escalationReason: string } {
  let action = turn.action
  let slot = ''
  const forcedEscalation = needsHuman(inbound) && action !== 'escalate'
  if (needsHuman(inbound)) action = 'escalate'
  if (action === 'book') {
    slot = matchSlot(turn.selectedSlot, slots) ?? ''
    if (!slot) action = 'offer_slots'
  }

  let reply = forcedEscalation ? '' : turn.reply.trim() || config.qualifyingQuestions[0]
  if (action === 'book' && slot) {
    if (!reply.includes(slot)) {
      reply = `You're booked with ${config.businessName} for ${slot}. We'll text if anything changes. Reply here if you need to move it.`
    }
  } else if (action === 'offer_slots') {
    reply = withSlots(reply, slots)
  } else if (action === 'escalate') {
    reply = withFollowUp(reply, config)
  }

  reply = sanitizePrices(reply, config.allowedPriceRanges)
  if (action === 'book' && slot && !reply.includes(slot)) {
    reply = `You're booked with ${config.businessName} for ${slot}. We'll text if anything changes. Reply here if you need to move it.`
  }
  if (action === 'escalate') reply = withFollowUp(reply, config)
  if (action === 'offer_slots') reply = withSlots(reply, slots)

  return {
    action,
    reply: limitSms(reply),
    slot,
    name: turn.name,
    jobType: turn.jobType,
    area: turn.area,
    timing: turn.timing,
    budgetNote: turn.budgetNote,
    escalationReason: turn.escalationReason.trim() || (needsHuman(inbound) ? 'Lead was upset or unsure' : ''),
  }
}

function withSlots(reply: string, slots: string[]): string {
  if (slots.length === 0) return reply
  if (slots.every((slot) => reply.includes(slot))) return reply
  return `${reply.trim()} Openings: ${slots.join('; ')}.`
}

function withFollowUp(reply: string, config: ClientConfig): string {
  if (/owner/i.test(reply) && /follow up/i.test(reply)) return reply
  return `The owner of ${config.businessName} will follow up with you directly. ${reply}`.trim()
}

function limitSms(text: string, max = 480): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trimEnd()}…`
}

function nextStatus(current: LeadStatus, action: QualifyAction): LeadStatus {
  if (current === 'booked' || current === 'escalated') return current
  if (action === 'offer_slots') return 'slots_offered'
  return 'qualifying'
}

async function finish(
  deps: SmsDeps,
  config: ClientConfig,
  lead: Lead,
  messageSid: string,
  reply: string,
  notifyOwner: boolean,
  inbound = '',
): Promise<Response> {
  const now = deps.now().toISOString()
  if (notifyOwner) {
    try {
      await deps.sendSms({
        to: config.ownerPhone,
        from: config.twilioNumber,
        body: ownerAlert(config, lead, inbound),
      })
      lead.ownerNotified = true
    } catch (error) {
      console.error('Owner escalation SMS failed', { messageSid })
      console.error(error)
    }
  }

  lead.messages.push({
    id: `out:${messageSid}`,
    direction: 'out',
    body: reply,
    at: now,
    delivery: 'twiml',
  })
  lead.updatedAt = now
  await deps.store.save(lead)
  return twimlResponse(messageTwiml(reply))
}

function ownerAlert(config: ClientConfig, lead: Lead, inbound: string): string {
  const text = [
    `${config.businessName}: a lead needs you.`,
    `From ${lead.phone}.`,
    lead.escalationReason ? `Why: ${lead.escalationReason}.` : '',
    lead.jobType ? `Job: ${lead.jobType}.` : '',
    lead.area ? `Area: ${lead.area}.` : '',
    lead.timing ? `Timing: ${lead.timing}.` : '',
    inbound ? `They said: ${inbound.slice(0, 140)}` : '',
  ]
    .filter(Boolean)
    .join(' ')
  return text.length > 320 ? `${text.slice(0, 319).trimEnd()}…` : text
}
