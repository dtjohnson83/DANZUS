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

const INITIAL_MS = 800
const TYPING_MS = 2000
const OUTGOING_AFTER_MS = 1500
const READ_AFTER_OUT_MS = 1000
const DELIVERED_AFTER_MS = 1600

export function PhoneMockup() {
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
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
    const stage = stageRef.current
    if (!stage) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let frame = 0
    const onMove = (event: PointerEvent) => {
      if (window.innerWidth < 980) {
        stage.style.removeProperty('--tilt-y')
        stage.style.removeProperty('--tilt-x')
        return
      }
      const rect = stage.getBoundingClientRect()
      const dx = (event.clientX - (rect.left + rect.width / 2)) / window.innerWidth
      const dy = (event.clientY - (rect.top + rect.height / 2)) / window.innerHeight
      const tiltY = Math.min(-6, Math.max(-18, -12 + dx * -10))
      const tiltX = Math.min(8, Math.max(1, 4 + dy * 6))
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        stage.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`)
        stage.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`)
      })
    }
    const reset = () => {
      stage.style.removeProperty('--tilt-y')
      stage.style.removeProperty('--tilt-x')
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('blur', reset)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('blur', reset)
    }
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
      await wait(INITIAL_MS)
      if (cancelled) return
      show('when')
      for (let index = 0; index < MESSAGES.length; index += 1) {
        if (cancelled) return
        const message = MESSAGES[index]
        if (message.side === 'in') {
          alignTyping(index)
          if (!cancelled) setTypingSide('in')
          await wait(TYPING_MS)
          if (cancelled) return
          setTypingSide(null)
        } else if (index > 0) {
          await wait(OUTGOING_AFTER_MS)
          if (cancelled) return
        }
        show(`m${index}`)
        const next = MESSAGES[index + 1]
        if (next?.side === 'in') {
          await wait(READ_AFTER_OUT_MS)
        }
      }
      if (cancelled) return
      await wait(DELIVERED_AFTER_MS)
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
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.device}>
          <span className={`${styles.side} ${styles.action}`} aria-hidden="true" />
          <span className={`${styles.side} ${styles.vol1}`} aria-hidden="true" />
          <span className={`${styles.side} ${styles.vol2}`} aria-hidden="true" />
          <span className={`${styles.side} ${styles.power}`} aria-hidden="true" />
          <div className={styles.screen} aria-hidden="true">
            <div className={styles.status}>
              <span className={styles.island} />
              <span className={styles.time}>2:14</span>
              <span className={styles.statusIcons}>
                <svg className={styles.cell} viewBox="0 0 17 12" aria-hidden="true">
                  <rect x="0" y="7.6" width="3.1" height="4.4" rx="0.7" />
                  <rect x="4.6" y="5.1" width="3.1" height="6.9" rx="0.7" />
                  <rect x="9.2" y="2.5" width="3.1" height="9.5" rx="0.7" />
                  <rect x="13.8" y="0" width="3.1" height="12" rx="0.7" />
                </svg>
                <svg className={styles.wifi} viewBox="0 0 16 12" aria-hidden="true">
                  <path d="M8 2.05c2.62 0 5 .98 6.78 2.58l-1.42 1.36A7.2 7.2 0 0 0 8 3.95c-1.95 0-3.72.77-5.05 2.04L1.53 4.63A9.45 9.45 0 0 1 8 2.05z" />
                  <path d="M8 5.85c1.52 0 2.9.58 3.95 1.54L10.55 8.7A3.55 3.55 0 0 0 8 7.65c-.98 0-1.87.38-2.52 1.02L4.08 7.39A5.45 5.45 0 0 1 8 5.85z" />
                  <circle cx="8" cy="10.35" r="1.35" />
                </svg>
                <svg className={styles.battery} viewBox="0 0 28 13" aria-hidden="true">
                  <rect x="0.7" y="0.7" width="22.6" height="11.6" rx="3.1" fill="none" stroke="#000" strokeWidth="1.25" />
                  <rect x="2.25" y="2.25" width="17.6" height="8.5" rx="1.45" fill="#000" />
                  <rect x="24.55" y="4.15" width="1.85" height="4.7" rx="0.7" fill="#000" />
                </svg>
              </span>
            </div>
            <div className={styles.msgBar}>
              <div className={styles.back}>
                <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="#007AFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10 2 L2 10 L10 18" />
                </svg>
                <span className={styles.backCount}>3</span>
              </div>
              <div className={styles.who}>
                <div className={styles.avatar}>NS</div>
                <strong>
                  North Side Roofing <span className={styles.nameChevron}>›</span>
                </strong>
              </div>
              <svg className={styles.facetime} width="25" height="16" viewBox="0 0 25 16" fill="none" aria-hidden="true">
                <rect x="0.8" y="2.2" width="15" height="11.6" rx="3" stroke="#007AFF" strokeWidth="1.6" />
                <path d="M16.2 6.2 L23.2 3.4 V12.6 L16.2 9.8" stroke="#007AFF" strokeWidth="1.6" strokeLinejoin="round" />
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
              <span className={styles.plus} aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#8E8E93" strokeWidth="1.6">
                  <circle cx="11" cy="11" r="9.2" />
                  <path d="M11 7.2 V14.8 M7.2 11 H14.8" strokeWidth="1.7" />
                </svg>
              </span>
              <span className={styles.pill}>iMessage</span>
              <span className={styles.mic} aria-hidden="true">
                <svg width="16" height="22" viewBox="0 0 16 22" fill="none" stroke="#8E8E93" strokeWidth="1.6">
                  <rect x="4.2" y="1.2" width="7.6" height="12.2" rx="3.8" />
                  <path d="M2.2 9.6 a5.8 5.8 0 0 0 11.6 0" />
                  <path d="M8 15.6 V19.2 M5.2 19.2 H10.8" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <div className={styles.homeBar} />
            <div className={styles.glare} aria-hidden="true" />
          </div>
        </div>
      </div>
      <figcaption>An example missed-call text-back. Not a real customer.</figcaption>
    </figure>
  )
}
