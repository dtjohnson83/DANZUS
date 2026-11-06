'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { SampleMenuGroup } from './SampleMenu'
import styles from './home.module.css'

export function MobileNav({ home = '' }: { home?: string }) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const frame = window.requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>('a')?.focus()
    })
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1180px)')
    const close = () => {
      if (wide.matches) setOpen(false)
    }
    wide.addEventListener('change', close)
    return () => wide.removeEventListener('change', close)
  }, [])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        data-track="menu_open"
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.burger} data-open={open ? '' : undefined} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      <nav
        ref={panelRef}
        id={panelId}
        className={open ? `${styles.menuPanel} ${styles.menuPanelOpen}` : styles.menuPanel}
        aria-label="Primary"
        inert={!open}
      >
        <a href={`${home}#services`} data-track="nav_click" data-track-label="Services" data-track-location="mobile" onClick={() => setOpen(false)}>
          Services
        </a>
        <a href={`${home}#pricing`} data-track="nav_click" data-track-label="Pricing" data-track-location="mobile" onClick={() => setOpen(false)}>
          Pricing
        </a>
        <a href="/small-business-ai-help" data-track="nav_click" data-track-label="AI help" data-track-location="mobile" onClick={() => setOpen(false)}>
          AI help
        </a>
        <a href="/ai-search" data-track="nav_click" data-track-label="AI search" data-track-location="mobile" onClick={() => setOpen(false)}>
          AI search
        </a>
        <SampleMenuGroup onNavigate={() => setOpen(false)} />
        <a href={`${home}#about`} data-track="nav_click" data-track-label="About" data-track-location="mobile" onClick={() => setOpen(false)}>
          About
        </a>
      </nav>
    </>
  )
}
