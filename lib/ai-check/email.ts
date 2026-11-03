import { createHash } from 'node:crypto'
import { Resend } from 'resend'
import type { CheckReport } from '@/lib/ai-check/types'

const FROM = 'DANZUS <dan@danzus.co>'
const REPLY_TO = 'danzus@mail.grokbot.com'
const LEAD_TO = 'dan@danzus.co'

export async function sendCheckEmails(input: {
  report: CheckReport
  to: string
  optIn: boolean
  pdf: Uint8Array
}): Promise<{ sent: boolean; detail: string }> {
  const key = process.env.RESEND_API_KEY
  if (!key) return { sent: false, detail: 'Email is not configured on this server.' }

  const resend = new Resend(key)
  const id = createHash('sha256')
    .update(`${input.to}|${input.report.url}|${input.report.score}|${input.report.checkedAt.slice(0, 13)}`)
    .digest('hex')
    .slice(0, 32)
  const pdf = Buffer.from(input.pdf)
  const score = input.report.score === null ? 'not scored' : `${input.report.score} / 100`
  const fixes = input.report.fixes.map((item, index) => `${index + 1}. ${item.label}: ${item.fix}`).join('\n')
  const reportText = [
    `AI search check for ${input.report.businessName}`,
    input.report.url,
    input.report.cityTrade,
    `Score: ${score}`,
    '',
    input.report.note,
    '',
    'What passed:',
    input.report.passed.map((item) => `- ${item.label}`).join('\n') || '- None',
    '',
    'Top fixes:',
    fixes || 'None',
    '',
    'Call or text (916) 404-6129, or book at https://danzus.co/#about.',
  ].join('\n')

  const reportSend = await resend.emails.send(
    {
      from: FROM,
      to: input.to,
      replyTo: REPLY_TO,
      subject: `AI search check for ${oneLine(input.report.businessName)}`,
      text: reportText,
      html: `<pre style="font-family:Georgia,serif;white-space:pre-wrap">${escapeHtml(reportText)}</pre>`,
      attachments: [{ filename: 'danzus-ai-search-check.pdf', content: pdf, contentType: 'application/pdf' }],
    },
    { idempotencyKey: `ai-check-report/${id}` },
  )
  if (reportSend.error) return { sent: false, detail: reportSend.error.message }

  const leadText = [
    'New AI search check',
    `Business: ${input.report.businessName}`,
    `URL: ${input.report.url}`,
    `City and trade: ${input.report.cityTrade || 'not provided'}`,
    `Email: ${input.to}`,
    `Follow-up opt-in: ${input.optIn ? 'yes' : 'no'}`,
    `Score: ${score}`,
    '',
    fixes || 'No failed signals.',
  ].join('\n')
  const leadSend = await resend.emails.send(
    {
      from: FROM,
      to: LEAD_TO,
      replyTo: REPLY_TO,
      subject: `AI search lead: ${oneLine(input.report.businessName)}`,
      text: leadText,
      html: `<pre style="font-family:Georgia,serif;white-space:pre-wrap">${escapeHtml(leadText)}</pre>`,
      attachments: [{ filename: 'danzus-ai-search-check.pdf', content: pdf, contentType: 'application/pdf' }],
    },
    { idempotencyKey: `ai-check-lead/${id}` },
  )
  if (leadSend.error) return { sent: true, detail: 'The report was emailed. The lead notice did not send.' }
  return { sent: true, detail: 'The report is on its way.' }
}

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').slice(0, 120)
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
