import { z } from 'zod'
import type { ClientConfig } from '@/lib/lead-flow/types'

const weekday = z.enum(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'])

const clientConfigSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  businessName: z.string().min(1),
  voice: z.string().min(1),
  services: z.array(z.string().min(1)).min(1),
  area: z.string().min(1),
  qualifyingQuestions: z.array(z.string().min(1)).min(1),
  hours: z.object({
    timezone: z.string().min(1),
    days: z.array(weekday).min(1),
    open: z.string().regex(/^\d{2}:\d{2}$/),
    close: z.string().regex(/^\d{2}:\d{2}$/),
  }),
  ownerPhone: z.string().regex(/^\+[1-9]\d{9,14}$/),
  twilioNumber: z.string().regex(/^\+[1-9]\d{9,14}$/),
  allowedPriceRanges: z
    .array(
      z.object({
        service: z.string().min(1),
        min: z.number().positive(),
        max: z.number().positive(),
      }),
    )
    .min(1),
  greeting: z.string().min(1),
  missedCallSms: z.string().min(1),
})

export function parseClientConfig(input: ClientConfig): ClientConfig {
  const config = clientConfigSchema.parse(input)
  const open = config.hours.open
  const close = config.hours.close
  if (close <= open) {
    throw new Error(`${config.id}: hours.close must be later than hours.open`)
  }
  for (const range of config.allowedPriceRanges) {
    if (range.max < range.min) {
      throw new Error(`${config.id}: ${range.service} max is below min`)
    }
  }
  return config
}
