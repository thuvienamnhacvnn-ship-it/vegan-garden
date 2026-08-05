import { openingHours, site, weekOrder } from '@/data/site'
import { minutesFromTime, timeFromMinutes } from './format'

export function hoursForDay(day: number) {
  return openingHours.find((entry) => entry.day === day) ?? null
}

/** Is the restaurant serving at this exact moment? */
export function isOpenAt(date: Date) {
  const entry = hoursForDay(date.getDay())
  if (!entry) return false
  const now = date.getHours() * 60 + date.getMinutes()
  return now >= minutesFromTime(entry.opens) && now < minutesFromTime(entry.closes)
}

/**
 * Bookable slots for a given date, every 30 minutes, stopping one hour before
 * closing so the kitchen can finish the last seating.
 */
export function reservationSlots(isoDate: string, now = new Date()) {
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return []

  const entry = hoursForDay(date.getDay())
  if (!entry) return []

  const start = minutesFromTime(entry.opens)
  const end = minutesFromTime(entry.closes) - site.reservation.lastSeatingBufferMinutes

  const isToday = date.toDateString() === now.toDateString()
  const earliest = isToday
    ? now.getHours() * 60 + now.getMinutes() + site.delivery.leadTimeMinutes
    : 0

  const slots: string[] = []
  for (let minute = start; minute <= end; minute += 30) {
    if (minute >= earliest) slots.push(timeFromMinutes(minute))
  }
  return slots
}

/** Pickup / delivery slots run right up to closing time. */
export function orderSlots(isoDate: string, now = new Date()) {
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return []

  const entry = hoursForDay(date.getDay())
  if (!entry) return []

  const start = minutesFromTime(entry.opens)
  const end = minutesFromTime(entry.closes) - 15

  const isToday = date.toDateString() === now.toDateString()
  const earliest = isToday
    ? now.getHours() * 60 + now.getMinutes() + site.delivery.leadTimeMinutes
    : 0

  const slots: string[] = []
  for (let minute = start; minute <= end; minute += 15) {
    if (minute >= earliest) slots.push(timeFromMinutes(minute))
  }
  return slots
}

/**
 * Collapses the week into consecutive runs that share the same hours, so the
 * footer shows "Mo – Do 11:30–22:00" instead of seven near-identical rows.
 */
export function groupedOpeningHours() {
  const groups: { days: number[]; opens: string; closes: string }[] = []

  for (const day of weekOrder) {
    const entry = hoursForDay(day)
    if (!entry) continue

    const last = groups[groups.length - 1]
    if (last && last.opens === entry.opens && last.closes === entry.closes) {
      last.days.push(day)
    } else {
      groups.push({ days: [day], opens: entry.opens, closes: entry.closes })
    }
  }

  return groups
}

/** schema.org openingHoursSpecification, grouped by identical time ranges. */
export function openingHoursSpecification() {
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ] as const

  const groups = new Map<string, number[]>()
  for (const entry of openingHours) {
    const key = `${entry.opens}-${entry.closes}`
    groups.set(key, [...(groups.get(key) ?? []), entry.day])
  }

  return [...groups.entries()].map(([key, days]) => {
    const [opens, closes] = key.split('-')
    return {
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: days.map((day) => dayNames[day]),
      opens,
      closes,
    }
  })
}
