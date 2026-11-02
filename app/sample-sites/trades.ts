import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, SITE_URL } from '@/app/site'

export type TradeId = 'plumber' | 'hvac' | 'auto' | 'salon'

export type TradeDemo = {
  id: TradeId
  path: string
  name: string
  trade: string
  accent: string
  ink: string
  headline: string
  sub: string
  services: string[]
  areas: { city: string; body: string }[]
  reviews: { quote: string; name: string }[]
  messages: { side: 'in' | 'out'; text: string }[]
  kind: 'visit' | 'schedule'
}

export const TRADES: TradeDemo[] = [
  {
    id: 'plumber',
    path: '/demo/plumber',
    name: 'Ridgeline Plumbing Co.',
    trade: 'Plumbing',
    accent: '#1d4e89',
    ink: '#10283f',
    headline: 'A leak should not wait until Monday.',
    sub: 'Ridgeline answers the missed call, books the visit, and tells you when the truck is on the way.',
    services: ['Leak repair', 'Water heaters', 'Drain clearing', 'Fixture install'],
    areas: [
      { city: 'Folsom', body: 'Homes and small shops in Folsom. Same-day visits when the schedule allows.' },
      { city: 'Roseville', body: 'Roseville calls get a text back, then a time on the calendar.' },
      { city: 'El Dorado Hills', body: 'El Dorado Hills is on the regular route. No street address on this sample.' },
    ],
    reviews: [
      { quote: 'They texted me back while I was still looking at the leak.', name: 'Sample customer' },
      { quote: 'The visit was on the day they promised.', name: 'Sample customer' },
      { quote: 'Clear price talk. No surprise at the door.', name: 'Sample customer' },
    ],
    messages: [
      { side: 'out', text: 'Sorry we missed you. This is Ridgeline Plumbing. What is going on?' },
      { side: 'in', text: 'Kitchen sink is leaking under the cabinet.' },
      { side: 'out', text: 'Thursday at 10 is open. I will text before we roll.' },
    ],
    kind: 'visit',
  },
  {
    id: 'hvac',
    path: '/demo/hvac',
    name: 'Comfort Peak Heating & Air',
    trade: 'Heating and air',
    accent: '#c45c26',
    ink: '#3d2414',
    headline: 'The house is hot. Someone should answer.',
    sub: 'Comfort Peak texts back the missed call and puts a tune-up or a no-cool visit on the book.',
    services: ['No-cool visits', 'Furnace checks', 'Tune-ups', 'Thermostat swaps'],
    areas: [
      { city: 'Folsom', body: 'Folsom homes. We text a time before the tech leaves the shop.' },
      { city: 'Roseville', body: 'Roseville tune-ups and no-cool calls, booked from the text thread.' },
      { city: 'El Dorado Hills', body: 'El Dorado Hills is in the service area. This sample has no street address.' },
    ],
    reviews: [
      { quote: 'AC died on a Saturday. They had a time for me the same day.', name: 'Sample customer' },
      { quote: 'The reminder text meant I was actually home.', name: 'Sample customer' },
    ],
    messages: [
      { side: 'out', text: 'Sorry we missed you. Comfort Peak Heating & Air. Is the system not cooling?' },
      { side: 'in', text: 'Upstairs is hot. Can someone come tomorrow?' },
      { side: 'out', text: 'Tomorrow at 2 is open. I will text when we are close.' },
    ],
    kind: 'visit',
  },
  {
    id: 'auto',
    path: '/demo/auto',
    name: 'Oak Avenue Auto Works',
    trade: 'Auto repair',
    accent: '#8a5a12',
    ink: '#2c2416',
    headline: 'The car is in the bay. The phone can still get answered.',
    sub: 'Oak Avenue texts the missed call, books the drop-off, and asks for the review when the keys are back.',
    services: ['Brakes', 'Oil service', 'Check engine', 'Drop-off scheduling'],
    areas: [
      { city: 'Folsom', body: 'Folsom drivers. Drop the car off on the day we text you.' },
      { city: 'Roseville', body: 'Roseville appointments start from the missed-call text.' },
      { city: 'El Dorado Hills', body: 'El Dorado Hills is on the map. No shop address on this sample.' },
    ],
    reviews: [
      { quote: 'I missed their call and had a text before I got back to the office.', name: 'Sample customer' },
      { quote: 'Brake job was booked without me sitting on hold.', name: 'Sample customer' },
    ],
    messages: [
      { side: 'out', text: 'Sorry we missed you. Oak Avenue Auto Works. What do you need looked at?' },
      { side: 'in', text: 'Brakes are grinding. Can I drop it off Friday?' },
      { side: 'out', text: 'Friday at 8 works. I will text the reminder Thursday.' },
    ],
    kind: 'visit',
  },
  {
    id: 'salon',
    path: '/demo/salon',
    name: 'Willow & Brass Studio',
    trade: 'Hair studio',
    accent: '#8c4a55',
    ink: '#3a2428',
    headline: 'The chair is full. The book can still fill.',
    sub: 'Willow & Brass answers the missed call and lets a guest pick a time without waiting on hold.',
    services: ['Cut and style', 'Color', 'Blowout', 'Bangs trim'],
    areas: [
      { city: 'Folsom', body: 'Guests from Folsom. Pick a chair time on this page.' },
      { city: 'Roseville', body: 'Roseville guests get a text, then a time that is still open.' },
      { city: 'El Dorado Hills', body: 'El Dorado Hills is welcome. This sample lists no street address.' },
    ],
    reviews: [
      { quote: 'I called from the car and booked the trim by text.', name: 'Sample guest' },
      { quote: 'The reminder the day before saved the appointment.', name: 'Sample guest' },
      { quote: 'Color visit started on time.', name: 'Sample guest' },
    ],
    messages: [
      { side: 'out', text: 'Sorry we missed you. Willow & Brass Studio. Cut, color, or a blowout?' },
      { side: 'in', text: 'A trim on Saturday if you have a chair.' },
      { side: 'out', text: 'Saturday at 11 is open. I will text Friday to confirm.' },
    ],
    kind: 'schedule',
  },
]

export const DEMO_PHONE_DISPLAY = CONTACT_PHONE_DISPLAY
export const DEMO_PHONE_TEL = CONTACT_PHONE_TEL
export const DEMO_HOME = SITE_URL
