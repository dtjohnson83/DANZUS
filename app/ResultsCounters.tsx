import { RESULTS } from '@/config/results'
import styles from './home.module.css'

export function ResultsCounters() {
  if (RESULTS.length === 0) return null
  return (
    <div className={styles.results}>
      {RESULTS.map((item) => (
        <p key={item.label}>
          <strong>
            {item.value}
            {item.suffix ?? ''}
          </strong>
          <span>{item.label}</span>
        </p>
      ))}
    </div>
  )
}
