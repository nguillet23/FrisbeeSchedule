import { getHourLabels, HOUR_HEIGHT_PX } from './calendarGrid'
import styles from './Calendar.module.css'

export function TimeAxis() {
  return (
    <div className={styles.timeAxis}>
      {getHourLabels().map((label) => (
        <div key={label} className={styles.timeLabel} style={{ height: `${HOUR_HEIGHT_PX}px` }}>
          {label}
        </div>
      ))}
    </div>
  )
}
