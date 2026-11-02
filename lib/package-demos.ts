export const DEMO_BLOB_HOST = 'ic048emi0kpty2jd.public.blob.vercel-storage.com'
export const DEMO_BASE = `https://${DEMO_BLOB_HOST}/demos`

export const DEMO_MOBILE_MEDIA = '(max-width: 719px)'

export const PACKAGE_DEMOS = {
  'Lead to Booked Job': '01-lead-to-booked-job',
  'Quote to Cash': '02-quote-to-cash',
  'Job Closeout': '03-job-closeout',
  'Back Office': '04-back-office',
  'Customer Service': '05-customer-service',
} as const

export type PackageName = keyof typeof PACKAGE_DEMOS
export type DemoSlug = (typeof PACKAGE_DEMOS)[PackageName]

export function demoAssets(slug: DemoSlug) {
  return {
    landscape: `${DEMO_BASE}/${slug}.mp4`,
    portrait: `${DEMO_BASE}/${slug}-9x16.mp4`,
    poster: `${DEMO_BASE}/${slug}-poster.jpg`,
  }
}

export function demoVideoSrc(slug: DemoSlug, narrow: boolean) {
  const assets = demoAssets(slug)
  return narrow ? assets.portrait : assets.landscape
}
