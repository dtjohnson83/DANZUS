'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import styles from './home.module.css'

export function SiteHeader({ children, solid = false }: { children: ReactNode; solid?: boolean }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      el.dataset.solid = window.scrollY > 10 ? 'true' : 'false'
      el.style.setProperty('--header-h', `${el.offsetHeight}px`)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', update)
    }
  }, [])

  return (
    <header ref={ref} className={solid ? `${styles.header} ${styles.legalHeader}` : styles.header} data-solid="false">
      {children}
    </header>
  )
}
