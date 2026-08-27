import { useState, type FormEvent } from 'react'
import type { NewScheduleEvent } from '../../lib/api/schedule'
import { CATEGORIES } from '../../utils/categories'
import { EventFields } from './EventFields'
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
        <EventFields value={event} onChange={(patch) => setEvent({ ...event, ...patch })} />

        <button type="submit">Add Event</button>
      </form>
    </div>
  )
}
