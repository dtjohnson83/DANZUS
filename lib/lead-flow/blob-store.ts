import { get, list, put } from '@vercel/blob'
import type { Lead, LeadStore } from '@/lib/lead-flow/types'

/**
 * One private JSON blob per lead. Reads bypass the CDN cache because each
 * turn overwrites the same pathname and the next text has to see it.
 *
 * Auth is the connected Blob store: BLOB_STORE_ID with Vercel OIDC, or
 * BLOB_READ_WRITE_TOKEN when the store is not connected that way.
 */
const PREFIX = 'lead-flow'

function pathname(clientId: string, phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return `${PREFIX}/${clientId}/${digits}.json`
}

function isLead(value: unknown): value is Lead {
  if (!value || typeof value !== 'object') return false
  const lead = value as Partial<Lead>
  return typeof lead.phone === 'string' && typeof lead.clientId === 'string' && Array.isArray(lead.messages)
}

async function readLead(path: string): Promise<Lead | null> {
  const result = await get(path, { access: 'private', useCache: false })
  if (!result || result.statusCode !== 200) return null
  const text = await new Response(result.stream).text()
  const parsed: unknown = JSON.parse(text)
  if (!isLead(parsed)) throw new Error(`Lead blob ${path} is not a lead record`)
  return parsed
}

export const blobLeadStore: LeadStore = {
  async get(clientId, phone) {
    return readLead(pathname(clientId, phone))
  },
  async save(lead) {
    await put(pathname(lead.clientId, lead.phone), JSON.stringify(lead), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    })
  },
  async list() {
    const leads: Lead[] = []
    let cursor: string | undefined
    do {
      const page = await list({ prefix: `${PREFIX}/`, cursor, limit: 100 })
      for (const blob of page.blobs) {
        if (!blob.pathname.endsWith('.json')) continue
        try {
          const lead = await readLead(blob.pathname)
          if (lead) leads.push(lead)
        } catch (error) {
          console.error('Skipped unreadable lead blob', blob.pathname, error)
        }
      }
      cursor = page.hasMore ? page.cursor : undefined
    } while (cursor)
    return leads
  },
}

export function leadStoreErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : ''
  if (/BLOB_|token|OIDC|credential|unauthorized|No blob|store/i.test(message)) {
    return 'Lead store is not configured. Connect a private Vercel Blob store to this project, or set BLOB_READ_WRITE_TOKEN.'
  }
  console.error('Lead store read failed', error)
  return 'Could not load leads right now.'
}
