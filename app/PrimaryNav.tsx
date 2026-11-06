import { SampleMenu } from './SampleMenu'
import styles from './home.module.css'

export function PrimaryNav({
  home = '',
  current,
}: {
  home?: string
  current?: 'ai-help' | 'ai-search'
}) {
  return (
    <nav className={styles.deskLinks} aria-label="Primary">
      <a href={`${home}#services`} data-track="nav_click" data-track-label="Services" data-track-location="desktop">
        Services
      </a>
      <a href={`${home}#pricing`} data-track="nav_click" data-track-label="Pricing" data-track-location="desktop">
        Pricing
      </a>
      <a
        href="/small-business-ai-help"
        aria-current={current === 'ai-help' ? 'page' : undefined}
        data-track="nav_click"
        data-track-label="AI help"
        data-track-location="desktop"
      >
        AI help
      </a>
      <a
        href="/ai-search"
        aria-current={current === 'ai-search' ? 'page' : undefined}
        data-track="nav_click"
        data-track-label="AI search"
        data-track-location="desktop"
      >
        AI search
      </a>
      <SampleMenu />
      <a href={`${home}#about`} data-track="nav_click" data-track-label="About" data-track-location="desktop">
        About
      </a>
    </nav>
  )
}
