import type { TradeId } from './trades'
import styles from './sample.module.css'

export function TradeArt({ id }: { id: TradeId }) {
  if (id === 'plumber') {
    return (
      <svg className={styles.art} viewBox="0 0 280 220" aria-hidden="true">
        <rect x="18" y="18" width="244" height="184" rx="28" />
        <path d="M70 150 V78 h28 a22 22 0 0 1 22 22 v18 h36 v-28 h22 v50" />
        <circle cx="186" cy="92" r="16" />
        <path d="M186 108 v18" />
      </svg>
    )
  }
  if (id === 'hvac') {
    return (
      <svg className={styles.art} viewBox="0 0 280 220" aria-hidden="true">
        <rect x="18" y="18" width="244" height="184" rx="28" />
        <path d="M70 156 L140 78 L210 156 Z" />
        <rect x="108" y="128" width="64" height="28" rx="4" />
        <path d="M124 142 h8 M140 142 h8 M156 142 h8" />
      </svg>
    )
  }
  if (id === 'auto') {
    return (
      <svg className={styles.art} viewBox="0 0 280 220" aria-hidden="true">
        <rect x="18" y="18" width="244" height="184" rx="28" />
        <path d="M62 140 h156 l-16-36 h-48 l-18-22 H92 L74 104 H62 z" />
        <circle cx="104" cy="146" r="14" />
        <circle cx="184" cy="146" r="14" />
      </svg>
    )
  }
  return (
    <svg className={styles.art} viewBox="0 0 280 220" aria-hidden="true">
      <rect x="18" y="18" width="244" height="184" rx="28" />
      <circle cx="118" cy="112" r="36" />
      <circle cx="118" cy="112" r="18" />
      <path d="M168 78 l28 64 M196 78 l-28 64" />
    </svg>
  )
}
