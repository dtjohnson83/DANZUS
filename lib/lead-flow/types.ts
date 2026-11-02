export type LeadStatus = 'new' | 'qualifying' | 'slots_offered' | 'booked' | 'escalated'

export type LeadMessage = {
  id: string
  direction: 'in' | 'out'
  body: string
  at: string
  /** pending/sent/failed are REST sends. twiml is delivered by the webhook response. */
  delivery?: 'pending' | 'sent' | 'failed' | 'twiml'
}

export type Lead = {
  id: string
  clientId: string
  phone: string
  status: LeadStatus
  name: string
  jobType: string
  area: string
  timing: string
  budgetNote: string
  bookedSlot: string
  escalationReason: string
  ownerNotified: boolean
  optedOut: boolean
  messages: LeadMessage[]
  createdAt: string
  updatedAt: string
}

export type PriceRange = {
  service: string
  min: number
  max: number
}

export type Weekday = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'

/**
 * Per-client template. Copy config/clients/demo.ts and register the new file.
 * twilioNumber is the only line this client may send from.
 */
export type ClientConfig = {
  id: string
  businessName: string
  /** How the texting assistant should sound. */
  voice: string
  services: string[]
  area: string
  qualifyingQuestions: string[]
  /** Calendar stub. Example slots are generated from these hours, not a live calendar. */
  hours: {
    timezone: string
    days: Weekday[]
    /** 24-hour HH:mm in `timezone`. */
    open: string
    close: string
  }
  /** Person who gets an SMS when a lead is upset or unsure. */
  ownerPhone: string
  /** Inbound Twilio number for this client. Also the From number on outbound SMS. */
  twilioNumber: string
  /** Ballpark ranges the assistant may mention. Never a single firm price. */
  allowedPriceRanges: PriceRange[]
  /** Played on the missed call, then the call hangs up. */
  greeting: string
  /** Text sent to the caller right after the greeting. */
  missedCallSms: string
}

export type QualifyAction = 'continue' | 'offer_slots' | 'book' | 'escalate'

export type QualifyResult = {
  reply: string
  action: QualifyAction
  name: string
  jobType: string
  area: string
  timing: string
  budgetNote: string
  selectedSlot: string
  escalationReason: string
}

export type QualifyInput = {
  config: ClientConfig
  /** History before the message being handled. */
  lead: Lead
  slots: string[]
  inbound: string
}

export type Qualify = (input: QualifyInput) => Promise<QualifyResult>

export type SendSms = (message: { to: string; from: string; body: string }) => Promise<void>

export interface LeadStore {
  get(clientId: string, phone: string): Promise<Lead | null>
  save(lead: Lead): Promise<void>
  list(): Promise<Lead[]>
}
