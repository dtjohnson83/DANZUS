/** Normalize to E.164. Returns null for anonymous, restricted, or unusable caller ids. */
export function normalizePhone(input: string | null | undefined): string | null {
  if (!input) return null
  const trimmed = input.trim()
  if (!trimmed || /anonymous|restricted|private|unknown/i.test(trimmed)) return null
  const digits = trimmed.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  if (trimmed.startsWith('+') && digits.length >= 8 && digits.length <= 15) return `+${digits}`
  return null
}

export function phonesEqual(a: string | null | undefined, b: string | null | undefined): boolean {
  const left = normalizePhone(a)
  const right = normalizePhone(b)
  return left !== null && left === right
}

export function formatPhone(e164: string): string {
  const normalized = normalizePhone(e164)
  if (!normalized) return e164
  const digits = normalized.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return normalized
}
