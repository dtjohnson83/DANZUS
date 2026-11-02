import type { ClientConfig, Lead } from '@/lib/lead-flow/types'

export function emptyLead(config: ClientConfig, phone: string, now: string): Lead {
  return {
    id: `${config.id}:${phone}`,
    clientId: config.id,
    phone,
    status: 'new',
    name: '',
    jobType: '',
    area: '',
    timing: '',
    budgetNote: '',
    bookedSlot: '',
    escalationReason: '',
    ownerNotified: false,
    optedOut: false,
    messages: [],
    createdAt: now,
    updatedAt: now,
  }
}

export function fillBlank(current: string, update: string): string {
  const next = update.trim()
  return next ? next : current
}
