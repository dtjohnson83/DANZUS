import { describe, expect, it } from 'vitest'
import nextConfig from '../next.config.js'
import {
  DEMO_BASE,
  DEMO_BLOB_HOST,
  DEMO_MOBILE_MEDIA,
  PACKAGE_DEMOS,
  demoAssets,
  demoVideoSrc,
} from '@/lib/package-demos'

describe('package demo videos', () => {
  it('maps each workflow package to its Blob files', () => {
    expect(PACKAGE_DEMOS).toEqual({
      'Lead to Booked Job': '01-lead-to-booked-job',
      'Estimate to payment': '02-quote-to-cash',
      'Job Closeout': '03-job-closeout',
      'Back Office': '04-back-office',
      'Customer Service': '05-customer-service',
    })
  })

  it('builds landscape, vertical, and poster URLs from the public Blob host', () => {
    expect(demoAssets('01-lead-to-booked-job')).toEqual({
      landscape: `${DEMO_BASE}/01-lead-to-booked-job.mp4`,
      portrait: `${DEMO_BASE}/01-lead-to-booked-job-9x16.mp4`,
      poster: `${DEMO_BASE}/01-lead-to-booked-job-poster.jpg`,
    })
    expect(demoVideoSrc('03-job-closeout', false)).toBe(`${DEMO_BASE}/03-job-closeout.mp4`)
    expect(demoVideoSrc('03-job-closeout', true)).toBe(`${DEMO_BASE}/03-job-closeout-9x16.mp4`)
    expect(DEMO_MOBILE_MEDIA).toBe('(max-width: 719px)')
  })

  it('allows the Blob host in next/image', () => {
    expect(nextConfig.images.remotePatterns).toEqual([
      {
        protocol: 'https',
        hostname: DEMO_BLOB_HOST,
        pathname: '/demos/**',
      },
    ])
  })
})
