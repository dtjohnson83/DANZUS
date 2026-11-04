import { blobLeadStore } from '@/lib/lead-flow/blob-store'
import type { RecordingDeps } from '@/lib/lead-flow/handle-recording'
import type { SmsDeps } from '@/lib/lead-flow/handle-sms'
import type { VoiceDeps } from '@/lib/lead-flow/handle-voice'
import { qualifyWithModel } from '@/lib/lead-flow/qualify'
import { clientById, clientForInboundNumber } from '@/lib/lead-flow/registry'
import { sendTwilioSms } from '@/lib/lead-flow/twilio'
import type { SendSms } from '@/lib/lead-flow/types'
import { sendVoicemailEmail } from '@/lib/lead-flow/voicemail-email'

function sendSms(): SendSms {
  return (message) =>
    sendTwilioSms({
      accountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
      authToken: process.env.TWILIO_AUTH_TOKEN ?? '',
      to: message.to,
      from: message.from,
      body: message.body,
    })
}

export function voiceDeps(): VoiceDeps {
  return {
    authToken: process.env.TWILIO_AUTH_TOKEN ?? '',
    store: blobLeadStore,
    clientForNumber: clientForInboundNumber,
    sendSms: sendSms(),
    now: () => new Date(),
  }
}

export function smsDeps(): SmsDeps {
  return {
    authToken: process.env.TWILIO_AUTH_TOKEN ?? '',
    store: blobLeadStore,
    clientForNumber: clientForInboundNumber,
    qualify: qualifyWithModel,
    sendSms: sendSms(),
    now: () => new Date(),
  }
}

export function recordingDeps(): RecordingDeps {
  return {
    authToken: process.env.TWILIO_AUTH_TOKEN ?? '',
    store: blobLeadStore,
    clientForNumber: clientForInboundNumber,
    clientById,
    sendSms: sendSms(),
    sendOwnerEmail: sendVoicemailEmail,
    now: () => new Date(),
  }
}
