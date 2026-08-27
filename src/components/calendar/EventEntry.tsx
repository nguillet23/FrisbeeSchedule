import type { ScheduleEntry } from '../../lib/api/schedule'
import { CATEGORY_CLASS_KEY } from '../../utils/categories'
import { cx } from '../../utils/cx'
import styles from './Calendar.module.css'
import { getEntryStyle } from './calendarGrid'

export function EventEntry({
  entry,
  onSelect,
}: {
  entry: ScheduleEntry
  onSelect: (entry: ScheduleEntry) => void
}) {
  const categoryKey = CATEGORY_CLASS_KEY[entry.category]

  return (
    <button
      type="button"
      className={cx(styles.entry, categoryKey && styles[categoryKey])}
      style={getEntryStyle(entry.start, entry.end)}
      onClick={() => onSelect(entry)}
    >
      <span className={styles.categoryBadge}>{entry.category}</span>
      <span className={styles.time}>
        {entry.start} - {entry.end}
      </span>
      <span className={styles.location}>{entry.location}</span>
    </button>
  )
}
