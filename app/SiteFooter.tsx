import Link from 'next/link'
import styles from './home.module.css'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_SMS, CONTACT_PHONE_TEL, LINKEDIN_URL } from './site'

const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Free call request')}`

export function SiteFooter() {
  return (
    <footer className={styles.footer} id="shop-footer">
      <div className={styles.shell}>
        <p className={styles.operated}>Operated by DANZUS Holdings LLC</p>
        <p>Folsom, California. Contractors, trades, and local services in Sacramento, Folsom, and nearby.</p>
        <ul className={styles.footerLinks}>
          <li>
            <a href={CONTACT_PHONE_TEL} data-track="call_click" data-track-location="footer">
              Call {CONTACT_PHONE_DISPLAY}
            </a>
          </li>
          <li>
            <a href={CONTACT_PHONE_SMS} data-track="text_click" data-track-location="footer">
              Text {CONTACT_PHONE_DISPLAY}
            </a>
          </li>
          <li>
            <a href={mailto}>{CONTACT_EMAIL}</a>
          </li>
          <li>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-track="outbound_click"
              data-track-label="LinkedIn"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <Link href="/privacy">Privacy</Link>
          </li>
          <li>
            <Link href="/terms">Terms</Link>
          </li>
        </ul>
        <p className={styles.smsNote}>
          Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help.
        </p>
        <p className={styles.fine}>© 2026 DANZUS Holdings LLC</p>
      </div>
    </footer>
  )
}
