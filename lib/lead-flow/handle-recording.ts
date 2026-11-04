import { emptyLead, normalizeLead } from '@/lib/lead-flow/lead'
import { formatPhone, normalizePhone } from '@/lib/lead-flow/phone'
import { hangupOnly, isValidTwilioRequest, readTwilioForm, twimlResponse } from '@/lib/lead-flow/twilio'
import type { SendVoicemailEmail, VoicemailEmailResult, VoicemailNotice } from '@/lib/lead-flow/voicemail-email'
import type { ClientConfig, Lead, LeadStore, SendSms, Voicemail } from '@/lib/lead-flow/types'

export type RecordingDeps = {
  authToken: string
  store: LeadStore
  clientForNumber: (to: string) => ClientConfig | undefined
  clientById: (id: string) => ClientConfig | undefined
  sendSms: SendSms
  sendOwnerEmail: SendVoicemailEmail
  now: () => Date
}

const THANKS = '<Say>Thanks. We got your message.</Say><Hangup/>'

/**
 * Twilio `<Record>` action and recording-status callback.
 * Stores the file on the lead and emails the owner. The missed-call text
 * already went out when the dial failed, so this does not text the caller.
 */
export async function handleRecordingRequest(request: Request, deps: RecordingDeps): Promise<Response> {
  const auth = await authorize(request, deps.authToken, 'recording')
  if (auth instanceof Response) return auth
  const { params } = auth

  const recordingStatus = params.get('RecordingStatus')
  if (recordingStatus && recordingStatus !== 'completed') return twimlResponse(hangupOnly())

  const recordingUrl = (params.get('RecordingUrl') || '').trim()
  const callSid = params.get('CallSid') || ''
  const isStatusCallback = Boolean(recordingStatus)
  if (!recordingUrl || !callSid) {
    return isStatusCallback ? twimlResponse('') : twimlResponse(hangupOnly())
  }

  const patch = blankVoicemail(params, deps.now())
  patch.recordingUrl = recordingUrl
  return finishRecording(deps, params, patch, isStatusCallback)
}

/**
 * Twilio transcription callback for `<Record transcribe="true">`.
 * The transcript often arrives after the recording email. A follow-up
 * email goes out once, and only when we already have a recording URL.
 */
export async function handleTranscriptionRequest(request: Request, deps: RecordingDeps): Promise<Response> {
  const auth = await authorize(request, deps.authToken, 'transcription')
  if (auth instanceof Response) return auth
  const { params } = auth

  const status = params.get('TranscriptionStatus') || ''
  const transcript = (params.get('TranscriptionText') || '').trim()
  const callSid = params.get('CallSid') || ''
  if (!callSid || (status && status !== 'completed') || !transcript) return twimlResponse('')

  const patch = blankVoicemail(params, deps.now())
  patch.transcript = transcript
  patch.recordingUrl = (params.get('RecordingUrl') || '').trim()
  const failed = await finishRecording(deps, params, patch, true)
  return failed
}

async function finishRecording(
  deps: RecordingDeps,
  params: URLSearchParams,
  patch: Voicemail,
  statusStyle: boolean,
): Promise<Response> {
  const from = normalizePhone(params.get('From'))
  const to = normalizePhone(params.get('To'))
  const located = await locateLead(deps, { to, from, callSid: patch.callSid })
  if (!located.config) {
    console.error('Ignored voicemail webhook for an unconfigured number', { callSid: patch.callSid })
    return twimlResponse(hangupOnly())
  }

  const phone = from ?? located.lead?.phone ?? ''
  if (!phone) {
    const emailFailed = await notifyOwner(deps, located.config, patch, '', false)
    if (emailFailed && statusStyle) return new Response('Email failed', { status: 500 })
    return statusStyle ? twimlResponse('') : twimlResponse(patch.recordingUrl ? THANKS : hangupOnly())
  }

  const now = deps.now().toISOString()
  const existing = located.lead ?? (await deps.store.get(located.config.id, phone))
  const lead = existing ?? emptyLead(located.config, phone, now)
  normalizeLead(lead)
  const vm = applyVoicemail(lead, patch)
  lead.updatedAt = now
  await deps.store.save(lead)

  const emailFailed = await notifyOwner(deps, located.config, vm, phone, true)
  await persistFlags(deps, lead, vm)

  if (emailFailed && statusStyle) return new Response('Email failed', { status: 500 })
  if (statusStyle) return twimlResponse('')
  return twimlResponse(THANKS)
}

async function authorize(
  request: Request,
  authToken: string,
  label: string,
): Promise<{ params: URLSearchParams; url: string } | Response> {
  if (!authToken) {
    console.error('TWILIO_AUTH_TOKEN is not set')
    return new Response('Server error', { status: 500 })
  }
  const { params, url } = await readTwilioForm(request)
  const signature = request.headers.get('x-twilio-signature')
  if (!isValidTwilioRequest(authToken, signature, url, params)) {
    console.error(`Rejected ${label} webhook with an invalid Twilio signature`)
    return new Response('Forbidden', { status: 403 })
  }
  return { params, url }
}

async function locateLead(
  deps: RecordingDeps,
  input: { to: string | null; from: string | null; callSid: string },
): Promise<{ config?: ClientConfig; lead: Lead | null }> {
  let config = input.to ? deps.clientForNumber(input.to) : undefined
  let lead: Lead | null = null
  if (config && input.from) lead = await deps.store.get(config.id, input.from)
  if (!lead && input.callSid) {
    const found = await findLeadByCall(deps.store, input.callSid)
    if (found) {
      lead = found
      config = config ?? deps.clientById(found.clientId)
    }
  }
  return { config, lead }
}

async function findLeadByCall(store: LeadStore, callSid: string): Promise<Lead | null> {
  const leads = await store.list()
  return (
    leads.find(
      (lead) =>
        lead.voicemails.some((item) => item.callSid === callSid) ||
        lead.messages.some((message) => message.id === `call:${callSid}`),
    ) ?? null
  )
}

function blankVoicemail(params: URLSearchParams, now: Date): Voicemail {
  return {
    callSid: params.get('CallSid') || '',
    recordingSid: params.get('RecordingSid') || '',
    recordingUrl: '',
    durationSeconds: seconds(params.get('RecordingDuration')),
    transcript: '',
    recordedAt: recordedAtFrom(params, now),
    ownerEmailedAt: '',
    transcriptEmailedAt: '',
    ownerTexted: false,
  }
}

function applyVoicemail(lead: Lead, patch: Voicemail): Voicemail {
  normalizeLead(lead)
  const index = lead.voicemails.findIndex(
    (item) => item.callSid === patch.callSid || (patch.recordingSid !== '' && item.recordingSid === patch.recordingSid),
  )
  if (index === -1) {
    lead.voicemails.push(patch)
    return patch
  }
  const current = lead.voicemails[index]
  const merged: Voicemail = {
    callSid: current.callSid || patch.callSid,
    recordingSid: patch.recordingSid || current.recordingSid,
    recordingUrl: patch.recordingUrl || current.recordingUrl,
    durationSeconds: patch.durationSeconds || current.durationSeconds,
    transcript: patch.transcript || current.transcript,
    recordedAt: current.recordedAt || patch.recordedAt,
    ownerEmailedAt: current.ownerEmailedAt || patch.ownerEmailedAt,
    transcriptEmailedAt: current.transcriptEmailedAt || patch.transcriptEmailedAt,
    ownerTexted: current.ownerTexted || patch.ownerTexted,
  }
  lead.voicemails[index] = merged
  return merged
}

async function persistFlags(deps: RecordingDeps, lead: Lead, vm: Voicemail): Promise<void> {
  const latest = (await deps.store.get(lead.clientId, lead.phone)) ?? lead
  normalizeLead(latest)
  const current = latest.voicemails.find((item) => item.callSid === vm.callSid)
  if (!current) {
    latest.voicemails.push(vm)
  } else {
    current.recordingSid = current.recordingSid || vm.recordingSid
    current.recordingUrl = current.recordingUrl || vm.recordingUrl
    current.durationSeconds = current.durationSeconds || vm.durationSeconds
    current.transcript = current.transcript || vm.transcript
    current.recordedAt = current.recordedAt || vm.recordedAt
    current.ownerEmailedAt = current.ownerEmailedAt || vm.ownerEmailedAt
    current.transcriptEmailedAt = current.transcriptEmailedAt || vm.transcriptEmailedAt
    current.ownerTexted = current.ownerTexted || vm.ownerTexted
  }
  latest.updatedAt = deps.now().toISOString()
  await deps.store.save(latest)
}

async function notifyOwner(
  deps: RecordingDeps,
  config: ClientConfig,
  vm: Voicemail,
  callerPhone: string,
  persistSms: boolean,
): Promise<boolean> {
  let emailFailed = false
  const caller = callerPhone ? formatPhone(callerPhone) : 'Caller ID withheld'
  if (vm.recordingUrl && config.ownerEmail && !vm.ownerEmailedAt) {
    const result = await sendNotice(deps, config, vm, caller, 'recording')
    if (result.sent) {
      vm.ownerEmailedAt = deps.now().toISOString()
      if (vm.transcript && !result.duplicate) vm.transcriptEmailedAt = deps.now().toISOString()
    } else if (!result.skipped) emailFailed = true
  }
  if (!emailFailed && vm.recordingUrl && vm.transcript && vm.ownerEmailedAt && !vm.transcriptEmailedAt) {
    const result = await sendNotice(deps, config, vm, caller, 'transcript')
    if (result.sent) vm.transcriptEmailedAt = deps.now().toISOString()
    else if (!result.skipped) emailFailed = true
  }

  if (persistSms && config.voicemail.textOwner && vm.recordingUrl && !vm.ownerTexted) {
    try {
      await deps.sendSms({
        to: config.ownerPhone,
        from: config.twilioNumber,
        body: ownerVoicemailText(config, caller, vm),
      })
      vm.ownerTexted = true
    } catch (error) {
      console.error('Owner voicemail SMS failed', { callSid: vm.callSid })
      console.error(error)
    }
  }
  return emailFailed
}

async function sendNotice(
  deps: RecordingDeps,
  config: ClientConfig,
  vm: Voicemail,
  caller: string,
  kind: VoicemailNotice['kind'],
): Promise<VoicemailEmailResult> {
  try {
    return await deps.sendOwnerEmail({
      to: config.ownerEmail,
      businessName: config.businessName,
      caller,
      recordedAt: vm.recordedAt,
      timeZone: config.hours.timezone,
      durationSeconds: vm.durationSeconds,
      recordingUrl: vm.recordingUrl,
      transcript: vm.transcript,
      idempotencyId: vm.recordingSid || vm.callSid,
      kind,
    })
  } catch (error) {
    console.error('Voicemail email failed', { callSid: vm.callSid })
    console.error(error)
    return { sent: false, skipped: false, duplicate: false }
  }
}

function ownerVoicemailText(config: ClientConfig, caller: string, vm: Voicemail): string {
  const text = `${config.businessName} voicemail from ${caller} (${vm.durationSeconds}s). ${vm.recordingUrl}`
  return text.length > 320 ? `${text.slice(0, 319).trimEnd()}…` : text
}

function seconds(value: string | null): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) return 0
  return Math.round(parsed)
}

function recordedAtFrom(params: URLSearchParams, now: Date): string {
  const start = params.get('RecordingStartTime')
  if (start) {
    const parsed = new Date(start)
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString()
  }
  return now.toISOString()
}
