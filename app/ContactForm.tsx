'use client'

import { flushSync } from 'react-dom'
import { FormEvent, useState } from 'react'
import { CONTACT_EMAIL } from './site'
import styles from './home.module.css'

const MAILTO_SUBJECT = 'Free call request'

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

    const lines = [
      `Name: ${name}`,
      `Business: ${business}`,
      `Email: ${email}`,
      `Phone: ${phone || 'not provided'}`,
      `First workflow: ${workflow}`,
      '',
      details || 'No extra details.',
    ]

    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `${MAILTO_SUBJECT}: ${business}`,
    )}&body=${encodeURIComponent(lines.join('\n'))}`

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
        <label className={styles.field}>
          Phone <span className={styles.optional}>(optional)</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
      </div>
      <label className={styles.field}>
        What should it handle first?
        <select name="workflow" required defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          <option>Missed-call text-back</option>
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
      <button className={styles.primary} type="submit">
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
