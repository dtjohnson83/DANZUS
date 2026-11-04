import type { PriceMenuItem } from '@/lib/lead-flow/types'

const MONEY = /\$\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g

const UPSET_OR_HANDOFF =
  /\b(ridiculous|furious|pissed(?:\s+off)?|so angry|really upset|this is a scam|lawyer|sue you|terrible service|unacceptable|speak to (?:a |the )?(?:owner|person|human|manager)|real person|talk to (?:the )?owner|get (?:me )?(?:a |the )?(?:human|owner|manager))\b/i

const UNSURE_TO_CONTINUE =
  /\b(i'?m not sure (?:i want|about (?:this|booking|moving forward)|if i should)|i'?m unsure|let me think about it|maybe later|not ready to (?:book|decide|move forward)|on the fence)\b/i

export function moneyAmounts(text: string): number[] {
  return [...text.matchAll(MONEY)].map((match) => Number(match[0].replace(/[$,\s]/g, '')))
}

export function priceMenuGuide(menu: PriceMenuItem[]): string {
  return menu.map((item) => `${item.service}: ${item.detail}`).join(' ')
}

/**
 * Keep a reply whose dollar amounts are all on the approved menu.
 * Any other dollar amount is replaced with that menu.
 */
export function sanitizePrices(reply: string, menu: PriceMenuItem[]): string {
  const amounts = moneyAmounts(reply)
  if (amounts.length === 0) return reply
  const allowed = new Set(menu.flatMap((item) => item.amounts))
  if (amounts.every((amount) => allowed.has(amount))) return reply
  return `Here's the menu, and Dan confirms it on a call. ${priceMenuGuide(menu)}`
}

/** Safety net for leads who are upset or unsure about going ahead. */
export function needsHuman(text: string): boolean {
  return UPSET_OR_HANDOFF.test(text) || UNSURE_TO_CONTINUE.test(text)
}
