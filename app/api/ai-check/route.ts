import { UnsafeUrlError, assertPublicHttpUrl } from '@/lib/ai-check/guard'
import { sendCheckEmails } from '@/lib/ai-check/email'
import { allowCheck } from '@/lib/ai-check/limit'
import { measureSite } from '@/lib/ai-check/measure'
import { renderReportPdf } from '@/lib/ai-check/pdf'
import { buildReport } from '@/lib/ai-check/score'
import { z } from 'zod'

export const runtime = 'nodejs'
export const maxDuration = 30

const Body = z.object({
  businessName: z.string().trim().min(2).max(120),
  url: z.string().trim().min(4).max(300),
  cityTrade: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  optIn: z.boolean(),
  companyWebsite: z.string().optional(),
})

export async function POST(request: Request) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'Check the form and try again.' }, { status: 400 })
  }
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return Response.json({ ok: false, error: 'Check the name, website, city, and email.' }, { status: 400 })
  }
  if (parsed.data.companyWebsite?.trim()) {
    return Response.json({ ok: false, error: 'Check the form and try again.' }, { status: 400 })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const email = parsed.data.email.toLowerCase()
  if (!allowCheck(`ip:${ip}`, 5) || !allowCheck(`email:${email}`, 3)) {
    return Response.json({ ok: false, error: 'Too many checks from this network. Try again later.' }, { status: 429 })
  }

  const url = /^https?:\/\//i.test(parsed.data.url) ? parsed.data.url : `https://${parsed.data.url}`
  try {
    await assertPublicHttpUrl(url)
  } catch (error) {
    const message = error instanceof UnsafeUrlError ? error.message : 'That address is not allowed.'
    return Response.json({ ok: false, error: message }, { status: 400 })
  }

  const snapshot = await measureSite({
    url,
    businessName: parsed.data.businessName,
    cityTrade: parsed.data.cityTrade,
  })
  const report = buildReport(snapshot)
  const pdf = await renderReportPdf(report)
  const emailResult = await sendCheckEmails({ report, to: email, optIn: parsed.data.optIn, pdf })

  return Response.json({
    ok: true,
    businessName: report.businessName,
    score: report.score,
    scoreLabel: report.scoreLabel,
    meaning: report.meaning,
    opening: report.opening,
    note: report.note,
    passed: report.passed.map((item) => ({ label: item.label, benefit: item.benefit, detail: item.detail })),
    fixes: report.fixes.map((item) => ({ label: item.label, benefit: item.benefit, fix: item.fix, detail: item.detail })),
    unmeasured: report.signals.filter((item) => item.status === 'unmeasured').map((item) => item.label),
    email: emailResult,
  })
}
