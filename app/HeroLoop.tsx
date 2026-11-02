'use client'

import { useEffect, useState } from 'react'
import { HERO_LOOP } from './hero-loop'
import styles from './home.module.css'

export function HeroLoop() {
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
    if (reduce || saveData || (!HERO_LOOP.mp4 && !HERO_LOOP.webm)) return
    const frame = window.requestAnimationFrame(() => {
      window.setTimeout(() => setPlay(true), 0)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <div className={styles.heroLoop} aria-hidden="true">
      {play ? (
        <video poster={HERO_LOOP.poster} muted autoPlay loop playsInline preload="none">
          {HERO_LOOP.webm ? <source src={HERO_LOOP.webm} type="video/webm" /> : null}
          {HERO_LOOP.mp4 ? <source src={HERO_LOOP.mp4} type="video/mp4" /> : null}
        </video>
      ) : (
        <img src={HERO_LOOP.poster} alt="" width={640} height={360} />
      )}
    </div>
  )
}
