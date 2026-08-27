import { useEffect, useRef } from 'react'
import type { ScheduleEntry } from '../../lib/api/schedule'
import styles from './Calendar.module.css'

export function EventDetailsModal({
  entry,
  onClose,
}: {
  entry: ScheduleEntry | null
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (entry) {
      dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [entry])

  return (
    <dialog ref={dialogRef} className={styles.modal} onClose={onClose}>
      <h2>Event Details</h2>

      {entry && (
        <>
          <div className={styles.detailItem}>
            <label className={styles.detailLabel}>Day</label>
            <div className={styles.detailValue}>{entry.day}</div>
          </div>

          <div className={styles.detailItem}>
            <label className={styles.detailLabel}>Category</label>
            <div className={styles.detailValue}>{entry.category}</div>
          </div>

          <div className={styles.detailItem}>
            <label className={styles.detailLabel}>Time</label>
            <div className={styles.detailValue}>
              {entry.start} - {entry.end}
            </div>
          </div>

          <div className={styles.detailItem}>
            <label className={styles.detailLabel}>Location</label>
            <div className={styles.detailValue}>{entry.location}</div>
          </div>

          <div className={styles.detailItem}>
            <label className={styles.detailLabel}>What to Bring</label>
            <div className={styles.detailValue}>{entry.what_to_bring}</div>
          </div>
        </>
      )}

      <button type="button" onClick={() => dialogRef.current?.close()}>
        Close
      </button>
    </dialog>
  )
}
