// Ported from app.js. `convertTime` pins the locale explicitly (the
// original relied on the runtime's default locale via toLocaleTimeString([]),
// which would format times incorrectly — breaking timeToMinutes' "h:mm AM/PM"
// parsing — on a device set to a non-US locale/region).
export function convertTime(time24h: string): string {
  const [hours, minutes] = time24h.split(':').map(Number)
  const date = new Date()
  date.setHours(hours)
  date.setMinutes(minutes)

  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// Parses the "h:mm AM/PM" strings produced by convertTime/minutesToTime.
export function timeToMinutes(time12h: string): number {
  const [time, period] = time12h.split(' ')
  let [hours, minutes] = time.split(':').map(Number)

  if (period === 'PM' && hours !== 12) {
    hours += 12
  }

  if (period === 'AM' && hours === 12) {
    hours = 0
  }

  return hours * 60 + minutes
}

export function minutesToTime(totalMinutes: number): string {
  let hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const period = hours >= 12 ? 'PM' : 'AM'

  if (hours > 12) {
    hours -= 12
  }

  if (hours === 0) {
    hours = 12
  }

  return `${hours}:${String(minutes).padStart(2, '0')} ${period}`
}

// Direct 24h "HH:MM" -> minutes-since-midnight, no locale round-trip.
// Mathematically identical to convertTime(time) |> timeToMinutes for every
// value in 00:00-23:59 (the original getHangouts() did that round-trip);
// this is what getHangouts()'s port (useHangoutOverlaps) uses instead.
export function parseHHMMToMinutes(time24h: string): number {
  const [hours, minutes] = time24h.split(':').map(Number)
  return hours * 60 + minutes
}
