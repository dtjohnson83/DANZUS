import { CONTACT_EMAIL, SITE_URL } from '@/app/site'

/** Host env key. Leave it empty until the real street address is set. Never invent one. */
export const BUSINESS_POSTAL_ADDRESS_ENV = 'BUSINESS_POSTAL_ADDRESS'

export function businessPostalAddress(): string {
  return (process.env[BUSINESS_POSTAL_ADDRESS_ENV] ?? '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()
}

/**
 * Footer for email that includes a commercial ask.
 * The street line is omitted when BUSINESS_POSTAL_ADDRESS is unset.
 */
export function commercialEmailFooter(): string {
  const address = businessPostalAddress()
  return [
    '',
    'DANZUS Holdings LLC',
    ...(address ? [address] : []),
    `To stop further email from DANZUS, open ${SITE_URL}/unsubscribe or email ${CONTACT_EMAIL} with the subject Unsubscribe.`,
  ].join('\n')
}
