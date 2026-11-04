import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { login, logout } from '@/app/demo/actions'
import { DEMO_COOKIE, sessionMatches } from '@/lib/lead-flow/admin-session'
import { blobLeadStore, leadStoreErrorMessage } from '@/lib/lead-flow/blob-store'
import { formatPhone } from '@/lib/lead-flow/phone'
import { clients } from '@/lib/lead-flow/registry'
import { safeHttpUrl } from '@/lib/lead-flow/voicemail-email'
import type { Lead, LeadStatus } from '@/lib/lead-flow/types'
import styles from './demo.module.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { absolute: 'Lead inbox | DANZUS' },
  description: 'Private lead inbox for DANZUS. Not for public search.',
  alternates: { canonical: '/demo' },
  robots: { index: false, follow: false },
}

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'New',
  qualifying: 'Qualifying',
  slots_offered: 'Times offered',
  booked: 'Booked',
  escalated: 'Owner follow-up',
}

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const password = process.env.DEMO_ADMIN_PASSWORD ?? ''
  const jar = await cookies()
  const authed = sessionMatches(jar.get(DEMO_COOKIE)?.value, password)

  if (!authed) {
    return (
      <main className={styles.shell}>
        <div className={styles.inner}>
          <p className={styles.kicker}>Lead to booked job</p>
          <h1 className={styles.title}>Demo inbox</h1>
          <p className={styles.lede}>
            Conversations for the DANZUS business line. This page is separate from the public site.
          </p>
          <form className={`${styles.panel} ${styles.form}`} action={login}>
            {password ? null : (
              <p className={styles.error}>Set DEMO_ADMIN_PASSWORD before signing in.</p>
            )}
            {params.error ? <p className={styles.error}>Wrong password.</p> : null}
            <label>
              Password
              <input name="password" type="password" autoComplete="current-password" required />
            </label>
            <button type="submit">View leads</button>
          </form>
        </div>
      </main>
    )
  }

  let leads: Lead[] = []
  let storeError = ''
  try {
    const known = new Set(clients.map((client) => client.id))
    leads = (await blobLeadStore.list())
      .filter((lead) => known.has(lead.clientId))
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
  } catch (error) {
    storeError = leadStoreErrorMessage(error)
  }

  const demo = clients[0]

  return (
    <main className={styles.shell}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <p className={styles.kicker}>Lead to booked job</p>
            <h1 className={styles.title}>{demo.businessName}</h1>
            <p className={styles.meta}>
              Calls to {formatPhone(demo.twilioNumber)} ring {formatPhone(demo.forwardTo)} for {demo.ringTimeoutSeconds}s.
              If nobody answers, the caller can leave a voicemail and gets a text right away. Recordings are emailed
              to {demo.ownerEmail}. Escalations go to {formatPhone(demo.ownerPhone)}. Times offered are a stub from the
              hours in the client config.
            </p>
          </div>
          <form action={logout}>
            <button className={styles.ghost} type="submit">
              Log out
            </button>
          </form>
        </div>

        {storeError ? <p className={`${styles.panel} ${styles.error}`}>{storeError}</p> : null}

        {!storeError && leads.length === 0 ? (
          <p className={`${styles.panel} ${styles.empty}`}>
            No leads yet. A call or text to {formatPhone(demo.twilioNumber)} will show up here.
          </p>
        ) : null}

        <div className={styles.stack}>
          {leads.map((lead) => {
            const client = clients.find((item) => item.id === lead.clientId)
            return (
              <article className={styles.card} key={lead.id} data-status={lead.status}>
                <div className={styles.cardHead}>
                  <h2 className={styles.phone}>{formatPhone(lead.phone)}</h2>
                  <span className={styles.status}>{STATUS_LABEL[lead.status]}</span>
                </div>
                <div className={styles.facts}>
                  <span>{client?.businessName}</span>
                  {lead.jobType ? <span>Job: {lead.jobType}</span> : null}
                  {lead.area ? <span>Area: {lead.area}</span> : null}
                  {lead.timing ? <span>Timing: {lead.timing}</span> : null}
                  {lead.budgetNote ? <span>Budget note: {lead.budgetNote}</span> : null}
                  {lead.bookedSlot ? <span>Booked: {lead.bookedSlot}</span> : null}
                  {lead.optedOut ? <span>Opted out</span> : null}
                </div>
                {lead.voicemails.length > 0 ? (
                  <div className={styles.voicemails}>
                    {lead.voicemails.map((item) => {
                      const href = safeHttpUrl(item.recordingUrl)
                      return (
                        <p className={styles.voicemail} key={item.recordingSid || item.callSid}>
                          <span className={styles.who}>Voicemail</span>
                          {item.durationSeconds ? `${item.durationSeconds}s. ` : null}
                          {href ? <a href={href}>Listen</a> : null}
                          {item.transcript ? ` ${item.transcript}` : ' No transcript yet.'}
                        </p>
                      )
                    })}
                  </div>
                ) : null}
                <div className={styles.thread}>
                  {lead.messages.map((message) => (
                    <p
                      className={`${styles.bubble} ${message.direction === 'in' ? styles.in : styles.out}`}
                      key={message.id}
                    >
                      <span className={styles.who}>{message.direction === 'in' ? 'Lead' : 'Shop'}</span>
                      {message.body}
                    </p>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}
