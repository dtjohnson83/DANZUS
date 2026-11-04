'use client'

import Link from 'next/link'
import { flushSync } from 'react-dom'
import { FormEvent, useState } from 'react'
import { CONTACT_EMAIL } from './site'
import styles from './home.module.css'

const MAILTO_SUBJECT = 'Free call request'

export function contactLeadBody(input: {
  name: string
  business: string
  email: string
  phone: string
  workflow: string
  details: string
  smsConsent: boolean
}) {
  return [
    `Name: ${input.name}`,
    `Business: ${input.business}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || 'not provided'}`,
    `SMS consent: ${input.smsConsent ? 'yes' : 'no'}`,
    `First workflow: ${input.workflow}`,
    '',
    input.details || 'No extra details.',
  ].join('\n')
}

export function ContactForm() {
  const [status, setStatus] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const business = String(data.get('business') || '').trim()
    const email = String(data.get('email') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    const workflow = String(data.get('workflow') || '').trim()
    const details = String(data.get('details') || '').trim()
    const smsConsent = data.get('smsConsent') === 'yes'

    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `${MAILTO_SUBJECT}: ${business}`,
    )}&body=${encodeURIComponent(
      contactLeadBody({ name, business, email, phone, workflow, details, smsConsent }),
    )}`

    flushSync(() => {
      setStatus(`Your email app should open with this note addressed to ${CONTACT_EMAIL}. If it does not, use the email link below.`)
    })
    window.location.href = href
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formRow}>
        <label className={styles.field}>
          Name
          <input name="name" type="text" autoComplete="name" required maxLength={120} />
        </label>
        <label className={styles.field}>
          Business
          <input name="business" type="text" autoComplete="organization" required maxLength={160} />
        </label>
      </div>
      <div className={styles.formRow}>
        <label className={styles.field}>
          Email
          <input name="email" type="email" autoComplete="email" required maxLength={160} />
        </label>
        <div className={styles.phoneField}>
          <label className={styles.field}>
            Phone <span className={styles.optional}>(optional)</span>
            <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
          </label>
          <div className={styles.consent}>
            <input id="sms-consent" name="smsConsent" type="checkbox" value="yes" />
            <label htmlFor="sms-consent">
              I agree to receive text messages from DANZUS Holdings LLC about my inquiry, scheduling, and reminders.
              Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent
              is not a condition of purchase. <Link href="/privacy">Privacy</Link>
              {' · '}
              <Link href="/terms">Terms</Link>
            </label>
          </div>
        </div>
      </div>
      <label className={styles.field}>
        What should we start with?
        <select name="workflow" required defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          <option>Missed-call text-back</option>
          <option>A new website</option>
          <option>Google and AI search</option>
          <option>DANZUS Growth</option>
          <option>Website or Facebook lead response</option>
          <option>Quote follow-up</option>
          <option>Booking and reminders</option>
          <option>Google review requests</option>
          <option>Invoices, payment reminders, or inbox triage</option>
          <option>FAQ chat</option>
          <option>Not sure yet</option>
        </select>
      </label>
      <label className={styles.field}>
        Anything else? <span className={styles.optional}>(optional)</span>
        <textarea
          name="details"
          rows={4}
          maxLength={2000}
          placeholder="How leads come in today, and which one slips most often."
        />
      </label>
      <button
        className={styles.primary}
        type="submit"
        data-track="cta_click"
        data-track-label="Book a free call"
        data-track-section="about"
      >
        Book a free call
      </button>
      {status ? (
        <p className={styles.formStatus} role="status">
          {status}
        </p>
      ) : (
        <p className={styles.formHint}>
          This opens your email app with the note filled in. Nothing is stored on this site.
        </p>
      )}
    </form>
  )
}
