import { getHourLabels } from './calendarGrid'
import styles from './Calendar.module.css'

export function TimeAxis() {
  return (
    <div className={styles.timeAxis}>
      {getHourLabels().map((label) => (
        <div key={label} className={styles.timeLabel}>
          {label}
        </div>
      ))}
    </div>
  )
}
