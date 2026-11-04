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
    voicemails: [],
    createdAt: now,
    updatedAt: now,
  }
}

/** Older lead blobs predate voicemail. Fill the array so callers can push onto it. */
export function normalizeLead(lead: Lead): Lead {
  if (!Array.isArray(lead.voicemails)) lead.voicemails = []
  return lead
}

export function fillBlank(current: string, update: string): string {
  const next = update.trim()
  return next ? next : current
}
