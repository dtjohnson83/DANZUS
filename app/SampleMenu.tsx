'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { TRADES } from './sample-sites/trades'
import styles from './home.module.css'

function Thumb({ src, color }: { src: string; color: string }) {
  const [hidden, setHidden] = useState(false)
  return (
    <span className={styles.sampleThumb} style={{ background: color }} aria-hidden="true">
      {hidden ? null : <img src={src} alt="" onError={() => setHidden(true)} />}
    </span>
  )
}

export function SampleMenu() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  const onMenuKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const items = [...(wrapRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])]
    const index = items.indexOf(document.activeElement as HTMLAnchorElement)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        window.requestAnimationFrame(() => items[0]?.focus())
        return
      }
      items[(index + 1) % items.length]?.focus()
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) return
      items[(index - 1 + items.length) % items.length]?.focus()
    }
  }

  return (
    <div className={styles.sampleMenu} ref={wrapRef} onKeyDown={onMenuKey}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.sampleButton}
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        Sample sites
        <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      <div className={styles.sampleList} id={listId} role="group" aria-label="Sample sites" hidden={!open}>
        {TRADES.map((trade) => (
          <a
            key={trade.id}
            href={trade.path}
            data-track="sample_open"
            data-track-slug={trade.id}
          >
            <Thumb src={trade.photos.hero} color={trade.accent} />
            <span>
              <strong>{trade.name}</strong>
              <small>{trade.trade}</small>
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

export function SampleMenuGroup({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false)
  const listId = useId()

  return (
    <div className={styles.sampleGroup}>
      <button
        type="button"
        className={styles.sampleGroupButton}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        Sample sites
        <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      <div id={listId} hidden={!open}>
        {TRADES.map((trade) => (
          <a
            key={trade.id}
            href={trade.path}
            data-track="sample_open"
            data-track-slug={trade.id}
            onClick={onNavigate}
          >
            <Thumb src={trade.photos.hero} color={trade.accent} />
            <span>
              <strong>{trade.name}</strong>
              <small>{trade.trade}</small>
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
