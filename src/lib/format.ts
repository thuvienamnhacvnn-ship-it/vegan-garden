import type { Locale } from '@/types'

const priceFormatters: Partial<Record<Locale, Intl.NumberFormat>> = {}

export function formatPrice(value: number, locale: Locale = 'de') {
  const tag = locale === 'vi' ? 'vi-VN' : 'de-DE'
  priceFormatters[locale] ??= new Intl.NumberFormat(tag, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  })
  return priceFormatters[locale]!.format(value)
}

export function formatDate(iso: string, locale: Locale = 'de') {
  const tag = locale === 'vi' ? 'vi-VN' : 'de-DE'
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(tag, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/** YYYY-MM-DD in the visitor's local time (never UTC-shifted). */
export function toDateInput(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function minutesFromTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function timeFromMinutes(total: number) {
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Joins class names, dropping anything falsy that a conditional produced. */
export function cn(...classes: unknown[]) {
  return classes.filter((value): value is string => typeof value === 'string' && value !== '').join(' ')
}
