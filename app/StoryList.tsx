'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import styles from './home.module.css'

export function StoryList({ children }: { children: ReactNode }) {
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = Array.from(list.querySelectorAll(':scope > li'))
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add(styles.isOn)
          seen.unobserve(entry.target)
        }
      },
      { threshold: 0.45, rootMargin: '0px 0px -8% 0px' },
    )
    for (const item of items) seen.observe(item)
    list.dataset.ready = 'true'
    return () => seen.disconnect()
  }, [])

  return (
    <ol ref={listRef} className={styles.storyList}>
      {children}
    </ol>
  )
}
