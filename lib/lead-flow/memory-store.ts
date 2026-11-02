import type { Lead, LeadStore } from '@/lib/lead-flow/types'

export function createMemoryStore(): LeadStore {
  const rows = new Map<string, Lead>()
  const key = (clientId: string, phone: string) => `${clientId}:${phone}`
  return {
    async get(clientId, phone) {
      const row = rows.get(key(clientId, phone))
      return row ? structuredClone(row) : null
    },
    async save(lead) {
      rows.set(key(lead.clientId, lead.phone), structuredClone(lead))
    },
    async list() {
      return [...rows.values()].map((row) => structuredClone(row))
    },
  }
}
