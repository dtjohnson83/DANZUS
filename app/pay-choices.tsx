import { Fragment } from 'react'
import styles from './home.module.css'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_SMS, CONTACT_PHONE_TEL } from './site'

const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Free call request')}`

export type CheckoutLink = {
  href: string
  label: string
  tone?: 'ghost'
  /** Shown with this button only, so it is not read as a step that applies to the other choice. */
  detail?: string
}

/** Live Stripe payment links. Each checkout already asks for terms-of-service consent. */
export const CHECKOUT = {
  textBack: {
    href: 'https://buy.stripe.com/28EaEWfuUfvmefRfZe8Ra02',
    label: 'Start the free 30-day pilot',
    detail:
      'Add a card now. You are not charged today. After 30 days it is $99 a month until you cancel.',
  },
  website: {
    href: 'https://buy.stripe.com/00w00i2I81Ewc7J3cs8Ra03',
    label: 'Pay the website deposit',
    detail:
      'The website is $1,500. $750 is due now, and $750 is invoiced at launch. Hosting is $49 a month. The first hosting month is also charged today, so the initial subtotal is $799 before tax.',
  },
  search: {
    href: 'https://buy.stripe.com/3cIcN46Yo1Ew6Np3cs8Ra04',
    label: 'Start Google + AI search',
  },
  growth: {
    href: 'https://buy.stripe.com/9B64gy6Yogzq7RtbIY8Ra05',
    label: 'Start Growth month to month',
    detail: 'Growth is $299 a month, with no new website.',
  },
  growthWebsite: {
    href: 'https://buy.stripe.com/3cIcN4gyY5UMfjV9AQ8Ra06',
    label: 'Start the 6-month plan and pay the website deposit',
    tone: 'ghost',
    detail:
      'The website is $750 with a 6-month commitment. $375 is due now, and $375 is invoiced at launch, plus $299 this month, so the initial subtotal is $674 before tax. If you cancel before month 6, the website is $1,500 and we bill the other $750. After month 6 it continues month to month at $299 until cancelled.',
  },
} as const satisfies Record<string, CheckoutLink>

export type PayGroup = {
  groupId: string
  section: string
  links: readonly CheckoutLink[]
  choice?: boolean
}

export const PAY_GROUPS: readonly PayGroup[] = [
  { groupId: 'textback-services', section: 'packages', links: [CHECKOUT.textBack] },
  { groupId: 'website-services', section: 'packages', links: [CHECKOUT.website] },
  { groupId: 'search-services', section: 'packages', links: [CHECKOUT.search] },
  {
    groupId: 'growth-services',
    section: 'packages',
    links: [CHECKOUT.growth, CHECKOUT.growthWebsite],
    choice: true,
  },
  { groupId: 'textback-pricing', section: 'pricing', links: [CHECKOUT.textBack] },
  { groupId: 'website-pricing', section: 'pricing', links: [CHECKOUT.website] },
  { groupId: 'search-pricing', section: 'pricing', links: [CHECKOUT.search] },
  {
    groupId: 'growth-pricing',
    section: 'pricing',
    links: [CHECKOUT.growth, CHECKOUT.growthWebsite],
    choice: true,
  },
]

export function payGroup(groupId: string): PayGroup {
  const group = PAY_GROUPS.find((item) => item.groupId === groupId)
  if (!group) throw new Error(`Unknown checkout group: ${groupId}`)
  return group
}

function ContactLinks({ section }: { section: string }) {
  return (
    <>
      <a
        className={styles.ghost}
        href={CONTACT_PHONE_TEL}
        data-track="call_click"
        data-track-location={section}
        data-track-label={`Call ${CONTACT_PHONE_DISPLAY}`}
        data-track-section={section}
      >
        Call {CONTACT_PHONE_DISPLAY}
        <span aria-hidden="true">→</span>
      </a>
      <a
        className={styles.ghost}
        href={CONTACT_PHONE_SMS}
        data-track="text_click"
        data-track-location={section}
        data-track-label={`Text ${CONTACT_PHONE_DISPLAY}`}
        data-track-section={section}
      >
        Text {CONTACT_PHONE_DISPLAY}
        <span aria-hidden="true">→</span>
      </a>
      <a
        className={styles.ghost}
        href={mailto}
        data-track="cta_click"
        data-track-label={CONTACT_EMAIL}
        data-track-section={section}
      >
        {CONTACT_EMAIL}
        <span aria-hidden="true">→</span>
      </a>
    </>
  )
}

export function CheckoutGroup({ groupId, section, links, choice = false }: PayGroup) {
  return (
    <div className={styles.pay} data-checkout={groupId}>
      {choice ? <p className={styles.payChoice}>Choose one way to start.</p> : null}
      {links.map((link, index) => (
        <Fragment key={link.href}>
          {choice && index > 0 ? <p className={styles.payOr}>or</p> : null}
          {link.detail ? <p className={styles.payDetail}>{link.detail}</p> : null}
          <a
            className={link.tone === 'ghost' ? styles.ghost : styles.solid}
            href={link.href}
            data-track="cta_click"
            data-track-label={link.label}
            data-track-section={section}
          >
            {link.label}
            <span aria-hidden="true">→</span>
          </a>
        </Fragment>
      ))}
      <ContactLinks section={section} />
    </div>
  )
}

export function HeaderReach() {
  return (
    <div className={styles.headerReach} data-contact="header">
      <a
        href={CONTACT_PHONE_TEL}
        data-track="call_click"
        data-track-location="nav"
        data-track-label={`Call ${CONTACT_PHONE_DISPLAY}`}
        data-track-section="nav"
      >
        Call {CONTACT_PHONE_DISPLAY}
      </a>
      <a
        href={CONTACT_PHONE_SMS}
        data-track="text_click"
        data-track-location="nav"
        data-track-label={`Text ${CONTACT_PHONE_DISPLAY}`}
        data-track-section="nav"
      >
        Text {CONTACT_PHONE_DISPLAY}
      </a>
      <a href={mailto} data-track="cta_click" data-track-label={CONTACT_EMAIL} data-track-section="nav">
        {CONTACT_EMAIL}
      </a>
    </div>
  )
}

export function HeroReach() {
  return (
    <div className={styles.pay} data-contact="hero">
      <ContactLinks section="hero" />
    </div>
  )
}
