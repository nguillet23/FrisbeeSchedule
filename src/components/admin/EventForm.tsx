import { useState, type FormEvent } from 'react'
import type { NewScheduleEvent } from '../../lib/api/schedule'
import { CATEGORIES } from '../../utils/categories'
import { DAYS, type Day } from '../../utils/days'
import styles from './Admin.module.css'

const BLANK_EVENT: NewScheduleEvent = {
  day: 'Monday',
  category: CATEGORIES[0],
  start_time: '',
  end_time: '',
  location: '',
  what_to_bring: '',
}

export function EventForm({ onSubmit }: { onSubmit: (event: NewScheduleEvent) => void | Promise<void> }) {
  const [event, setEvent] = useState<NewScheduleEvent>(BLANK_EVENT)

  async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault()
    await onSubmit(event)
    setEvent(BLANK_EVENT)
  }

  return (
    <div className={styles.surveyContainer}>
      <h2>Add Schedule Event</h2>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Day</label>
          <select value={event.day} onChange={(e) => setEvent({ ...event, day: e.target.value as Day })}>
            {DAYS.map((day) => (
              <option key={day}>{day}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Category</label>
          <select value={event.category} onChange={(e) => setEvent({ ...event, category: e.target.value })}>
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Start Time</label>
          <input
            type="time"
            value={event.start_time}
            onChange={(e) => setEvent({ ...event, start_time: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>End Time</label>
          <input
            type="time"
            value={event.end_time}
            onChange={(e) => setEvent({ ...event, end_time: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Location</label>
          <input
            type="text"
            className={styles.locationInput}
            value={event.location}
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>What to Bring</label>
          <input
            type="text"
            className={styles.whatToBringInput}
            placeholder="e.g., Cleats, Water Bottle, Disc"
            value={event.what_to_bring}
            onChange={(e) => setEvent({ ...event, what_to_bring: e.target.value })}
          />
        </div>

        <button type="submit">Add Event</button>
      </form>
    </div>
  )
}
