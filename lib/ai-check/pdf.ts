import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { CheckReport } from '@/lib/ai-check/types'

const FOREST = rgb(11 / 255, 20 / 255, 16 / 255)
const RAISE = rgb(22 / 255, 40 / 255, 28 / 255)
const PAPER = rgb(243 / 255, 236 / 255, 223 / 255)
const BRASS = rgb(176 / 255, 141 / 255, 87 / 255)
const MUTED = rgb(217 / 255, 208 / 255, 192 / 255)

const PAGE_W = 612
const PAGE_H = 792
const MARGIN_X = 54
const CONTENT_W = PAGE_W - MARGIN_X * 2
const BOTTOM = 40
const INDENT = 18

type Ink = ReturnType<typeof rgb>

type State = {
  doc: PDFDocument
  page: PDFPage
  y: number
  font: PDFFont
  bold: PDFFont
}

export async function renderReportPdf(report: CheckReport): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const state: State = {
    doc,
    page: doc.addPage([PAGE_W, PAGE_H]),
    y: 0,
    font,
    bold,
  }
  paint(state.page)
  state.y = PAGE_H - 46

  draw(state, 'DANZUS', bold, 11, BRASS, 16)
  state.y -= 2
  draw(state, 'AI Search Check', bold, 22, PAPER, 28)
  draw(state, report.businessName, bold, 16, PAPER, 22)
  drawWrapped(state, report.url, font, 10, MUTED, 14)
  if (report.cityTrade) drawWrapped(state, report.cityTrade, font, 10, MUTED, 14)
  drawWrapped(state, `Checked ${formatWhen(report.checkedAt)}`, font, 10, MUTED, 14)

  state.y -= 14
  drawWrapped(state, report.opening, font, 12, PAPER, 18)

  state.y -= 16
  drawScore(state, report)
  state.y -= 12
  drawWrapped(state, report.note, font, 10, MUTED, 14)

  section(state, 'What would help most')
  if (report.fixes.length === 0) {
    drawWrapped(
      state,
      report.passed.length === 0
        ? 'We could not read enough of the site to suggest a change.'
        : 'Nothing stood out. The basics we could check are already in place.',
      font,
      11,
      PAPER,
      16,
    )
  } else {
    report.fixes.forEach((item, index) => {
      drawEntry(state, String(index + 1), item.label, item.benefit, quoteOf(item.detail))
    })
  }

  section(state, 'Already in place')
  if (report.passed.length === 0) {
    drawWrapped(state, 'Nothing we could check is in place yet.', font, 11, PAPER, 16)
  } else {
    for (const item of report.passed) drawEntry(state, '', item.label, item.benefit, quoteOf(item.detail))
  }

  const missed = report.signals.filter((signal) => signal.status === 'unmeasured')
  if (missed.length > 0) {
    section(state, 'We could not check')
    drawWrapped(state, `${missed.map((signal) => signal.label).join('. ')}.`, font, 11, MUTED, 16)
  }

  section(state, 'Next step')
  draw(state, 'Call (916) 404-6129', bold, 14, PAPER, 20)
  drawWrapped(state, 'Or book a time at https://danzus.co/#about.', font, 11, PAPER, 16)
  state.y -= 8
  draw(state, 'DANZUS Holdings LLC, Folsom.', font, 10, MUTED, 14)

  return doc.save()
}

function drawScore(state: State, report: CheckReport) {
  const meaningLines = wrap(report.meaning, state.font, 11, CONTENT_W - 44)
  const hasScore = report.score !== null
  const numberSize = hasScore ? 48 : 26
  const padTop = 20
  const padBottom = 18
  const afterNumber = hasScore ? 36 : 28
  const bandH = padTop + numberSize + afterNumber + Math.max(meaningLines.length, 1) * 15 + padBottom
  ensure(state, bandH)
  const top = state.y
  const bottom = top - bandH
  state.page.drawRectangle({ x: MARGIN_X, y: bottom, width: CONTENT_W, height: bandH, color: RAISE })
  state.page.drawRectangle({ x: MARGIN_X, y: bottom, width: 6, height: bandH, color: BRASS })

  const scoreText = hasScore ? String(report.score) : 'Not scored'
  const baseline = top - padTop - numberSize + 8
  textAt(state.page, scoreText, state.bold, numberSize, BRASS, MARGIN_X + 22, baseline)
  if (hasScore) {
    const labelX = MARGIN_X + 22 + state.bold.widthOfTextAtSize(scoreText, numberSize) + 16
    textAt(state.page, report.scoreLabel, state.bold, 22, PAPER, labelX, baseline + 2)
    textAt(state.page, 'out of 100', state.font, 10, MUTED, MARGIN_X + 24, baseline - 18)
  }
  let meaningY = baseline - afterNumber
  for (const line of meaningLines) {
    textAt(state.page, line, state.font, 11, PAPER, MARGIN_X + 22, meaningY)
    meaningY -= 15
  }
  state.y = bottom
}

function section(state: State, title: string) {
  ensure(state, 108)
  state.y -= 18
  state.page.drawRectangle({ x: MARGIN_X, y: state.y - 1, width: 32, height: 2.5, color: BRASS })
  state.y -= 18
  draw(state, title, state.bold, 13, BRASS, 18)
  state.y -= 2
}

function drawEntry(state: State, mark: string, title: string, benefit: string, quote: string) {
  const width = CONTENT_W - INDENT
  const titleLines = wrap(title, state.bold, 12, width)
  const benefitLines = wrap(benefit, state.font, 11, width)
  const quoteLines = quote ? wrap(quote, state.font, 10, width) : []
  const height = titleLines.length * 16 + benefitLines.length * 15 + quoteLines.length * 14 + 12
  ensure(state, height)
  if (mark) {
    textAt(state.page, mark, state.bold, 12, BRASS, MARGIN_X, state.y - 12)
  } else {
    state.page.drawRectangle({ x: MARGIN_X, y: state.y - 11, width: 6, height: 6, color: BRASS })
  }
  for (const line of titleLines) draw(state, line, state.bold, 12, PAPER, 16, MARGIN_X + INDENT)
  for (const line of benefitLines) draw(state, line, state.font, 11, MUTED, 15, MARGIN_X + INDENT)
  for (const line of quoteLines) draw(state, line, state.font, 10, PAPER, 14, MARGIN_X + INDENT)
  state.y -= 8
}

function drawWrapped(state: State, text: string, font: PDFFont, size: number, color: Ink, leading: number) {
  const lines = wrap(text, font, size, CONTENT_W)
  if (lines.length === 0) return
  ensure(state, lines.length * leading)
  for (const line of lines) draw(state, line, font, size, color, leading)
}

function draw(
  state: State,
  text: string,
  font: PDFFont,
  size: number,
  color: Ink,
  leading: number,
  x = MARGIN_X,
) {
  const line = plain(text)
  if (!line) return
  ensure(state, leading)
  textAt(state.page, line, font, size, color, x, state.y - size)
  state.y -= leading
}

function textAt(page: PDFPage, text: string, font: PDFFont, size: number, color: Ink, x: number, y: number) {
  const line = plain(text)
  if (!line) return
  page.drawText(line, { x, y, size, font, color })
}

function ensure(state: State, height: number) {
  if (state.y - height >= BOTTOM) return
  state.page = state.doc.addPage([PAGE_W, PAGE_H])
  paint(state.page)
  state.y = PAGE_H - 46
}

function paint(page: PDFPage) {
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: FOREST })
  page.drawRectangle({ x: 0, y: PAGE_H - 8, width: PAGE_W, height: 8, color: BRASS })
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 8, color: BRASS })
}

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const clean = plain(text).replace(/\s+/g, ' ').trim()
  if (!clean) return []
  const lines: string[] = []
  let line = ''
  for (const word of clean.split(' ')) {
    for (const piece of breakWord(word, font, size, width)) {
      const next = line ? `${line} ${piece}` : piece
      if (line && font.widthOfTextAtSize(next, size) > width) {
        lines.push(line)
        line = piece
      } else {
        line = next
      }
    }
  }
  if (line) lines.push(line)
  return lines
}

function breakWord(word: string, font: PDFFont, size: number, width: number): string[] {
  if (font.widthOfTextAtSize(word, size) <= width) return [word]
  const pieces: string[] = []
  let chunk = ''
  for (const char of word) {
    const next = chunk + char
    if (chunk && font.widthOfTextAtSize(next, size) > width) {
      pieces.push(chunk)
      chunk = char
    } else {
      chunk = next
    }
  }
  if (chunk) pieces.push(chunk)
  return pieces
}

function quoteOf(detail: string): string {
  const match = detail.match(/"([^"]+)"/)
  return match?.[1] ? `"${match[1]}"` : ''
}

function plain(value: string): string {
  return value
    .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ')
    .replace(/[\u2018\u2019\u201A]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, '-')
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
    .replace(/[^\t\n\r\x20-\x7E]/g, '')
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
