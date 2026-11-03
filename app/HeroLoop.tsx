'use client'

import { useEffect, useState } from 'react'
import { HERO_LOOP } from './hero-loop'
import styles from './home.module.css'

type NetworkInfo = { saveData?: boolean; effectiveType?: string }

const DESKTOP = '(min-width: 768px)'

export function HeroLoop() {
  const [wide, setWide] = useState<boolean | null>(null)
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(DESKTOP)
    const apply = () => setWide(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (wide === null) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const connection = (navigator as Navigator & { connection?: NetworkInfo }).connection
    const slow = connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g'
    if (reduce || connection?.saveData || slow) return

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
  }, [wide])

  const loop = wide ? HERO_LOOP.desktop : HERO_LOOP.mobile

  return (
    <div className={styles.heroLoop} aria-hidden="true">
      {play && wide !== null ? (
        <video key={wide ? 'desktop' : 'mobile'} poster={loop.poster} muted autoPlay loop playsInline preload="none">
          <source src={loop.webm} type="video/webm" />
          <source src={loop.mp4} type="video/mp4" />
        </video>
      ) : (
        <picture>
          <source media={DESKTOP} srcSet={HERO_LOOP.desktop.poster} type="image/webp" />
          <source media={DESKTOP} srcSet={HERO_LOOP.desktop.posterJpg} type="image/jpeg" />
          <source srcSet={HERO_LOOP.mobile.poster} type="image/webp" />
          <img
            src={HERO_LOOP.mobile.posterJpg}
            alt=""
            width={720}
            height={1560}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      )}
    </div>
  )
}
