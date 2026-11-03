'use client'

import { FormEvent, useState } from 'react'
import styles from './ai-search.module.css'

type Result = {
  ok: boolean
  error?: string
  score?: number | null
  note?: string
  passed?: { label: string; detail: string }[]
  fixes?: { label: string; fix: string; detail: string }[]
  unmeasured?: string[]
  email?: { sent: boolean; detail: string }
}

export function CheckForm() {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setPending(true)
    setResult(null)
    try {
      const response = await fetch('/api/ai-check', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          businessName: String(data.get('businessName') || ''),
          url: String(data.get('url') || ''),
          cityTrade: String(data.get('cityTrade') || ''),
          email: String(data.get('email') || ''),
          optIn: data.get('optIn') === 'yes',
          companyWebsite: String(data.get('companyWebsite') || ''),
        }),
      })
      const json = (await response.json()) as Result
      setResult(json.ok ? json : { ok: false, error: json.error || 'The check did not finish.' })
    } catch {
      setResult({ ok: false, error: 'The check did not finish. Try again in a minute.' })
    } finally {
      setPending(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label>
        Business name
        <input name="businessName" required maxLength={120} autoComplete="organization" />
      </label>
      <label>
        Website
        <input name="url" type="text" required maxLength={300} placeholder="https://example.com" inputMode="url" autoComplete="url" />
      </label>
      <label>
        City and trade
        <input name="cityTrade" required maxLength={120} placeholder="Folsom, plumber" />
      </label>
      <label>
        Email
        <input name="email" type="email" required maxLength={160} autoComplete="email" />
      </label>
      <div className={styles.consent}>
        <input id="ai-opt-in" name="optIn" type="checkbox" value="yes" />
        <label htmlFor="ai-opt-in">
          DANZUS may email me about these fixes. Optional. You still get this report either way.
        </label>
      </div>
      <div className={styles.hp} aria-hidden="true">
        <label>
          Company website
          <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        data-track="cta_click"
        data-track-label="Run the free check"
        data-track-section="ai-search"
      >
        {pending ? 'Checking the site...' : 'Run the free check'}
      </button>
      {result?.ok === false ? (
        <p className={styles.formStatus} role="alert">
          {result.error}
        </p>
      ) : null}
      {result?.ok ? (
        <div className={styles.result} role="status">
          <p className={styles.score}>
            {result.score === null || result.score === undefined ? 'Not scored' : result.score}
            {result.score === null || result.score === undefined ? null : <span>/100</span>}
          </p>
          <p>{result.note}</p>
          <p>{result.email?.detail}</p>
          <h3>What passed</h3>
          {result.passed?.length ? (
            <ul>
              {result.passed.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}.</strong> {item.detail}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nothing we measured passed.</p>
          )}
          <h3>Top fixes</h3>
          {result.fixes?.length ? (
            <ol>
              {result.fixes.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}.</strong> {item.fix}
                </li>
              ))}
            </ol>
          ) : (
            <p>No failed signals in what we measured.</p>
          )}
          {result.unmeasured?.length ? <p>Not measured: {result.unmeasured.join(', ')}.</p> : null}
        </div>
      ) : null}
    </form>
  )
}
