import type { NewScheduleEvent } from '../../lib/api/schedule'
import { CATEGORIES } from '../../utils/categories'
import { DAYS, type Day } from '../../utils/days'
import styles from './Admin.module.css'

// The day/category/time/location/what-to-bring fields, shared by the "Add
// Schedule Event" form and each event card's inline edit form.
export function EventFields({
  value,
  onChange,
}: {
  value: NewScheduleEvent
  onChange: (patch: Partial<NewScheduleEvent>) => void
}) {
  return (
    <>
      <div className={styles.formGroup}>
        <label>Day</label>
        <select value={value.day} onChange={(e) => onChange({ day: e.target.value as Day })}>
          {DAYS.map((day) => (
            <option key={day}>{day}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Category</label>
        <select value={value.category} onChange={(e) => onChange({ category: e.target.value })}>
          {CATEGORIES.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Start Time</label>
        <input type="time" value={value.start_time} onChange={(e) => onChange({ start_time: e.target.value })} />
      </div>

      <div className={styles.formGroup}>
        <label>End Time</label>
        <input type="time" value={value.end_time} onChange={(e) => onChange({ end_time: e.target.value })} />
      </div>

      <div className={styles.formGroup}>
        <label>Location</label>
        <input
          type="text"
          className={styles.locationInput}
          value={value.location}
          onChange={(e) => onChange({ location: e.target.value })}
        />
      </div>

      <div className={styles.formGroup}>
        <label>What to Bring</label>
        <input
          type="text"
          className={styles.whatToBringInput}
          placeholder="e.g., Cleats, Water Bottle, Disc"
          value={value.what_to_bring}
          onChange={(e) => onChange({ what_to_bring: e.target.value })}
        />
      </div>
    </>
  )
}
