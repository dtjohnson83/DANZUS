const WINDOW_MS = 60 * 60 * 1000
const hits = new Map<string, number[]>()

export function allowCheck(key: string, limit: number, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  return true
}

export function resetCheckLimits() {
  hits.clear()
}
