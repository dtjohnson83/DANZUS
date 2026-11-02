'use client'

import { useState } from 'react'
import styles from './sample.module.css'

const DAYS = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TIMES = ['9:00', '11:00', '1:00', '3:00']

export function VisitForm() {
  const [sent, setSent] = useState(false)
  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()
        setSent(true)
      }}
    >
      <label>
        Name
        <input name="name" required maxLength={80} />
      </label>
      <label>
        Phone
        <input name="phone" type="tel" required maxLength={30} />
      </label>
      <label>
        What do you need?
        <textarea name="need" rows={3} required maxLength={400} />
      </label>
      <button type="submit">Request a visit</button>
      {sent ? <p className={styles.note}>This is a sample. Nothing was sent.</p> : null}
    </form>
  )
}

export function SchedulePicker() {
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  return (
    <div className={styles.slots}>
      <div className={styles.days}>
        {DAYS.map((item) => (
          <button key={item} type="button" className={day === item ? styles.picked : undefined} onClick={() => setDay(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className={styles.times}>
        {TIMES.map((item) => (
          <button key={item} type="button" className={time === item ? styles.picked : undefined} onClick={() => setTime(item)}>
            {item}
          </button>
        ))}
      </div>
      {day && time ? (
        <p className={styles.note}>
          This is a sample. {day} at {time} is not booked.
        </p>
      ) : (
        <p className={styles.note}>Pick a day and a time. This is a sample. Nothing is booked.</p>
      )}
    </div>
  )
}
