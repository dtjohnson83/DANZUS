'use client'

import { FormEvent, useState } from 'react'
import { flushSync } from 'react-dom'
import { CONTACT_EMAIL } from '../site'
import styles from '../home.module.css'

const PLANS = [
  'Missed-call text-back, $99 a month',
  'Website hosting and small edits, $49 a month',
  'Google and AI search, $199 a month',
  'DANZUS Growth, $299 a month',
] as const

export function CancelForm() {
  const [status, setStatus] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const business = String(data.get('business') || '').trim()
    const plan = String(data.get('plan') || '').trim()
    const body = [
      'Please cancel this monthly plan.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Business: ${business}`,
      `Plan: ${plan}`,
    ].join('\n')
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `Cancel monthly plan: ${business}`,
    )}&body=${encodeURIComponent(body)}`

    flushSync(() => {
      setStatus(
        `Your email app should open with a cancellation note to ${CONTACT_EMAIL}. If it does not, email that address with the plan name.`,
      )
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
          Email on the account
          <input name="email" type="email" autoComplete="email" required maxLength={160} />
        </label>
      </div>
      <label className={styles.field}>
        Business
        <input name="business" type="text" autoComplete="organization" required maxLength={160} />
      </label>
      <label className={styles.field}>
        Plan to cancel
        <select name="plan" required defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          {PLANS.map((plan) => (
            <option key={plan}>{plan}</option>
          ))}
        </select>
      </label>
      <button className={styles.primary} type="submit">
        Email the cancellation
      </button>
      {status ? (
        <p className={styles.formStatus} role="status">
          {status}
        </p>
      ) : (
        <p className={styles.formHint}>This opens your email app. Nothing is stored on this page.</p>
      )}
    </form>
  )
}
