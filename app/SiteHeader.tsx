'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import styles from './home.module.css'

export function SiteHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      el.dataset.solid = window.scrollY > 10 ? 'true' : 'false'
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header ref={ref} className={styles.header} data-solid="false">
      {children}
    </header>
  )
}
