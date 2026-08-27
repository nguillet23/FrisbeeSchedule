import type { HangoutSlot } from '../../hooks/useHangoutOverlaps'
import { cx } from '../../utils/cx'
import styles from './Calendar.module.css'
import { getEntryStyle } from './calendarGrid'

export function AvailabilityEntry({
  slot,
  onSelect,
}: {
  slot: HangoutSlot
  onSelect: (slot: HangoutSlot) => void
}) {
  return (
    <button
      type="button"
      className={cx(styles.entry, styles.available)}
      style={getEntryStyle(slot.start, slot.end)}
      onClick={() => onSelect(slot)}
    >
      <span className={styles.categoryBadge}>Throws</span>
      <span className={styles.time}>
        {slot.start} - {slot.end}
      </span>
      <span className={styles.location}>{slot.people} available</span>
    </button>
  )
}
