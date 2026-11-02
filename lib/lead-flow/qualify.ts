import { generateText, Output, type LanguageModel } from 'ai'
import { z } from 'zod'
import type { Lead, QualifyInput, QualifyResult } from '@/lib/lead-flow/types'

/** Current AI Gateway model. Override with LEAD_FLOW_MODEL. */
export const DEFAULT_LEAD_FLOW_MODEL = 'openai/gpt-5.4-mini'

const turnSchema = z.object({
  reply: z.string(),
  action: z.enum(['continue', 'offer_slots', 'book', 'escalate']),
  name: z.string(),
  jobType: z.string(),
  area: z.string(),
  timing: z.string(),
  budgetNote: z.string(),
  selectedSlot: z.string(),
  escalationReason: z.string(),
})

export function leadFlowModel(): LanguageModel {
  const configured = process.env.LEAD_FLOW_MODEL?.trim()
  if (configured) return configured as LanguageModel
  return DEFAULT_LEAD_FLOW_MODEL
}

function instructions(input: QualifyInput): string {
  const config = input.config
  const ranges = config.allowedPriceRanges
    .map((range) => `${range.service}: $${range.min}–$${range.max}`)
    .join('; ')
  const slots = input.slots.map((slot, index) => `${index + 1}. ${slot}`).join('\n')
  const lead = input.lead
  return [
    `You text for ${config.businessName}, a local business serving ${config.area}.`,
    `Voice: ${config.voice}`,
    `Services: ${config.services.join(', ')}.`,
    'Qualify the lead for job type, area, timing, and a rough budget. Sound like a person at the shop, and ask one thing at a time.',
    `Questions you can draw from: ${config.qualifyingQuestions.join(' | ')}`,
    `Known so far: name=${lead.name || 'unknown'}; job=${lead.jobType || 'unknown'}; area=${lead.area || 'unknown'}; timing=${lead.timing || 'unknown'}; budget note=${lead.budgetNote || 'unknown'}; status=${lead.status}; booked slot=${lead.bookedSlot || 'none'}.`,
    `Never quote a firm price and never say a job will cost one number. If they ask cost, share only a ballpark from these ranges and say the owner confirms after seeing the job: ${ranges}.`,
    'When you know the job type, the area, and the timing, set action to offer_slots and offer only these openings:',
    slots || '(no openings calculated)',
    'If they clearly accept one of those openings, set action to book, copy that opening into selectedSlot exactly, and confirm the booking in the reply.',
    'If they are upset, want a person, or are unsure about going ahead, set action to escalate. Say the owner will follow up. Do not pressure them.',
    'Otherwise set action to continue.',
    'The reply is one or two short texts. No hashtags and no email sign-off.',
    'Fill every string field. Use an empty string when you do not know. Do not invent a name, place, budget, or time they did not give you.',
  ].join('\n')
}

function transcript(lead: Lead, inbound: string): { role: 'user' | 'assistant'; content: string }[] {
  const history = lead.messages.slice(-16).map((message) => ({
    role: message.direction === 'in' ? ('user' as const) : ('assistant' as const),
    content: message.body,
  }))
  const messages = [...history, { role: 'user' as const, content: inbound }]
  if (messages[0]?.role === 'assistant') {
    messages.unshift({ role: 'user', content: 'I called and nobody picked up.' })
  }
  return messages
}

export async function qualifyWithModel(input: QualifyInput): Promise<QualifyResult> {
  const { output } = await generateText({
    model: leadFlowModel(),
    output: Output.object({
      schema: turnSchema,
      name: 'lead_turn',
      description: 'Next SMS and lead updates for a local-business booking conversation',
    }),
    instructions: instructions(input),
    messages: transcript(input.lead, input.inbound),
  })
  return output
}
