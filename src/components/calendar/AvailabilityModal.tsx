import { useEffect, useRef } from 'react'
import { useMemberNames } from '../../hooks/useMemberNames'
import type { HangoutSlot } from '../../hooks/useHangoutOverlaps'
import { cx } from '../../utils/cx'
import styles from './Calendar.module.css'

export function AvailabilityModal({
  slot,
  onClose,
}: {
  slot: HangoutSlot | null
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const namesQuery = useMemberNames(slot?.members)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (slot) {
      dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [slot])

  return (
    <dialog ref={dialogRef} className={cx(styles.modal, styles.modalNarrow)} onClose={onClose}>
      <h2>People Available</h2>

      <ul className={styles.memberList}>
        {(namesQuery.data ?? []).map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <button type="button" onClick={() => dialogRef.current?.close()}>
        Close
      </button>
    </dialog>
  )
}
