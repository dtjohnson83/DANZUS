'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './home.module.css'

export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true)
      return
    }
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setOn(true)
        seen.disconnect()
      },
      { threshold: 0.2 },
    )
    seen.observe(node)
    return () => seen.disconnect()
  }, [])

  return (
    <div ref={ref} className={on ? `${styles.fade} ${styles.fadeOn}` : styles.fade}>
      {children}
    </div>
  )
}
