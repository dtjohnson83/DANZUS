import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { CONTACT_PHONE_SMS } from '@/app/site'
import { MissedCallChat } from './MissedCallChat'
import { DEMO_HOME, DEMO_PHONE_DISPLAY, DEMO_PHONE_TEL, type TradeDemo } from './trades'
import styles from './sample.module.css'

export function demoMetadata(trade: TradeDemo): Metadata {
  return {
    title: { absolute: `${trade.name} | Sample site by DANZUS` },
    description: `Sample site for ${trade.name}. Not a real business. Calls go to DANZUS.`,
    robots: { index: false, follow: true },
    alternates: { canonical: trade.path },
  }
}

export function SampleSite({ trade, className }: { trade: TradeDemo; className?: string }) {
  const theme = {
    '--accent': trade.accent,
    '--ink': trade.ink,
    '--paper': trade.paper,
    '--muted': trade.muted,
    '--line': trade.line,
    '--on-accent': trade.onAccent,
  } as CSSProperties

  return (
    <div className={`${styles.page} ${className ?? ''}`} data-sample-site="" data-brand={trade.id} style={theme}>
      <p className={styles.banner}>Sample site by DANZUS. Not a real business.</p>
      <header className={styles.header}>
        <div className={`${styles.shell} ${styles.bar}`}>
          <a className={styles.brand} href="#top">
            {trade.name}
            <span>{trade.trade}</span>
          </a>
          <nav className={styles.siteNav} aria-label={`${trade.name} sample`}>
            <a href="#services" data-track="nav_click" data-track-label="Services" data-track-location="desktop">
              Services
            </a>
            <a href="#visit" data-track="nav_click" data-track-label="How it works" data-track-location="desktop">
              How it works
            </a>
            <a href="#area" data-track="nav_click" data-track-label="Area" data-track-location="desktop">
              Area
            </a>
            <a href="#questions" data-track="nav_click" data-track-label="Questions" data-track-location="desktop">
              Questions
            </a>
          </nav>
          <a
            className={styles.call}
            href={DEMO_PHONE_TEL}
            data-track="call_click"
            data-track-location="nav"
            data-track-label={`Call ${DEMO_PHONE_DISPLAY}`}
            data-track-section="nav"
          >
            <span className={styles.callWord}>Call</span>
            {DEMO_PHONE_DISPLAY}
          </a>
        </div>
      </header>

      <main id="top">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroMedia}>
            <Image
              src={trade.photos.hero}
              alt={trade.alts.hero}
              fill
              priority
              sizes="100vw"
              className={styles.heroImg}
            />
            <div className={styles.heroShade} aria-hidden="true" />
          </div>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>{trade.kicker}</p>
            <h1 id="hero-title">{trade.headline}</h1>
            <p className={styles.sub}>{trade.sub}</p>
            <div className={styles.heroActions}>
              <a
                className={styles.primary}
                href={DEMO_PHONE_TEL}
                data-track="call_click"
                data-track-location="hero"
                data-track-label={`Call ${DEMO_PHONE_DISPLAY}`}
                data-track-section="hero"
              >
                Call {DEMO_PHONE_DISPLAY}
              </a>
              <a
                className={styles.secondary}
                href={CONTACT_PHONE_SMS}
                data-track="text_click"
                data-track-location="hero"
                data-track-label={`Text ${DEMO_PHONE_DISPLAY}`}
                data-track-section="hero"
              >
                Text instead
              </a>
            </div>
          </div>
        </section>

        <section className={styles.trust} aria-label="Sample shop facts">
          <div className={styles.shell}>
            <p className={styles.trustNote}>Fictional shop facts. Not a real business, and not a review count.</p>
            <ul>
              {trade.trust.map((item) => (
                <li key={item.value}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.band} id="services">
          <div className={styles.shell}>
            <p className={styles.kicker}>Services</p>
            <h2>What this sample shop books.</h2>
            <ul className={styles.services}>
              {trade.services.map((item, index) => (
                <li key={item.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.split} id="work">
          <div className={`${styles.shell} ${styles.splitGrid}`}>
            <div>
              <p className={styles.kicker}>On the job</p>
              <h2>{trade.splitTitle}</h2>
              <p className={styles.lede}>{trade.splitBody}</p>
            </div>
            <figure className={styles.shot}>
              <div className={styles.frame}>
                <Image src={trade.photos.work} alt={trade.alts.work} fill sizes="(min-width: 900px) 46vw, 100vw" />
              </div>
              <figcaption>The work</figcaption>
            </figure>
            <figure className={`${styles.shot} ${styles.detailShot}`}>
              <div className={styles.frame}>
                <Image src={trade.photos.detail} alt={trade.alts.detail} fill sizes="(min-width: 900px) 32vw, 100vw" />
              </div>
              <figcaption>A closer look</figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.band} id="visit">
          <div className={styles.shell}>
            <p className={styles.kicker}>How it works</p>
            <h2>Three steps. No hold music.</h2>
            <ol className={styles.steps}>
              {trade.steps.map((step, index) => (
                <li key={step.title}>
                  <span>{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.band} id="notes">
          <div className={`${styles.shell} ${styles.reviewLayout}`}>
            <figure className={styles.happy}>
              <div className={styles.frame}>
                <Image src={trade.photos.happy} alt={trade.alts.happy} fill sizes="(min-width: 900px) 36vw, 100vw" />
              </div>
              <figcaption>Sample photo. Not a review from Google or Yelp.</figcaption>
            </figure>
            <div>
              <p className={styles.kicker}>Sample notes</p>
              <h2>Written for this page.</h2>
              <ul className={styles.reviews}>
                {trade.reviews.map((review) => (
                  <li key={review.quote}>
                    <p>{review.quote}</p>
                    <span>Sample · {review.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.band} id="area">
          <div className={styles.shell}>
            <p className={styles.kicker}>Service area</p>
            <h2>Three towns. No street address.</h2>
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

        <section className={styles.band} id="questions">
          <div className={`${styles.shell} ${styles.faqWrap}`}>
            <div>
              <p className={styles.kicker}>Questions</p>
              <h2>Before you tap the number.</h2>
            </div>
            <div className={styles.faqs}>
              {trade.faqs.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.cta} aria-labelledby="cta-title">
          <div className={styles.shell}>
            <h2 id="cta-title">{trade.ctaTitle}</h2>
            <p>{trade.ctaBody}</p>
            <div className={styles.heroActions}>
              <a
                className={styles.primary}
                href={DEMO_PHONE_TEL}
                data-track="call_click"
                data-track-location="section"
                data-track-label={`Call ${DEMO_PHONE_DISPLAY}`}
                data-track-section="cta"
              >
                Call {DEMO_PHONE_DISPLAY}
              </a>
              <a
                className={styles.secondary}
                href={CONTACT_PHONE_SMS}
                data-track="text_click"
                data-track-location="section"
                data-track-label={`Text ${DEMO_PHONE_DISPLAY}`}
                data-track-section="cta"
              >
                Text {DEMO_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.foot}>
        <div className={`${styles.shell} ${styles.footInner}`}>
          <p>
            {trade.name}
            <small>Sample site by DANZUS. Not a real business.</small>
          </p>
          <a
            href={DEMO_PHONE_TEL}
            data-track="call_click"
            data-track-location="footer"
          >
            {DEMO_PHONE_DISPLAY}
          </a>
          <a href={DEMO_HOME} data-track="outbound_click" data-track-label="DANZUS home">
            Want this for your shop?
          </a>
        </div>
      </footer>

      <MissedCallChat name={trade.name} messages={trade.messages} sms={CONTACT_PHONE_SMS} display={DEMO_PHONE_DISPLAY} />
    </div>
  )
}
