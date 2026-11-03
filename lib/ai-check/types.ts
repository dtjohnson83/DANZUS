export type SignalStatus = 'pass' | 'fail' | 'unmeasured'

export type Signal = {
  id: string
  label: string
  points: number
  status: SignalStatus
  detail: string
  fix: string
}

export type Snapshot = {
  requestedUrl: string
  finalUrl: string | null
  html: string | null
  status: number | null
  responseMs: number | null
  htmlBytes: number | null
  robotsStatus: number | null
  robotsBody: string | null
  llmsStatus: number | null
  llmsBytes: number | null
  /** False when the response is an HTML page instead of a text file. */
  llmsText: boolean | null
  sitemapStatus: number | null
  sitemapXml: boolean | null
  businessName: string
  cityTrade: string
  checkedAt: string
}

export type CheckReport = {
  businessName: string
  url: string
  cityTrade: string
  checkedAt: string
  score: number | null
  signals: Signal[]
  passed: Signal[]
  fixes: Signal[]
  note: string
}
