import { useState } from 'react'
import type { NewScheduleEvent } from '../../lib/api/schedule'
import type { ScheduleRow } from '../../types/database'
import { EventFields } from './EventFields'
import styles from './Admin.module.css'

// <input type="time"> expects "HH:MM" — Postgres time columns come back as
// "HH:MM:SS" (matches what admin's read-only view already displays as-is).
function toFieldsValue(event: ScheduleRow): NewScheduleEvent {
  return {
    day: event.day as NewScheduleEvent['day'],
    category: event.category,
    start_time: event.start_time.slice(0, 5),
    end_time: event.end_time.slice(0, 5),
    location: event.location,
    what_to_bring: event.what_to_bring ?? '',
  }
}

export function EventCard({
  event,
  onDelete,
  onUpdate,
}: {
  event: ScheduleRow
  onDelete: (id: number) => void
  onUpdate: (id: number, event: NewScheduleEvent) => void | Promise<void>
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<NewScheduleEvent>(() => toFieldsValue(event))

  function handleStartEdit() {
    setDraft(toFieldsValue(event))
    setIsEditing(true)
  }

  function handleCancel() {
    setIsEditing(false)
  }

  async function handleSave() {
    await onUpdate(event.id, draft)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className={styles.eventCard}>
        <EventFields value={draft} onChange={(patch) => setDraft({ ...draft, ...patch })} />

        <div className={styles.editActions}>
          <button type="button" onClick={handleSave}>
            Save
          </button>
          <button type="button" className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.eventCard}>
      <div className={styles.eventHeader}>
        <div className={styles.eventCategory}>{event.category}</div>

        <div className={styles.cardActions}>
          <button
            type="button"
            className={styles.editButton}
            title="Edit event"
            onClick={handleStartEdit}
          >
            Edit
          </button>
          <button
            type="button"
            className={styles.deleteButton}
            title="Delete event"
            onClick={() => onDelete(event.id)}
          >
            ×
          </button>
        </div>
      </div>

      <div className={styles.eventTime}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>
          {event.start_time} – {event.end_time}
        </span>
      </div>

      <div className={styles.eventLocation}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>{event.location}</span>
      </div>

      {event.what_to_bring && (
        <div className={styles.eventBring}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>{event.what_to_bring}</span>
        </div>
      )}
    </div>
  )
}
