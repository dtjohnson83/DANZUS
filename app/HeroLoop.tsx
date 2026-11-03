'use client'

import { useEffect, useState } from 'react'
import { HERO_LOOP } from './hero-loop'
import styles from './home.module.css'

type NetworkInfo = { saveData?: boolean; effectiveType?: string }

export function HeroLoop() {
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const connection = (navigator as Navigator & { connection?: NetworkInfo }).connection
    const slow = connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g'
    if (reduce || connection?.saveData || slow || (!HERO_LOOP.mp4 && !HERO_LOOP.webm)) return

    let cancelled = false
    let timer = 0
    const start = () => {
      timer = window.setTimeout(() => {
        if (!cancelled) setPlay(true)
      }, 2500)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.removeEventListener('load', start)
    }
  }, [])

  return (
    <div className={styles.heroLoop} aria-hidden="true">
      {play ? (
        <video poster={HERO_LOOP.posterJpg} muted autoPlay loop playsInline preload="none">
          {HERO_LOOP.webm ? <source src={HERO_LOOP.webm} type="video/webm" /> : null}
          {HERO_LOOP.mp4 ? <source src={HERO_LOOP.mp4} type="video/mp4" /> : null}
        </video>
      ) : (
        <img src="/hero-still.webp" alt="" width={960} height={540} fetchPriority="high" decoding="async" />
      )}
    </div>
  )
}
