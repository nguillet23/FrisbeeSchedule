import { useState } from 'react'
import { AvailabilityModal } from '../components/calendar/AvailabilityModal'
import { EventDetailsModal } from '../components/calendar/EventDetailsModal'
import { WeeklyCalendar } from '../components/calendar/WeeklyCalendar'
import { Navbar } from '../components/layout/Navbar'
import { useAvailability } from '../hooks/useAvailability'
import { useHangoutOverlaps, type HangoutSlot } from '../hooks/useHangoutOverlaps'
import { useSchedule } from '../hooks/useSchedule'
import type { ScheduleEntry } from '../lib/api/schedule'

export function SchedulePage() {
  const scheduleQuery = useSchedule()
  const availabilityQuery = useAvailability()
  const hangouts = useHangoutOverlaps(availabilityQuery.data)

  const [selectedEvent, setSelectedEvent] = useState<ScheduleEntry | null>(null)
  const [selectedHangout, setSelectedHangout] = useState<HangoutSlot | null>(null)

  return (
    <div className="container">
      <Navbar />

      <h1>Weekly Schedule</h1>

      {scheduleQuery.isLoading ? (
        <p>Loading schedule…</p>
      ) : scheduleQuery.isError || !scheduleQuery.data ? (
        <p>Couldn't load the schedule. Try refreshing.</p>
      ) : (
        <WeeklyCalendar
          schedule={scheduleQuery.data}
          hangouts={hangouts}
          onSelectEvent={setSelectedEvent}
          onSelectHangout={setSelectedHangout}
        />
      )}

      <EventDetailsModal entry={selectedEvent} onClose={() => setSelectedEvent(null)} />
      <AvailabilityModal slot={selectedHangout} onClose={() => setSelectedHangout(null)} />
    </div>
  )
}
