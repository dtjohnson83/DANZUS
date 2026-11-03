import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnsafeUrlError'
  }
}

type LookupFn = (hostname: string) => Promise<string[]>

const BLOCKED_HOSTS = new Set(['localhost', 'localhost.localdomain', 'metadata.google.internal'])

/** True for loopback, private, link-local, and carrier-grade NAT addresses. */
export function isBlockedAddress(address: string): boolean {
  const raw = address.toLowerCase().replace(/^\[|\]$/g, '').split('%')[0] ?? ''
  if (raw === '::1' || raw === '::' || raw === '0.0.0.0') return true
  if (raw.startsWith('fc') || raw.startsWith('fd') || raw.startsWith('fe80')) return true
  const v4 = raw.startsWith('::ffff:') ? raw.slice(7) : raw
  if (isIP(v4) !== 4) return isIP(raw) === 6 ? false : true
  const parts = v4.split('.').map((part) => Number(part))
  const a = parts[0] ?? 0
  const b = parts[1] ?? 0
  if (a === 0 || a === 10 || a === 127) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 100 && b >= 64 && b <= 127) return true
  return false
}

export async function assertPublicHttpUrl(raw: string, resolve: LookupFn = resolvePublic): Promise<URL> {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new UnsafeUrlError('Enter a full website address, like https://example.com.')
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new UnsafeUrlError('The address has to start with http:// or https://.')
  }
  if (url.username || url.password) throw new UnsafeUrlError('That address is not allowed.')
  if (url.port && url.port !== '80' && url.port !== '443') {
    throw new UnsafeUrlError('That address is not allowed.')
  }
  const host = url.hostname.replace(/^\[|\]$/g, '').toLowerCase()
  if (!host || BLOCKED_HOSTS.has(host) || host.endsWith('.local') || host.endsWith('.internal')) {
    throw new UnsafeUrlError('That address is not allowed.')
  }
  const addresses = isIP(host) ? [host] : await resolve(host)
  if (addresses.length === 0 || addresses.some((address) => isBlockedAddress(address))) {
    throw new UnsafeUrlError('That address is not allowed.')
  }
  return url
}

async function resolvePublic(hostname: string): Promise<string[]> {
  const records = await lookup(hostname, { all: true, verbatim: true })
  return records.map((record) => record.address)
}
