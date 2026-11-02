import type { PriceRange } from '@/lib/lead-flow/types'

const MONEY = /\$\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g

const UPSET_OR_HANDOFF =
  /\b(ridiculous|furious|pissed(?:\s+off)?|so angry|really upset|this is a scam|lawyer|sue you|terrible service|unacceptable|speak to (?:a |the )?(?:owner|person|human|manager)|real person|talk to (?:the )?owner|get (?:me )?(?:a |the )?(?:human|owner|manager))\b/i

const UNSURE_TO_CONTINUE =
  /\b(i'?m not sure (?:i want|about (?:this|booking|moving forward)|if i should)|i'?m unsure|let me think about it|maybe later|not ready to (?:book|decide|move forward)|on the fence)\b/i

export function moneyAmounts(text: string): number[] {
  return [...text.matchAll(MONEY)].map((match) => Number(match[0].replace(/[$,\s]/g, '')))
}

/**
 * Keep a reply that cites one configured min/max pair.
 * A single price, or any other dollar amount, is rewritten as a ballpark.
 */
export function sanitizePrices(reply: string, ranges: PriceRange[]): string {
  const amounts = moneyAmounts(reply)
  if (amounts.length === 0) return reply
  const allowed = ranges.some((range) => {
    const pair = [range.min, range.max]
    return pair.every((amount) => amounts.includes(amount)) && amounts.every((amount) => pair.includes(amount))
  })
  if (allowed) return reply
  const guide = ranges.map((range) => `${range.service} $${range.min}–$${range.max}`).join('; ')
  return `I can't give a firm price by text. Typical ranges: ${guide}. The owner confirms the price after seeing the job.`
}

/** Safety net for leads who are upset or unsure about going ahead. */
export function needsHuman(text: string): boolean {
  return UPSET_OR_HANDOFF.test(text) || UNSURE_TO_CONTINUE.test(text)
}
