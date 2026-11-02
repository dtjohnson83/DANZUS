import type { Metadata } from 'next'
import { DEMO_HOME, DEMO_PHONE_DISPLAY, DEMO_PHONE_TEL, type TradeDemo } from './trades'
import { SchedulePicker, VisitForm } from './SampleActions'
import { TradeArt } from './TradeArt'
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
    <div
      className={styles.page}
      data-sample-site=""
      style={{ ['--accent' as string]: trade.accent, ['--ink' as string]: trade.ink }}
    >
      <p className={styles.banner}>Sample site by DANZUS. Not a real business.</p>
      <header>
        <div className={`${styles.shell} ${styles.nav}`}>
          <p className={styles.brand}>
            {trade.name}
            <span className={styles.trade}>{trade.trade}</span>
          </p>
          <a className={styles.call} href={DEMO_PHONE_TEL}>
            Call {DEMO_PHONE_DISPLAY}
          </a>
        </div>
      </header>
      <section className={styles.hero}>
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div>
            <p className={styles.kicker}>{trade.trade}</p>
            <h1>{trade.headline}</h1>
            <p className={styles.sub}>{trade.sub}</p>
            <a className={styles.bigCall} href={DEMO_PHONE_TEL}>
              Call {DEMO_PHONE_DISPLAY}
            </a>
          </div>
          <div className={styles.stage}>
            <TradeArt id={trade.id} />
            <div className={styles.thread} aria-label="Sample missed-call text">
              {trade.messages.map((message) => (
                <p key={message.text} className={`${styles.bubble} ${message.side === 'in' ? styles.in : styles.out}`}>
                  {message.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className={`${styles.band} ${styles.tint}`}>
        <div className={styles.shell}>
          <h2>What we do</h2>
          <p className={styles.lede}>The work this sample shop is set up to book.</p>
          <ul className={styles.serviceGrid}>
            {trade.services.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className={`${styles.band} ${styles.white}`}>
        <div className={styles.shell}>
          <h2>{trade.kind === 'schedule' ? 'Pick a time' : 'Request a visit'}</h2>
          <p className={styles.lede}>
            {trade.kind === 'schedule'
              ? 'Choose a chair time. This sample does not book a real appointment.'
              : 'Tell the shop what you need. This sample does not send the form.'}
          </p>
          {trade.kind === 'schedule' ? <SchedulePicker /> : <VisitForm />}
        </div>
      </section>
      <section className={`${styles.band} ${styles.tint}`}>
        <div className={styles.shell}>
          <h2>Sample reviews</h2>
          <p className={styles.lede}>Written for this sample. Not reviews of a real shop.</p>
          <ul className={styles.reviews}>
            {trade.reviews.map((review) => (
              <li key={review.quote}>
                <p>{review.quote}</p>
                <span>{review.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className={`${styles.band} ${styles.white}`}>
        <div className={styles.shell}>
          <h2>Where we work</h2>
          <p className={styles.lede}>Three towns. No street address on this sample.</p>
          <div className={styles.areas}>
            {trade.areas.map((area) => (
              <article key={area.city}>
                <h3>{area.city}</h3>
                <p>{area.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <footer className={styles.foot}>
        <div className={`${styles.shell} ${styles.footInner}`}>
          <p>
            {trade.name}
            <small>Sample site by DANZUS. Not a real business.</small>
          </p>
          <a href={DEMO_HOME}>Want this for your shop? Free call</a>
        </div>
      </footer>
    </div>
  )
}
