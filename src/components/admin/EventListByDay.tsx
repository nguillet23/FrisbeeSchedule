import type { NewScheduleEvent } from '../../lib/api/schedule'
import type { ScheduleRow } from '../../types/database'
import { DAYS } from '../../utils/days'
import styles from './Admin.module.css'
import { EventCard } from './EventCard'

export function EventListByDay({
  events,
  onDelete,
  onUpdate,
}: {
  events: ScheduleRow[]
  onDelete: (id: number) => void
  onUpdate: (id: number, event: NewScheduleEvent) => void | Promise<void>
}) {
  if (events.length === 0) {
    return <p className={styles.emptyState}>No events scheduled yet. Add one above!</p>
  }

  return (
    <div className={styles.eventList}>
      {DAYS.map((day) => {
        const dayEvents = events.filter((event) => event.day === day)

        if (dayEvents.length === 0) {
          return null
        }

        return (
          <div key={day} className={styles.daySection}>
            <h3 className={styles.dayHeader}>{day}</h3>
            <div className={styles.dayEvents}>
              {dayEvents.map((event) => (
                <EventCard key={event.id} event={event} onDelete={onDelete} onUpdate={onUpdate} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
