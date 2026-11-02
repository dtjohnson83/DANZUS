import type { ClientConfig } from '@/lib/lead-flow/types'

/**
 * Template client for the lead-to-booked-job demo.
 *
 * To add a business: copy this file, edit the fields, and register it in
 * lib/lead-flow/registry.ts. Each client owns one Twilio number. This demo
 * is wired only to +19164046129. Do not put any other Twilio number here.
 *
 * `hours` is a calendar stub. Offered times are the next openings inside
 * these hours, not a connected calendar.
 */
export const demoClient = {
  id: 'river-city-repair',
  businessName: 'River City Repair',
  voice:
    'Friendly neighborhood shop. Short texts, plain words, like the owner texting from the truck. Warm, never corporate, never pushy.',
  services: [
    'drain cleaning',
    'leak repair',
    'water heater replacement',
    'general handyman',
  ],
  area: 'Folsom, El Dorado Hills, and the east Sacramento suburbs',
  qualifyingQuestions: [
    'What needs doing?',
    'What city or neighborhood is the job in?',
    'When do you need someone out?',
    'Any rough budget in mind? We can share a range, and the owner confirms the price after seeing the job.',
  ],
  hours: {
    timezone: 'America/Los_Angeles',
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    open: '08:00',
    close: '17:00',
  },
  ownerPhone: '+19167490473',
  twilioNumber: '+19164046129',
  allowedPriceRanges: [
    { service: 'Drain cleaning', min: 175, max: 400 },
    { service: 'Leak repair', min: 200, max: 650 },
    { service: 'Water heater', min: 900, max: 2200 },
    { service: 'Handyman', min: 150, max: 500 },
  ],
  greeting: "Sorry we missed you, we'll text you right now",
  missedCallSms:
    "Hey, this is River City Repair. Sorry we missed your call — text me what you need and we'll get you on the schedule.",
} satisfies ClientConfig
