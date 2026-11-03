import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { CheckReport } from '@/lib/ai-check/types'

const GREEN = rgb(11 / 255, 20 / 255, 16 / 255)
const PAPER = rgb(243 / 255, 236 / 255, 223 / 255)
const BRASS = rgb(176 / 255, 141 / 255, 87 / 255)
const MUTED = rgb(217 / 255, 208 / 255, 192 / 255)

export async function renderReportPdf(report: CheckReport): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const state = { page: doc.addPage([612, 792]), y: 740 }
  paint(state.page)

  draw(state, doc, 'DANZUS', bold, 12, BRASS)
  state.y -= 6
  draw(state, doc, 'AI Search Check', bold, 26, PAPER)
  draw(state, doc, report.businessName, bold, 16, PAPER)
  draw(state, doc, report.url, font, 10, MUTED)
  if (report.cityTrade) draw(state, doc, report.cityTrade, font, 10, MUTED)
  draw(state, doc, `Checked ${formatWhen(report.checkedAt)}`, font, 10, MUTED)
  state.y -= 8
  draw(state, doc, report.score === null ? 'Not scored' : `${report.score} / 100`, bold, 32, BRASS)
  for (const line of wrap(report.note, font, 11, 468)) draw(state, doc, line, font, 11, MUTED)

  heading(state, doc, bold, 'What passed')
  if (report.passed.length === 0) draw(state, doc, 'Nothing we measured passed.', font, 11, PAPER)
  for (const item of report.passed) {
    draw(state, doc, item.label, bold, 12, PAPER)
    for (const line of wrap(item.detail, font, 10, 468)) draw(state, doc, line, font, 10, MUTED)
  }

  heading(state, doc, bold, 'Top fixes')
  if (report.fixes.length === 0) draw(state, doc, 'No failed signals in what we measured.', font, 11, PAPER)
  report.fixes.forEach((item, index) => {
    draw(state, doc, `${index + 1}. ${item.label}`, bold, 12, PAPER)
    for (const line of wrap(item.fix, font, 11, 468)) draw(state, doc, line, font, 11, PAPER)
    for (const line of wrap(item.detail, font, 10, 468)) draw(state, doc, line, font, 10, MUTED)
  })

  const missed = report.signals.filter((signal) => signal.status === 'unmeasured')
  if (missed.length > 0) {
    heading(state, doc, bold, 'Not measured')
    for (const line of wrap(missed.map((signal) => signal.label).join(', '), font, 11, 468)) {
      draw(state, doc, line, font, 11, MUTED)
    }
  }

  heading(state, doc, bold, 'Next step')
  for (const line of wrap(
    'Call or text Dan at (916) 404-6129, or book a time at https://danzus.co/#about. DANZUS Holdings LLC, Folsom.',
    font,
    12,
    468,
  )) {
    draw(state, doc, line, font, 12, PAPER)
  }

  return doc.save()
}

function paint(page: PDFPage) {
  page.drawRectangle({ x: 0, y: 0, width: 612, height: 792, color: GREEN })
  page.drawRectangle({ x: 0, y: 776, width: 612, height: 16, color: BRASS })
}

function heading(
  state: { page: PDFPage; y: number },
  doc: PDFDocument,
  font: PDFFont,
  text: string,
) {
  state.y -= 16
  draw(state, doc, text, font, 14, BRASS)
}

function draw(
  state: { page: PDFPage; y: number },
  doc: PDFDocument,
  text: string,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb>,
) {
  text = plain(text)
  if (state.y < 72) {
    state.page = doc.addPage([612, 792])
    paint(state.page)
    state.y = 740
  }
  state.page.drawText(text, { x: 48, y: state.y, size, font, color })
  state.y -= size + 6
}

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  text = plain(text)
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word
    if (line && font.widthOfTextAtSize(next, size) > width) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function plain(value: string): string {
  return value.replace(/[^\t\n\r\x20-\x7E]/g, '')
}

function formatWhen(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Los_Angeles',
  }).format(date)
}
