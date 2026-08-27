import { DAYS } from '../../utils/days'
import { minutesToTime } from '../../utils/time'
import type { MinuteRange } from '../../utils/mergeAvailability'
import styles from './Survey.module.css'

export function MemberSchedulePreview({
  memberName,
  merged,
}: {
  memberName: string | null
  merged: Record<(typeof DAYS)[number], MinuteRange[]> | null
}) {
  const daysWithSlots = merged ? DAYS.filter((day) => merged[day].length > 0) : []

  return (
    <aside className={styles.schedulePreviewPanel}>
      <h2>Selected Personal Schedule</h2>

      <p className={styles.previewMemberName}>
        {memberName ? `${memberName}'s availability` : 'Choose a member to preview their availability.'}
      </p>

      <div className={styles.memberSchedulePreview}>
        {!merged ? (
          <p className={styles.previewEmpty}>Select a member.</p>
        ) : daysWithSlots.length === 0 ? (
          <p className={styles.previewEmpty}>No availability saved yet.</p>
        ) : (
          daysWithSlots.map((day) => (
            <div key={day} className={styles.previewDayCard}>
              <h3>{day}</h3>
              <ul>
                {merged[day].map((range) => (
                  <li key={`${range.start}-${range.end}`}>
                    {minutesToTime(range.start)} - {minutesToTime(range.end)}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
