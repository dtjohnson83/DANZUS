import { Resend } from 'resend'

const FROM = 'DANZUS <dan@danzus.co>'
const REPLY_TO = 'danzus@mail.grokbot.com'

export type VoicemailNotice = {
  to: string
  businessName: string
  caller: string
  recordedAt: string
  timeZone: string
  durationSeconds: number
  recordingUrl: string
  transcript: string
  /** Recording SID when Twilio sent one, otherwise the call SID. */
  idempotencyId: string
  kind: 'recording' | 'transcript'
}

export type VoicemailEmailResult = {
  sent: boolean
  /** True when RESEND_API_KEY is unset. The webhook should still succeed. */
  skipped: boolean
  /** True when Resend already accepted this idempotency key. */
  duplicate: boolean
}

export type SendVoicemailEmail = (notice: VoicemailNotice) => Promise<VoicemailEmailResult>

export function formatVoicemailWhen(iso: string, timeZone: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone || 'UTC',
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  } catch {
    return date.toISOString()
  }
}

export function voicemailEmailContent(notice: VoicemailNotice): { subject: string; text: string } {
  const when = formatVoicemailWhen(notice.recordedAt, notice.timeZone)
  const transcript = notice.transcript.trim()
  const subject =
    notice.kind === 'transcript'
      ? `Voicemail transcript for ${oneLine(notice.businessName)}`
      : `Voicemail for ${oneLine(notice.businessName)}`
  const text = [
    notice.kind === 'transcript'
      ? `Transcript for a voicemail to ${notice.businessName}`
      : `New voicemail for ${notice.businessName}`,
    '',
    `Caller: ${notice.caller}`,
    `Time: ${when}`,
    `Duration: ${notice.durationSeconds} seconds`,
    `Recording: ${notice.recordingUrl}`,
    '',
    transcript ? `Transcript:\n${transcript}` : 'Transcript: not ready yet.',
  ].join('\n')
  return { subject, text }
}

/**
 * Email the business owner a finished voicemail.
 * Missing RESEND_API_KEY is a skip, not a throw, so the call flow still completes.
 */
export async function sendVoicemailEmail(notice: VoicemailNotice): Promise<VoicemailEmailResult> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('RESEND_API_KEY is not set; voicemail email skipped')
    return { sent: false, skipped: true, duplicate: false }
  }
  if (!notice.to.trim()) return { sent: false, skipped: true, duplicate: false }

  const { subject, text } = voicemailEmailContent(notice)
  const recordingUrl = safeHttpUrl(notice.recordingUrl)
  const html = [
    `<pre style="font-family:Georgia,serif;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
    recordingUrl ? `<p><a href="${escapeHtml(recordingUrl)}">Listen to the recording</a></p>` : '',
  ].join('')
  const idempotencyKey =
    notice.kind === 'transcript' ? `voicemail-transcript/${notice.idempotencyId}` : `voicemail/${notice.idempotencyId}`

  const resend = new Resend(key)
  const sent = await resend.emails.send(
    {
      from: FROM,
      to: notice.to,
      replyTo: REPLY_TO,
      subject,
      text,
      html,
    },
    { idempotencyKey: idempotencyKey.slice(0, 256) },
  )
  if (sent.error) {
    const statusCode = 'statusCode' in sent.error ? sent.error.statusCode : undefined
    if (statusCode === 409) return { sent: true, skipped: false, duplicate: true }
    console.error('Voicemail email was rejected', sent.error.message)
    return { sent: false, skipped: false, duplicate: false }
  }
  return { sent: true, skipped: false, duplicate: false }
}

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').slice(0, 120)
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function safeHttpUrl(value: string): string | null {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    return url.toString()
  } catch {
    return null
  }
}
