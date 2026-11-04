import type { ReactNode } from 'react'
import Link from 'next/link'
import { display } from './legal-font'
import legal from './legal.module.css'
import styles from './home.module.css'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import { CONTACT_PHONE_TEL } from './site'

export function LegalPage({
  kicker,
  title,
  children,
}: {
  kicker: string
  title: string
  children: ReactNode
}) {
  return (
    <div className={`${styles.page} ${display.variable}`}>
      <a className={styles.skip} href="#content">
        Skip to content
      </a>
      <SiteHeader solid>
        <div className={styles.shell}>
          <div className={styles.headerInner}>
            <Link className={styles.brand} href="/" aria-label="DANZUS home">
              <img src="/danzus-mark.svg" alt="" width={28} height={28} />
              DANZUS
            </Link>
            <a
              className={styles.call}
              href={CONTACT_PHONE_TEL}
              data-track="call_click"
              data-track-location="nav"
              data-track-label="Call or text Dan"
              data-track-section="nav"
            >
              Call or text Dan
            </a>
          </div>
        </div>
      </SiteHeader>
      <main id="content" className={legal.main}>
        <div className={styles.shell}>
          <p className={styles.kicker}>{kicker}</p>
          <h1>{title}</h1>
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
