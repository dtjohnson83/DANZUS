'use client'

import { useEffect, useId, useRef, useState } from 'react'
import styles from './home.module.css'

const LINKS = [
  ['#uses', 'What it does'],
  ['#packages', 'Packages'],
  ['#site', 'Site & search'],
  ['#how', 'How it works'],
  ['#pricing', 'Pricing'],
  ['#faq', 'Questions'],
  ['#about', 'About'],
] as const

export function MobileNav() {
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
    const wide = window.matchMedia('(min-width: 768px)')
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
        {LINKS.map(([href, label]) => (
          <a
            key={href}
            href={href}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
      </nav>
    </>
  )
}
