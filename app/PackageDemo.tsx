'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import { DEMO_MOBILE_MEDIA, demoAssets, type DemoSlug } from '@/lib/package-demos'
import styles from './home.module.css'

export function PackageDemo({ slug, title }: { slug: DemoSlug; title: string }) {
  const assets = demoAssets(slug)
  const [open, setOpen] = useState(false)
  const [narrow, setNarrow] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const media = window.matchMedia(DEMO_MOBILE_MEDIA)
    const apply = () => setNarrow(media.matches)
    apply()
    media.addEventListener('change', apply)
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button, video, a[href]')].filter(
        (node) => !node.hasAttribute('disabled'),
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      media.removeEventListener('change', apply)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [open])

  return (
    <div className={styles.demo}>
      <button
        ref={openerRef}
        type="button"
        className={styles.demoOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Watch the 75-second demo: ${title}`}
        onClick={() => {
          setNarrow(window.matchMedia(DEMO_MOBILE_MEDIA).matches)
          setOpen(true)
        }}
      >
        <span className={styles.demoPoster}>
          <Image
            src={assets.poster}
            alt=""
            fill
            sizes="(min-width: 980px) 520px, calc(100vw - 40px)"
            className={styles.demoImage}
          />
          <span className={styles.demoShade} />
          <span className={styles.demoChrome}>
            <span className={styles.demoPlay} aria-hidden="true">
              <svg width="16" height="18" viewBox="0 0 18 20" fill="currentColor">
                <path d="M2 1.8c0-1.1 1.2-1.8 2.1-1.2l12.2 7.2c.9.5.9 1.9 0 2.4L4.1 17.4C3.2 18 2 17.3 2 16.2V1.8z" />
              </svg>
            </span>
            <span className={styles.demoLabel}>Watch the 75-second demo</span>
          </span>
        </span>
      </button>
      <noscript>
        <a className={styles.demoFallback} href={assets.landscape}>
          Watch the 75-second demo
        </a>
      </noscript>
      {open ? (
        <div
          className={styles.demoBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
        >
          <div
            ref={dialogRef}
            className={styles.demoDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className={styles.demoDialogBar}>
              <p id={titleId}>{title}</p>
              <button ref={closeRef} type="button" className={styles.demoClose} onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <div className={narrow ? styles.demoFramePortrait : styles.demoFrame}>
              <video
                key={narrow ? assets.portrait : assets.landscape}
                controls
                playsInline
                preload="none"
                poster={assets.poster}
              >
                <source media={DEMO_MOBILE_MEDIA} src={assets.portrait} type="video/mp4" />
                <source src={assets.landscape} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
