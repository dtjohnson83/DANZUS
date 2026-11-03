import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, SITE_URL } from '@/app/site'

export type TradeId = 'plumber' | 'hvac' | 'auto' | 'salon'

/** Swap this base to change every sample image. File names stay hero, work, detail, happy. */
export const SAMPLE_PHOTO_BASE =
  'https://hwidthwh7olawzlg.public.blob.vercel-storage.com/samples-branded'

type PhotoName = 'hero' | 'work' | 'detail' | 'happy'

function photos(id: TradeId) {
  const shot = (name: PhotoName) => `${SAMPLE_PHOTO_BASE}/${id}/${name}.webp`
  return { hero: shot('hero'), work: shot('work'), detail: shot('detail'), happy: shot('happy') }
}

export type TradeDemo = {
  id: TradeId
  path: string
  name: string
  trade: string
  accent: string
  ink: string
  paper: string
  muted: string
  line: string
  onAccent: string
  kicker: string
  headline: string
  sub: string
  services: { title: string; body: string }[]
  steps: { title: string; body: string }[]
  areas: { city: string; body: string }[]
  reviews: { quote: string; name: string }[]
  messages: { side: 'in' | 'out'; text: string }[]
  faqs: { q: string; a: string }[]
  trust: { value: string; label: string }[]
  photos: { hero: string; work: string; detail: string; happy: string }
  alts: { hero: string; work: string; detail: string; happy: string }
  splitTitle: string
  splitBody: string
  ctaTitle: string
  ctaBody: string
}

export const TRADES: TradeDemo[] = [
  {
    id: 'plumber',
    path: '/demo/plumber',
    name: 'Ridgeline Plumbing Co.',
    trade: 'Plumbing',
    accent: '#1d4e89',
    ink: '#102a4c',
    paper: '#ffffff',
    muted: '#4a6278',
    line: '#d5e2ef',
    onAccent: '#ffffff',
    kicker: 'Folsom plumbing',
    headline: 'A leak should not wait until Monday.',
    sub: 'You call. If the tech is under a sink, a text comes back and a visit lands on the book.',
    services: [
      {
        title: 'Leak repair',
        body: 'Supply lines, traps, and shutoffs. We find the drip, stop it, and show you the part that failed.',
      },
      {
        title: 'Water heaters',
        body: 'Tank and tankless. We check the leak, the age of the unit, and whether a repair is worth it.',
      },
      {
        title: 'Drain clearing',
        body: 'Kitchen and bath drains. We clear the stoppage and tell you what was sitting in the line.',
      },
      {
        title: 'Fixture install',
        body: 'Faucets, toilets, and disposals. The old one comes out. The new one is tested before we leave.',
      },
    ],
    steps: [
      { title: 'You call', body: 'If we are on a job, the line does not ring out. A text goes back from the shop.' },
      { title: 'You say what broke', body: 'A leak, a heater, or a drain. A few sentences is enough to book the visit.' },
      { title: 'A time is set', body: 'The visit is on the calendar. We text again before the truck rolls.' },
    ],
    areas: [
      { city: 'Folsom', body: 'Homes and small shops. Same-day visits when the board still has a gap.' },
      { city: 'Roseville', body: 'The text back includes a time, not a promise to call you later.' },
      { city: 'El Dorado Hills', body: 'On the regular route. This sample lists no street address.' },
    ],
    reviews: [
      { quote: 'They texted me back while I was still looking at the leak.', name: 'Sample customer, Folsom' },
      { quote: 'The visit was on the day they named. No chase required.', name: 'Sample customer, Roseville' },
      { quote: 'They told me the price before they opened the cabinet.', name: 'Sample customer, El Dorado Hills' },
    ],
    messages: [
      { side: 'out', text: 'Sorry we missed you. This is Ridgeline Plumbing. What is going on?' },
      { side: 'in', text: 'Kitchen sink is leaking under the cabinet.' },
      { side: 'out', text: 'Thursday at 10 is open. I will text before we roll.' },
    ],
    faqs: [
      {
        q: 'Is this a real plumbing company?',
        a: 'No. This is a sample site by DANZUS. It is not a real business. Calls and texts go to (916) 404-6129.',
      },
      {
        q: 'Do you charge to come look?',
        a: 'A real shop would say that before the visit. This page does not take a payment or book a real job.',
      },
      {
        q: 'How fast is the text?',
        a: 'In this sample, the reply lands in about a minute. The thread on this page is written for the demo.',
      },
    ],
    trust: [
      { value: 'Licensed', label: 'And insured' },
      { value: '2009', label: 'Shop opened' },
      { value: '1 min', label: 'Text back' },
      { value: '3 towns', label: 'Folsom, Roseville, El Dorado Hills' },
    ],
    photos: photos('plumber'),
    alts: {
      hero: 'Illustration of a plumber repairing a kitchen sink trap',
      work: 'Illustration of a plumber tightening fittings on a water heater',
      detail: 'Illustration of hands wrapping tape on a brass fitting',
      happy: 'Illustration of a plumber and a homeowner at a running faucet',
    },
    splitTitle: 'The work, up close.',
    splitBody: 'Heaters, traps, and the parts you can see once the door is open. These illustrations are for the sample.',
    ctaTitle: 'Call the sample line.',
    ctaBody: 'It rings DANZUS, not a plumber. Ask how a site like this would work for your shop.',
  },
  {
    id: 'hvac',
    path: '/demo/hvac',
    name: 'Comfort Peak Heating & Air',
    trade: 'Heating and air',
    accent: '#c45c26',
    ink: '#3a2418',
    paper: '#fbf6f0',
    muted: '#6d5346',
    line: '#eadfd2',
    onAccent: '#ffffff',
    kicker: 'Heating and air',
    headline: 'The house is hot. Someone should answer.',
    sub: 'A missed call gets a text. A tune-up or a no-cool visit goes on the book while you are still home.',
    services: [
      {
        title: 'No-cool visits',
        body: 'The system is running and the house is not. We start with the filter, the thermostat, and the outdoor unit.',
      },
      {
        title: 'Furnace checks',
        body: 'No heat, a short cycle, or a smell you do not trust. We look before we talk about a new system.',
      },
      {
        title: 'Seasonal tune-ups',
        body: 'A spring or fall visit. Filter, drains, and the readings we write down for you.',
      },
      {
        title: 'Thermostat swaps',
        body: 'The old one comes off the wall. The new one is tested in heat and cool before we leave.',
      },
    ],
    steps: [
      { title: 'You call', body: 'If the tech is at a condenser, you still get a text from Comfort Peak.' },
      { title: 'You name the room', body: 'Upstairs hot, no heat, or a tune-up. That is enough to pick a window.' },
      { title: 'We text when we are close', body: 'The time is on the calendar, and a reminder lands before the truck does.' },
    ],
    areas: [
      { city: 'Folsom', body: 'Homes in Folsom. We text a time before anyone leaves the shop.' },
      { city: 'Roseville', body: 'Tune-ups and no-cool calls, booked from the text thread.' },
      { city: 'El Dorado Hills', body: 'In the service area. This sample has no street address.' },
    ],
    reviews: [
      { quote: 'The upstairs was hot on a Saturday. They had a time the same day.', name: 'Sample customer, Folsom' },
      { quote: 'The reminder text meant we were actually home.', name: 'Sample customer, Roseville' },
    ],
    messages: [
      { side: 'out', text: 'Sorry we missed you. Comfort Peak Heating & Air. Is the system not cooling?' },
      { side: 'in', text: 'Upstairs is hot. Can someone come tomorrow?' },
      { side: 'out', text: 'Tomorrow at 2 is open. I will text when we are close.' },
    ],
    faqs: [
      {
        q: 'Is Comfort Peak a real company?',
        a: 'No. This is a sample site by DANZUS. Calls and texts go to (916) 404-6129.',
      },
      {
        q: 'Can you quote a new system on this page?',
        a: 'No. A real quote needs the house. This sample does not price equipment or take a deposit.',
      },
      {
        q: 'What does the text say?',
        a: 'It asks what the system is doing, then offers a time. The thread on this page is a sample.',
      },
    ],
    trust: [
      { value: 'Insured', label: 'For the work we do' },
      { value: '2012', label: 'Shop opened' },
      { value: 'Same day', label: 'When the board has room' },
      { value: '3 towns', label: 'Folsom, Roseville, El Dorado Hills' },
    ],
    photos: photos('hvac'),
    alts: {
      hero: 'Illustration of a technician connecting gauges to an outdoor unit',
      work: 'Illustration of a technician changing a furnace filter',
      detail: 'Illustration close-up of heating and air equipment',
      happy: 'Illustration of a technician with homeowners beside a thermostat',
    },
    splitTitle: 'Cool air, then the quiet part.',
    splitBody: 'The outdoor unit, the filter, and the room you actually live in. Illustrations are for this sample.',
    ctaTitle: 'Too warm to wait on hold?',
    ctaBody: 'This number is DANZUS. Use it to ask about a site like this for your own shop.',
  },
  {
    id: 'auto',
    path: '/demo/auto',
    name: 'Oak Avenue Auto Works',
    trade: 'Auto repair',
    accent: '#e0a24a',
    ink: '#f6f1e8',
    paper: '#1c1a17',
    muted: '#c9bfb3',
    line: '#3d3832',
    onAccent: '#1c1a17',
    kicker: 'Auto repair',
    headline: 'The car is in the bay. The phone still gets answered.',
    sub: 'A missed call becomes a text. Drop-off, brakes, or a check-engine light, booked without a hold queue.',
    services: [
      {
        title: 'Brakes',
        body: 'Grind, pull, or a soft pedal. We look at pads, rotors, and fluid, then tell you what is worn.',
      },
      {
        title: 'Oil service',
        body: 'Oil, filter, and a look underneath. You get the car back the same visit when the book allows.',
      },
      {
        title: 'Check engine',
        body: 'We read the light before we sell parts. You hear the code in plain language.',
      },
      {
        title: 'Drop-off',
        body: 'A morning slot by text. Keys, a note, and a message when the work is done.',
      },
    ],
    steps: [
      { title: 'You call the shop', body: 'If a tech is under a car, the text still goes out.' },
      { title: 'You name the noise', body: 'Brakes, a light, or an oil change. We offer a drop-off time.' },
      { title: 'Keys come back', body: 'We text when it is ready. A review ask goes out after you drive away.' },
    ],
    areas: [
      { city: 'Folsom', body: 'Drop the car on the morning we text you.' },
      { city: 'Roseville', body: 'Appointments start in the missed-call thread.' },
      { city: 'El Dorado Hills', body: 'On the map. No shop address on this sample.' },
    ],
    reviews: [
      { quote: 'I missed their call and had a text before I got back to the office.', name: 'Sample customer, Folsom' },
      { quote: 'The brake job was booked without sitting on hold.', name: 'Sample customer, Roseville' },
      { quote: 'They handed the keys back and said what they found.', name: 'Sample customer, El Dorado Hills' },
    ],
    messages: [
      { side: 'out', text: 'Sorry we missed you. Oak Avenue Auto Works. What do you need looked at?' },
      { side: 'in', text: 'Brakes are grinding. Can I drop it off Friday?' },
      { side: 'out', text: 'Friday at 8 works. I will text a reminder Thursday.' },
    ],
    faqs: [
      {
        q: 'Is Oak Avenue a real shop?',
        a: 'No. This is a sample site by DANZUS. The phone number is (916) 404-6129.',
      },
      {
        q: 'Do you keep the car overnight?',
        a: 'A real shop would say so up front. This page does not schedule a real drop-off.',
      },
      {
        q: 'Where do the texts go?',
        a: 'To DANZUS. The thread on this page is sample copy, not a live inbox.',
      },
    ],
    trust: [
      { value: 'One bay', label: 'A local shop' },
      { value: '2006', label: 'Bay opened' },
      { value: '8 am', label: 'Drop-off starts' },
      { value: '3 towns', label: 'Folsom, Roseville, El Dorado Hills' },
    ],
    photos: photos('auto'),
    alts: {
      hero: 'Illustration of a mechanic working under an open hood',
      work: 'Illustration of a mechanic inspecting the underside of a car',
      detail: 'Illustration close-up of auto repair work',
      happy: 'Illustration of a mechanic handing keys back at the shop door',
    },
    splitTitle: 'In the bay.',
    splitBody: 'The hood, the underside, and the keys at the door. Sample illustrations only.',
    ctaTitle: 'Book the conversation, not a bay.',
    ctaBody: 'This line reaches DANZUS. Ask what a shop site like this would cost.',
  },
  {
    id: 'salon',
    path: '/demo/salon',
    name: 'Willow & Brass Studio',
    trade: 'Hair studio',
    accent: '#8c4a55',
    ink: '#3a2428',
    paper: '#fbf8f4',
    muted: '#6e565c',
    line: '#ead9d4',
    onAccent: '#fffaf8',
    kicker: 'Hair studio',
    headline: 'The chair is full. The book can still fill.',
    sub: 'A missed call gets a text. A guest picks a cut, a color, or a blowout without waiting on hold.',
    services: [
      {
        title: 'Cut and style',
        body: 'A shape that works with the hair you have. We talk through it before the first section.',
      },
      {
        title: 'Color',
        body: 'Root, gloss, or a change. The consult is part of the visit, not a surprise at the bowl.',
      },
      {
        title: 'Blowout',
        body: 'A finish for an evening or a meeting. You leave with it smooth, not halfway dry.',
      },
      {
        title: 'Bangs trim',
        body: 'A short visit between full cuts. Booked by text when the chair has a gap.',
      },
    ],
    steps: [
      { title: 'You call the studio', body: 'If the chair is full, the text still answers.' },
      { title: 'You name the visit', body: 'Cut, color, blowout, or bangs. A time that is still open comes back.' },
      { title: 'A reminder the day before', body: 'You confirm. The chair stays yours.' },
    ],
    areas: [
      { city: 'Folsom', body: 'Guests from Folsom pick a chair time from the text.' },
      { city: 'Roseville', body: 'A text first, then a time that is still open.' },
      { city: 'El Dorado Hills', body: 'Welcome. This sample lists no street address.' },
    ],
    reviews: [
      { quote: 'I called from the car and booked the trim by text.', name: 'Sample guest, Folsom' },
      { quote: 'The reminder the day before saved the appointment.', name: 'Sample guest, Roseville' },
      { quote: 'Color started when they said it would.', name: 'Sample guest, El Dorado Hills' },
    ],
    messages: [
      { side: 'out', text: 'Sorry we missed you. Willow & Brass Studio. Cut, color, or a blowout?' },
      { side: 'in', text: 'A trim on Saturday if you have a chair.' },
      { side: 'out', text: 'Saturday at 11 is open. I will text Friday to confirm.' },
    ],
    faqs: [
      {
        q: 'Is Willow & Brass a real studio?',
        a: 'No. This is a sample site by DANZUS. The number (916) 404-6129 rings DANZUS.',
      },
      {
        q: 'Can I book a real chair here?',
        a: 'No. The times on this page are sample copy. Nothing is held.',
      },
      {
        q: 'Who sends the text?',
        a: 'On a real shop, the studio would. On this sample, the example thread is written by DANZUS.',
      },
    ],
    trust: [
      { value: 'By appointment', label: 'Studio hours' },
      { value: '2016', label: 'Studio opened' },
      { value: '1 text', label: 'Reply when the chair is full' },
      { value: '3 towns', label: 'Folsom, Roseville, El Dorado Hills' },
    ],
    photos: photos('salon'),
    alts: {
      hero: 'Illustration of a stylist cutting long hair beside a window',
      work: 'Illustration of a stylist blow-drying long hair',
      detail: 'Illustration close-up from the studio',
      happy: 'Illustration of a guest seeing a finished cut in the mirror',
    },
    splitTitle: 'The chair, then the finish.',
    splitBody: 'A cut at the window. A blowout before you leave. These illustrations are for the sample.',
    ctaTitle: 'Ask for a site with this much quiet.',
    ctaBody: 'The number belongs to DANZUS. Tell us about your studio, or your shop.',
  },
]

export const DEMO_PHONE_DISPLAY = CONTACT_PHONE_DISPLAY
export const DEMO_PHONE_TEL = CONTACT_PHONE_TEL
export const DEMO_HOME = SITE_URL
