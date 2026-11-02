import type { Metadata } from 'next'
import { DEMO_HOME, DEMO_PHONE_DISPLAY, DEMO_PHONE_TEL, type TradeDemo } from './trades'
import { SchedulePicker, VisitForm } from './SampleActions'
import styles from './sample.module.css'

export function demoMetadata(trade: TradeDemo): Metadata {
  return {
    title: { absolute: `${trade.name} | Sample site by DANZUS` },
    description: `Sample site for ${trade.name}. Not a real business. Calls go to DANZUS.`,
    robots: { index: false, follow: true },
    alternates: { canonical: trade.path },
  }
}

export function SampleSite({ trade }: { trade: TradeDemo }) {
  return (
    <div className={styles.page} style={{ ['--accent' as string]: trade.accent, ['--ink' as string]: trade.ink }}>
      <p className={styles.banner}>Sample site by DANZUS. Not a real business.</p>
      <div className={styles.shell}>
        <header className={styles.top}>
          <p className={styles.brand}>
            {trade.name}
            <span className={styles.trade}>{trade.trade}</span>
          </p>
          <a className={styles.call} href={DEMO_PHONE_TEL}>
            Call {DEMO_PHONE_DISPLAY}
          </a>
        </header>
        <section className={styles.hero}>
          <h1>{trade.headline}</h1>
          <p className={styles.sub}>{trade.sub}</p>
          <a className={styles.bigCall} href={DEMO_PHONE_TEL}>
            Call {DEMO_PHONE_DISPLAY}
          </a>
          <div className={styles.thread} aria-label="Sample missed-call text">
            {trade.messages.map((message) => (
              <p key={message.text} className={`${styles.bubble} ${message.side === 'in' ? styles.in : styles.out}`}>
                {message.text}
              </p>
            ))}
          </div>
          <ul className={styles.services}>
            {trade.services.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className={styles.block}>
          <h2>{trade.kind === 'schedule' ? 'Pick a time' : 'Request a visit'}</h2>
          {trade.kind === 'schedule' ? <SchedulePicker /> : <VisitForm />}
        </section>
        <section className={styles.block}>
          <h2>Sample reviews</h2>
          <ul className={styles.reviews}>
            {trade.reviews.map((review) => (
              <li key={review.quote}>
                <p>{review.quote}</p>
                <span>{review.name}</span>
              </li>
            ))}
          </ul>
        </section>
        {trade.areas.map((area) => (
          <section className={styles.block} key={area.city}>
            <h2>{area.city}</h2>
            <p>{area.body}</p>
          </section>
        ))}
        <footer className={styles.foot}>
          <a href={DEMO_HOME}>Want this for your shop? Free call</a>
        </footer>
      </div>
    </div>
  )
}
