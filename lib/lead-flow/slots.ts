import type { ClientConfig, Weekday } from '@/lib/lead-flow/types'

/** Don't offer a time that starts sooner than this. The calendar is a config stub. */
export const MIN_LEAD_MINUTES = 120

const WEEKDAY_FROM_SHORT: Record<string, Weekday> = {
  sun: 'sun',
  mon: 'mon',
  tue: 'tue',
  wed: 'wed',
  thu: 'thu',
  fri: 'fri',
  sat: 'sat',
}

type Civil = { year: number; month: number; day: number }

function parts(date: Date, timeZone: string, options: Intl.DateTimeFormatOptions): Record<string, string> {
  const bag: Record<string, string> = {}
  for (const part of new Intl.DateTimeFormat('en-US', { timeZone, ...options }).formatToParts(date)) {
    if (part.type !== 'literal') bag[part.type] = part.value
  }
  return bag
}

function offsetMs(date: Date, timeZone: string): number {
  const bag = parts(date, timeZone, {
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const asUtc = Date.UTC(
    Number(bag.year),
    Number(bag.month) - 1,
    Number(bag.day),
    Number(bag.hour) % 24,
    Number(bag.minute),
    Number(bag.second),
  )
  return asUtc - date.getTime()
}

function zonedDateTime(year: number, month: number, day: number, hour: number, minute: number, timeZone: string): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute, 0)
  let instant = guess - offsetMs(new Date(guess), timeZone)
  instant = guess - offsetMs(new Date(instant), timeZone)
  return new Date(instant)
}

function civilFrom(date: Date, timeZone: string): Civil & { weekday: Weekday } {
  const bag = parts(date, timeZone, {
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const weekday = WEEKDAY_FROM_SHORT[bag.weekday.toLowerCase().slice(0, 3)]
  if (!weekday) throw new Error(`Unknown weekday ${bag.weekday}`)
  return { year: Number(bag.year), month: Number(bag.month), day: Number(bag.day), weekday }
}

function addDays(civil: Civil, days: number): Civil {
  const utc = new Date(Date.UTC(civil.year, civil.month - 1, civil.day + days))
  return { year: utc.getUTCFullYear(), month: utc.getUTCMonth() + 1, day: utc.getUTCDate() }
}

function parseHm(value: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(value)
  if (!match) throw new Error(`Invalid time ${value}`)
  return Number(match[1]) * 60 + Number(match[2])
}

export function formatSlot(date: Date, timeZone: string): string {
  const bag = parts(date, timeZone, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  const period = (bag.dayPeriod ?? '').replace(/\./g, '').toUpperCase()
  return `${bag.weekday}, ${bag.month} ${bag.day} at ${bag.hour}:${bag.minute} ${period}`.replace(/\s+/g, ' ').trim()
}

/** Next 2–3 bookable openings inside the client's configured hours. */
export function exampleSlots(config: ClientConfig, now: Date, count = 3): string[] {
  const openMinutes = parseHm(config.hours.open)
  const closeMinutes = parseHm(config.hours.close)
  const times = [openMinutes]
  const afternoon = openMinutes + 4 * 60
  if (afternoon + 60 <= closeMinutes) times.push(afternoon)

  const start = civilFrom(now, config.hours.timezone)
  const slots: string[] = []
  for (let offset = 0; offset < 21 && slots.length < count; offset += 1) {
    const day = addDays(start, offset)
    const noon = zonedDateTime(day.year, day.month, day.day, 12, 0, config.hours.timezone)
    const local = civilFrom(noon, config.hours.timezone)
    if (!config.hours.days.includes(local.weekday)) continue
    for (const minutes of times) {
      const instant = zonedDateTime(
        day.year,
        day.month,
        day.day,
        Math.floor(minutes / 60),
        minutes % 60,
        config.hours.timezone,
      )
      if (instant.getTime() - now.getTime() < MIN_LEAD_MINUTES * 60 * 1000) continue
      slots.push(formatSlot(instant, config.hours.timezone))
      if (slots.length >= count) break
    }
  }
  return slots
}

export function matchSlot(selected: string, slots: string[]): string | null {
  const trimmed = selected.trim()
  if (!trimmed) return null
  const exact = slots.find((slot) => slot === trimmed)
  if (exact) return exact
  const loose = slots.filter((slot) => trimmed.toLowerCase().includes(slot.toLowerCase()))
  return loose.length === 1 ? loose[0] : null
}
