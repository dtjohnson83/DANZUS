import { createHmac } from 'node:crypto'
import { safeEqual } from '@/lib/lead-flow/twilio'

export const DEMO_COOKIE = 'lead_demo_session'

export function sessionToken(password: string): string {
  return createHmac('sha256', password).update('lead-demo-session-v1').digest('hex')
}

export function passwordsMatch(given: string, expected: string): boolean {
  if (!expected || !given) return false
  return safeEqual(given, expected)
}

export function sessionMatches(cookieValue: string | undefined, password: string): boolean {
  if (!cookieValue || !password) return false
  return safeEqual(cookieValue, sessionToken(password))
}
