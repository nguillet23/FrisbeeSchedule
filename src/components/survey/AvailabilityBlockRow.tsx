import { DAYS, type Day } from '../../utils/days'
import styles from './Survey.module.css'

export interface AvailabilityBlockState {
  id: number
  day: Day
  startTime: string
  endTime: string
}

export function AvailabilityBlockRow({
  block,
  onChange,
  onRemove,
}: {
  block: AvailabilityBlockState
  onChange: (patch: Partial<Omit<AvailabilityBlockState, 'id'>>) => void
  onRemove: () => void
}) {
  return (
    <div className={styles.availability}>
      <select value={block.day} onChange={(event) => onChange({ day: event.target.value as Day })}>
        {DAYS.map((day) => (
          <option key={day}>{day}</option>
        ))}
      </select>

      <div className={styles.timeInputGroup}>
        <label>From: (Earliest 10 A.M.)</label>
        <input
          type="time"
          min="10:00"
          max="22:00"
          value={block.startTime}
          onChange={(event) => onChange({ startTime: event.target.value })}
        />
      </div>

      <div className={styles.timeInputGroup}>
        <label>To: (Latest 10 P.M.)</label>
        <input
          type="time"
          min="10:00"
          max="22:00"
          value={block.endTime}
          onChange={(event) => onChange({ endTime: event.target.value })}
        />
      </div>

      <button type="button" className={styles.removeTime} onClick={onRemove}>
        Remove
      </button>
    </div>
  )
}
