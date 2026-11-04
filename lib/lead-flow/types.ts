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
  /** Recordings left after a missed call. Empty on leads that never got that far. */
  voicemails: Voicemail[]
  createdAt: string
  updatedAt: string
}

export type Voicemail = {
  callSid: string
  recordingSid: string
  recordingUrl: string
  durationSeconds: number
  transcript: string
  /** ISO time the recording started, or when it was stored. */
  recordedAt: string
  /** Set when the owner email for this recording was accepted. */
  ownerEmailedAt: string
  /** Set when an email that included the transcript was accepted. */
  transcriptEmailedAt: string
  ownerTexted: boolean
}

/** One approved offer the texting assistant may quote. */
export type PriceMenuItem = {
  service: string
  /** Dollar amounts that may appear when this offer is quoted. */
  amounts: number[]
  /** Approved wording. The assistant should use this, not a different price. */
  detail: string
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
  /** Inbox for voicemail notices. */
  ownerEmail: string
  /** Cell that rings first on an inbound call. Not a Twilio number this app sends from. */
  forwardTo: string
  /** How long to ring `forwardTo` before treating the call as missed. Twilio allows 5–600. */
  ringTimeoutSeconds: number
  /** Inbound Twilio number for this client. Also the From number on outbound SMS. */
  twilioNumber: string
  /** Approved prices the assistant may quote. */
  priceMenu: PriceMenuItem[]
  /**
   * Played when the forward is missed.
   * With voicemail enabled, a recording follows this greeting.
   */
  greeting: string
  /** Text sent to the caller as soon as the call is missed, before any voicemail finishes. */
  missedCallSms: string
  voicemail: VoicemailSettings
}

export type VoicemailSettings = {
  /** When true, a missed call records after `greeting`. When false, the greeting plays and the call hangs up. */
  enabled: boolean
  /** Twilio `<Record maxLength>`. About 120 seconds for a short message. */
  maxLengthSeconds: number
  playBeep: boolean
  transcribe: boolean
  /** Text `ownerPhone` a short note with the recording link. */
  textOwner: boolean
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
