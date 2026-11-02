'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './home.module.css'

const MESSAGES = [
  {
    side: 'in' as const,
    text: 'Sorry I missed you. This is North Side Roofing. What do you need looked at?',
  },
  { side: 'out' as const, text: 'Leak in the kitchen. Can you come Thursday?' },
  {
    side: 'in' as const,
    text: 'Thursday at 10 is open. I will text a reminder Wednesday. What is the street?',
  },
  { side: 'out' as const, text: '412 Oak Street.' },
]

const BUBBLE_GAP_MS = 1250
const TYPING_MS = 650

export function PhoneMockup() {
  const rootRef = useRef<HTMLElement>(null)
  const threadRef = useRef<HTMLDivElement>(null)
  const typingRef = useRef<HTMLDivElement>(null)
  const bubbleRefs = useRef<Array<HTMLDivElement | null>>([])
  const [armed, setArmed] = useState(false)
  const [shown, setShown] = useState<Record<string, boolean>>({})
  const [typingSide, setTypingSide] = useState<'in' | 'out' | null>(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setArmed(true)
  }, [])

  useEffect(() => {
    if (!armed) return
    const root = rootRef.current
    if (!root) return

    let cancelled = false
    const timers: number[] = []
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms))
      })
    const show = (id: string) => {
      if (!cancelled) setShown((current) => ({ ...current, [id]: true }))
    }
    const alignTyping = (index: number) => {
      const bubble = bubbleRefs.current[index]
      const typing = typingRef.current
      if (!bubble || !typing) return
      typing.style.top = `${bubble.offsetTop}px`
      typing.dataset.side = MESSAGES[index].side
    }

    const play = async () => {
      show('when')
      await wait(280)
      for (let index = 0; index < MESSAGES.length; index += 1) {
        if (cancelled) return
        const message = MESSAGES[index]
        if (message.side === 'in') {
          alignTyping(index)
          if (!cancelled) setTypingSide('in')
          await wait(TYPING_MS)
          if (cancelled) return
          setTypingSide(null)
        }
        show(`m${index}`)
        const next = MESSAGES[index + 1]
        if (!next) break
        const typingLead = next.side === 'in' ? TYPING_MS : 0
        await wait(BUBBLE_GAP_MS - typingLead)
      }
      if (cancelled) return
      await wait(1100)
      show('delivered')
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        void play()
      },
      { threshold: 0.25 },
    )
    observer.observe(root)

    return () => {
      cancelled = true
      observer.disconnect()
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [armed])

  const revealed = (id: string) => (shown[id] ? styles.isOn : undefined)

  return (
    <figure ref={rootRef} className={styles.phone} data-armed={armed ? '' : undefined}>
      <div className={styles.stage}>
        <div className={styles.device}>
          <span className={`${styles.side} ${styles.action}`} aria-hidden="true" />
          <span className={`${styles.side} ${styles.vol1}`} aria-hidden="true" />
          <span className={`${styles.side} ${styles.vol2}`} aria-hidden="true" />
          <span className={`${styles.side} ${styles.power}`} aria-hidden="true" />
          <div className={styles.screen} aria-hidden="true">
            <div className={styles.status}>
              <span>2:14</span>
              <span className={styles.island} />
              <span className={styles.statusIcons}>
                <svg width="17" height="12" viewBox="0 0 17 12" fill="#111">
                  <rect x="0" y="8" width="3" height="4" rx="0.5" />
                  <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" />
                  <rect x="9" y="3" width="3" height="9" rx="0.5" />
                  <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
                </svg>
                <svg width="15" height="12" viewBox="0 0 15 12" fill="none" stroke="#111" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M1.2 4.6c3.4-3.2 9.2-3.2 12.6 0" />
                  <path d="M3.4 7c2.2-2 5.9-2 8.2 0" />
                  <path d="M6 9.2c1-0.8 2.1-0.8 3.1 0" />
                </svg>
                <svg width="25" height="12" viewBox="0 0 25 12">
                  <rect x="0.6" y="1" width="20" height="10" rx="2.2" fill="none" stroke="#111" strokeWidth="1.2" />
                  <rect x="2" y="2.4" width="15" height="7.2" rx="1" fill="#111" />
                  <rect x="21.4" y="4" width="1.6" height="4" rx="0.6" fill="#111" />
                </svg>
              </span>
            </div>
            <div className={styles.msgBar}>
              <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="#007AFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2 L2 10 L10 18" />
              </svg>
              <div>
                <div className={styles.avatar}>NS</div>
                <strong>North Side Roofing</strong>
              </div>
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="#007AFF" strokeWidth="1.6">
                <rect x="1" y="2" width="11" height="10" rx="2" />
                <path d="M12 5.5 L17 3 V11 L12 8.5" />
              </svg>
            </div>
            <div ref={threadRef} className={styles.thread}>
              <p className={`${styles.when} ${styles.reveal} ${revealed('when') ?? ''}`}>Today 2:14 PM</p>
              {MESSAGES.map((message, index) => (
                <div
                  key={message.text}
                  ref={(node) => {
                    bubbleRefs.current[index] = node
                  }}
                  className={`${message.side === 'in' ? styles.bubbleIn : styles.bubbleOut} ${styles.reveal} ${revealed(`m${index}`) ?? ''}`}
                >
                  {message.text}
                </div>
              ))}
              <p className={`${styles.delivered} ${styles.reveal} ${revealed('delivered') ?? ''}`}>Delivered</p>
              <div
                ref={typingRef}
                className={`${styles.typing} ${typingSide ? styles.typingOn : ''}`}
                data-side={typingSide ?? 'in'}
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className={styles.composer}>
              <span aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#636366" strokeWidth="1.6">
                  <circle cx="11" cy="11" r="9" />
                  <path d="M11 7 V15 M7 11 H15" />
                </svg>
              </span>
              <i>iMessage</i>
              <span aria-hidden="true">
                <svg width="16" height="22" viewBox="0 0 16 22" fill="none" stroke="#636366" strokeWidth="1.6">
                  <rect x="4" y="1" width="8" height="13" rx="4" />
                  <path d="M2 10 a6 6 0 0 0 12 0" />
                  <path d="M8 16 V20 M5 20 H11" />
                </svg>
              </span>
            </div>
            <div className={styles.homeBar} />
          </div>
        </div>
      </div>
      <figcaption>An example missed-call text-back. Not a real customer.</figcaption>
    </figure>
  )
}
