import type { ClientConfig } from '@/lib/lead-flow/types'

/**
 * DANZUS client for the business line published on danzus.co.
 *
 * To add another business: copy this file, edit the fields, and register it
 * in lib/lead-flow/registry.ts. Each client owns one Twilio number. This file
 * is wired only to +19164046129. Do not put any other Twilio number here.
 *
 * Inbound calls ring `forwardTo` first. If nobody answers, the caller hears
 * `greeting`, can leave a voicemail, and gets `missedCallSms` immediately.
 * `hours` is a calendar stub for text booking, not a connected calendar.
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
    'Any monthly budget in mind? I can share the menu, and Dan confirms it on a call.',
  ],
  hours: {
    timezone: 'America/Los_Angeles',
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    open: '08:00',
    close: '17:00',
  },
  ownerPhone: '+19167490473',
  ownerEmail: 'dan@danzus.co',
  forwardTo: '+19167490473',
  ringTimeoutSeconds: 20,
  twilioNumber: '+19164046129',
  priceMenu: [
    {
      service: 'Missed-call text-back',
      amounts: [99],
      detail: '$99 a month after a free 30-day pilot. No setup fee. No contract, month to month.',
    },
    {
      service: 'Website',
      amounts: [1500, 49],
      detail: '$1,500 one-time, plus $49 a month for hosting and edits.',
    },
    {
      service: 'Google + AI search',
      amounts: [199],
      detail: '$199 a month.',
    },
    {
      service: 'DANZUS Growth bundle',
      amounts: [299, 750],
      detail:
        '$299 a month. Includes missed-call text-back, Google and AI search, and hosting. With a 6-month commitment the website is $750.',
    },
  ],
  greeting: "Sorry we missed you. Leave a message after the tone and we'll also text you right now.",
  voicemail: {
    enabled: true,
    maxLengthSeconds: 120,
    playBeep: true,
    transcribe: true,
    textOwner: false,
  },
  missedCallSms:
    "Hey, this is Dan at DANZUS. Sorry I missed your call. Text me what you need and I'll get right back to you. Reply STOP to opt out.",
} satisfies ClientConfig
