import type { HangoutSlot } from '../../hooks/useHangoutOverlaps'
import type { ScheduleEntry } from '../../lib/api/schedule'
import { DAYS, type Day } from '../../utils/days'
import styles from './Calendar.module.css'
import { DayColumn } from './DayColumn'
import { TimeAxis } from './TimeAxis'

export function WeeklyCalendar({
  schedule,
  hangouts,
  onSelectEvent,
  onSelectHangout,
}: {
  schedule: Record<Day, ScheduleEntry[]>
  hangouts: HangoutSlot[]
  onSelectEvent: (entry: ScheduleEntry) => void
  onSelectHangout: (slot: HangoutSlot) => void
}) {
  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <div className={styles.timeColumn} />
        {DAYS.map((day) => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.calendarBody}>
        <TimeAxis />

        <div className={styles.calendarGrid}>
          {DAYS.map((day) => (
            <DayColumn
              key={day}
              day={day}
              entries={schedule[day] ?? []}
              hangouts={hangouts.filter((slot) => slot.day === day)}
              onSelectEvent={onSelectEvent}
              onSelectHangout={onSelectHangout}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
