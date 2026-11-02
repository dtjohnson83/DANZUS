import Link from 'next/link'
import styles from './home.module.css'

/** Shown next to the published business number. */
export function SmsDisclosure() {
  return (
    <p className={styles.smsNote}>
      Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help.{' '}
      <Link href="/privacy">Privacy</Link>
      {' · '}
      <Link href="/terms">SMS terms</Link>
    </p>
  )
}
