import { EventForm } from '../components/admin/EventForm'
import { EventListByDay } from '../components/admin/EventListByDay'
import styles from '../components/admin/Admin.module.css'
import { Navbar } from '../components/layout/Navbar'
import { useAddScheduleEvent } from '../hooks/useAddScheduleEvent'
import { useDeleteScheduleEvent } from '../hooks/useDeleteScheduleEvent'
import { useScheduleEvents } from '../hooks/useScheduleEvents'
import { useUpdateScheduleEvent } from '../hooks/useUpdateScheduleEvent'
import type { NewScheduleEvent } from '../lib/api/schedule'

export function AdminPage() {
  const eventsQuery = useScheduleEvents()
  const addEvent = useAddScheduleEvent()
  const updateEvent = useUpdateScheduleEvent()
  const deleteEvent = useDeleteScheduleEvent()

  async function handleAddEvent(event: NewScheduleEvent) {
    await addEvent.mutateAsync(event)
    alert('Event added!')
  }

  async function handleUpdateEvent(id: number, event: NewScheduleEvent) {
    await updateEvent.mutateAsync({ id, event })
  }

  function handleDeleteEvent(id: number) {
    deleteEvent.mutate(id)
  }

  return (
    <div className="container">
      <Navbar />

      <h1>Schedule Admin</h1>

      <div className={styles.adminPanel}>
        <EventForm onSubmit={handleAddEvent} />

        <div className={styles.surveyContainer}>
          <h2>Current Events</h2>
          <EventListByDay events={eventsQuery.data ?? []} onDelete={handleDeleteEvent} onUpdate={handleUpdateEvent} />
        </div>
      </div>
    </div>
  )
}
