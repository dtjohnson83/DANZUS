import type { ClientConfig } from '@/lib/lead-flow/types'

/**
 * DANZUS client for the business line published on danzus.co.
 *
 * To add another business: copy this file, edit the fields, and register it
 * in lib/lead-flow/registry.ts. Each client owns one Twilio number. This file
 * is wired only to +19164046129. Do not put any other Twilio number here.
 *
 * Inbound calls ring `forwardTo` first. `hours` is a calendar stub for text
 * booking, not a connected calendar.
 */
export const demoClient = {
  id: 'danzus',
  businessName: 'DANZUS',
  voice:
    'Plain and local, like Dan texting a shop owner in Folsom. Short messages. Helpful, never pushy, never a call-center script.',
  services: [
    'missed-call text-back',
    'lead follow-up',
    'booking and reminders',
    'quote follow-up',
    'review requests',
  ],
  area: 'Folsom and the Sacramento area',
  qualifyingQuestions: [
    'What kind of shop is it?',
    'Which part do you want handled first: missed calls, follow-up, booking, or reviews?',
    'What area do you work in?',
    'When do you want it running?',
    'Any rough monthly budget in mind? I can share a range, and Dan confirms the price on a call.',
  ],
  hours: {
    timezone: 'America/Los_Angeles',
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    open: '08:00',
    close: '17:00',
  },
  ownerPhone: '+19167490473',
  forwardTo: '+19167490473',
  ringTimeoutSeconds: 20,
  twilioNumber: '+19164046129',
  allowedPriceRanges: [
    { service: 'One workflow, monthly', min: 200, max: 300 },
    { service: 'Lead to Booked Job package, monthly', min: 400, max: 600 },
    { service: 'Setup for a single workflow', min: 250, max: 500 },
    { service: 'Setup for the full package', min: 1000, max: 1500 },
  ],
  greeting: "Sorry we missed you, we'll text you right now",
  missedCallSms:
    "Hey, this is Dan at DANZUS. Sorry I missed your call. Text me what you need and I'll get right back to you. Reply STOP to opt out.",
} satisfies ClientConfig
