import { useState } from 'react'
import type { HangoutSlot } from '../../hooks/useHangoutOverlaps'
import type { ScheduleEntry } from '../../lib/api/schedule'
import type { Day } from '../../utils/days'
import { cx } from '../../utils/cx'
import { AvailabilityEntry } from './AvailabilityEntry'
import styles from './Calendar.module.css'
import { EventEntry } from './EventEntry'
import { TimeAxis } from './TimeAxis'

export function DayColumn({
  day,
  entries,
  hangouts,
  onSelectEvent,
  onSelectHangout,
}: {
  day: Day
  entries: ScheduleEntry[]
  hangouts: HangoutSlot[]
  onSelectEvent: (entry: ScheduleEntry) => void
  onSelectHangout: (slot: HangoutSlot) => void
}) {
  const [open, setOpen] = useState(false)
  const hasContent = entries.length > 0 || hangouts.length > 0

  return (
    <div className={cx(styles.dayColumnWrapper, open && styles.active)}>
      <div className={styles.accordionHeader} onClick={() => setOpen((current) => !current)}>
        <div className={styles.accordionTitle}>{day}</div>
        <span className={styles.accordionToggle}>{open ? '−' : '+'}</span>
      </div>

      <div className={styles.accordionContent}>
        <TimeAxis />

        <div className={cx(styles.dayColumn, styles.accordionContentDay)}>
          {hasContent ? (
            <div className={styles.timeGrid}>
              {entries.map((entry, index) => (
                <EventEntry key={index} entry={entry} onSelect={onSelectEvent} />
              ))}
              {hangouts.map((slot, index) => (
                <AvailabilityEntry key={index} slot={slot} onSelect={onSelectHangout} />
              ))}
            </div>
          ) : (
            <div className={styles.unavailable}>Unavailable</div>
          )}
        </div>
      </div>
    </div>
  )
}
