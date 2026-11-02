import { createHmac, timingSafeEqual } from 'node:crypto'

export function publicWebhookUrl(request: Request): string {
  const requestUrl = new URL(request.url)
  const configured = process.env.TWILIO_WEBHOOK_BASE_URL?.trim().replace(/\/$/, '')
  if (configured) return `${configured}${requestUrl.pathname}${requestUrl.search}`
  const proto = headerValue(request, 'x-forwarded-proto') ?? requestUrl.protocol.replace(/:$/, '')
  const host = headerValue(request, 'x-forwarded-host') ?? headerValue(request, 'host') ?? requestUrl.host
  return `${proto}://${host}${requestUrl.pathname}${requestUrl.search}`
}

function headerValue(request: Request, name: string): string | undefined {
  const value = request.headers.get(name)
  if (!value) return undefined
  const first = value.split(',')[0]?.trim()
  return first || undefined
}

/** Twilio signs URL + alphabetically sorted POST params with HMAC-SHA1. */
export function twilioSignature(authToken: string, url: string, params: URLSearchParams): string {
  const keys = [...new Set(params.keys())].sort()
  let payload = url
  for (const key of keys) {
    for (const value of params.getAll(key)) payload += key + value
  }
  return createHmac('sha1', authToken).update(payload, 'utf8').digest('base64')
}

export function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function isValidTwilioRequest(
  authToken: string,
  signature: string | null,
  url: string,
  params: URLSearchParams,
): boolean {
  if (!authToken || !signature) return false
  return safeEqual(twilioSignature(authToken, url, params), signature)
}

export async function readTwilioForm(request: Request): Promise<{ params: URLSearchParams; url: string }> {
  const raw = await request.text()
  return { params: new URLSearchParams(raw), url: publicWebhookUrl(request) }
}

export function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function twimlResponse(inner: string, status = 200): Response {
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response>${inner}</Response>`
  return new Response(xml, {
    status,
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
  })
}

const MISSED_DIAL_STATUSES = new Set(['no-answer', 'busy', 'failed'])

/** Missed-call text-back runs only for these Dial results. Answered calls are `completed`. */
export function isMissedDial(status: string | null): boolean {
  return status !== null && MISSED_DIAL_STATUSES.has(status)
}

/**
 * Ring the owner's cell. callerId is the original caller when we have one,
 * otherwise the Twilio number. Twilio allows either on an inbound call to a
 * Twilio number. The action URL receives DialCallStatus when the attempt ends.
 */
export function dialOwnerTwiml(input: {
  forwardTo: string
  callerId: string
  timeoutSeconds: number
  actionUrl: string
}): string {
  return `<Dial action="${xmlEscape(input.actionUrl)}" method="POST" timeout="${input.timeoutSeconds}" callerId="${xmlEscape(input.callerId)}"><Number>${xmlEscape(input.forwardTo)}</Number></Dial>`
}

export function sayAndHangup(greeting: string): string {
  // Hangup ends the verb list, so the SMS is sent by the app after this
  // TwiML is returned rather than with an <Sms> verb after <Hangup/>.
  return `<Say>${xmlEscape(greeting)}</Say><Hangup/>`
}

export function hangupOnly(): string {
  return '<Hangup/>'
}

export function messageTwiml(body: string): string {
  return `<Message>${xmlEscape(body)}</Message>`
}

type FetchLike = (input: string, init: RequestInit) => Promise<Response>

/**
 * Send one SMS from a number this app is allowed to use.
 * Callers pass `from` as the client twilioNumber. This only hits the
 * Messages API — it never updates incoming-number webhook config.
 */
export async function sendTwilioSms(input: {
  accountSid: string
  authToken: string
  to: string
  from: string
  body: string
  fetchImpl?: FetchLike
}): Promise<void> {
  if (!input.accountSid || !input.authToken) {
    throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are required to send SMS')
  }
  const fetchImpl = input.fetchImpl ?? fetch
  const auth = Buffer.from(`${input.accountSid}:${input.authToken}`).toString('base64')
  const body = new URLSearchParams({ To: input.to, From: input.from, Body: input.body })
  const response = await fetchImpl(
    `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(input.accountSid)}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
      signal: AbortSignal.timeout(8000),
    },
  )
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Twilio SMS failed (${response.status}): ${detail.slice(0, 300)}`)
  }
}
