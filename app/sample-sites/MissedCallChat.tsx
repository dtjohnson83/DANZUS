'use client'

import { useEffect, useId, useState } from 'react'
import styles from './sample.module.css'

type Message = { side: 'in' | 'out'; text: string }

export function MissedCallChat({
  name,
  messages,
  sms,
  display,
}: {
  name: string
  messages: Message[]
  sms: string
  display: string
}) {
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const panelId = useId()

  useEffect(() => {
    const update = () => {
      const narrow = window.matchMedia('(max-width: 959px)').matches
      setShow(!narrow || window.scrollY > 640 || open)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [open])

  if (!show && !open) return null

  return (
    <div className={styles.chat}>
      <div className={styles.chatPanel} id={panelId} hidden={!open} role="dialog" aria-label={`Sample text with ${name}`}>
        <div className={styles.chatHead}>
          <p>
            Missed-call text
            <small>Sample</small>
          </p>
          <button type="button" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <div className={styles.thread}>
          {messages.map((message) => (
            <p key={message.text} className={message.side === 'in' ? styles.incoming : styles.outgoing}>
              {message.text}
            </p>
          ))}
        </div>
        <a
          className={styles.chatSend}
          href={sms}
          data-track="text_click"
          data-track-location="section"
          data-track-label={`Text ${display}`}
          data-track-section="chat"
        >
          Text {display}
        </a>
      </div>
      <button
        type="button"
        className={styles.chatToggle}
        aria-expanded={open}
        aria-controls={panelId}
        data-track="cta_click"
        data-track-label="Missed our call?"
        data-track-section="chat"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Close' : 'Missed our call?'}
      </button>
    </div>
  )
}
