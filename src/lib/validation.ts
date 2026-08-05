import { z } from 'zod'
import { site } from '@/data/site'
import { reservationSlots, orderSlots, hoursForDay } from './hours'
import { toDateInput, addDays } from './format'

export type Translate = (key: string, vars?: Record<string, string | number>) => string

const PHONE = /^[+()\d][\d\s()/.-]{5,24}$/

/**
 * The reservation schema is built from the active translation function so the
 * exact same rules produce German or Vietnamese messages. The server rebuilds
 * it with a neutral translator, which keeps client and API in sync.
 */
export function createReservationSchema(t: Translate) {
  const e = (key: string, vars?: Record<string, string | number>) => t(`reservationPage.errors.${key}`, vars)

  return z
    .object({
      date: z.string().min(1, e('date')),
      time: z.string().min(1, e('time')),
      guests: z.coerce
        .number({ message: e('guests') })
        .int(e('guests'))
        .min(1, e('guests'))
        .max(site.reservation.maxGuests, e('guestsMax', { max: site.reservation.maxGuests })),
      name: z.string().trim().min(2, e('nameShort')).max(80),
      email: z.string().trim().pipe(z.email({ message: e('email') })),
      phone: z.string().trim().regex(PHONE, e('phone')),
      notes: z.string().trim().max(500, e('notesLong')).optional().or(z.literal('')),
      allergies: z.string().trim().max(300, e('notesLong')).optional().or(z.literal('')),
      consent: z.literal(true, { message: e('consent') }),
    })
    .superRefine((value, ctx) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const chosen = new Date(`${value.date}T00:00:00`)

      if (Number.isNaN(chosen.getTime())) {
        ctx.addIssue({ code: 'custom', path: ['date'], message: e('date') })
        return
      }
      if (chosen < today) {
        ctx.addIssue({ code: 'custom', path: ['date'], message: e('datePast') })
        return
      }
      if (chosen > addDays(today, site.reservation.horizonDays)) {
        ctx.addIssue({
          code: 'custom',
          path: ['date'],
          message: e('dateHorizon', { days: site.reservation.horizonDays }),
        })
        return
      }
      if (!hoursForDay(chosen.getDay())) {
        ctx.addIssue({ code: 'custom', path: ['date'], message: e('timeClosed') })
        return
      }

      const slots = reservationSlots(value.date)
      if (!slots.includes(value.time)) {
        // distinguish "outside opening hours" from "slot already gone today"
        const allSlots = reservationSlots(value.date, new Date(`${value.date}T00:00:00`))
        ctx.addIssue({
          code: 'custom',
          path: ['time'],
          message: allSlots.includes(value.time) ? e('timePast') : e('timeClosed'),
        })
      }
    })
}

export type ReservationInput = z.input<ReturnType<typeof createReservationSchema>>
export type ReservationValues = z.output<ReturnType<typeof createReservationSchema>>

/* -------------------------------------------------------------------------- */

export function createOrderSchema(t: Translate) {
  const e = (key: string, vars?: Record<string, string | number>) => t(`orderPage.errors.${key}`, vars)
  const r = (key: string, vars?: Record<string, string | number>) => t(`reservationPage.errors.${key}`, vars)

  return z
    .object({
      method: z.enum(['pickup', 'delivery']),
      date: z.string().min(1, r('date')),
      time: z.string().min(1, r('time')),
      name: z.string().trim().min(2, r('nameShort')).max(80),
      email: z.string().trim().pipe(z.email({ message: r('email') })),
      phone: z.string().trim().regex(PHONE, r('phone')),
      street: z.string().trim().max(120).optional().or(z.literal('')),
      postalCode: z.string().trim().max(10).optional().or(z.literal('')),
      city: z.string().trim().max(80).optional().or(z.literal('')),
      floor: z.string().trim().max(80).optional().or(z.literal('')),
      notes: z.string().trim().max(500, r('notesLong')).optional().or(z.literal('')),
      consent: z.literal(true, { message: r('consent') }),
      items: z
        .array(
          z.object({
            dishId: z.string().min(1),
            quantity: z.number().int().min(1).max(30),
            note: z.string().max(160).optional().or(z.literal('')),
          })
        )
        .min(1, e('empty')),
      subtotal: z.number().nonnegative(),
    })
    .superRefine((value, ctx) => {
      if (value.method === 'delivery') {
        if (!value.street) ctx.addIssue({ code: 'custom', path: ['street'], message: e('street') })
        if (!value.postalCode || !/^\d{5}$/.test(value.postalCode)) {
          ctx.addIssue({ code: 'custom', path: ['postalCode'], message: e('postalCode') })
        }
        if (!value.city) ctx.addIssue({ code: 'custom', path: ['city'], message: e('city') })
        if (value.subtotal < site.delivery.minimumOrder) {
          ctx.addIssue({
            code: 'custom',
            path: ['items'],
            message: e('minimum', {
              amount: `${site.delivery.minimumOrder.toFixed(2)} ${site.currencySymbol}`,
            }),
          })
        }
      }

      if (!orderSlots(value.date).includes(value.time)) {
        ctx.addIssue({ code: 'custom', path: ['time'], message: e('time') })
      }
    })
}

export type OrderValues = z.output<ReturnType<typeof createOrderSchema>>

/* -------------------------------------------------------------------------- */

export const newsletterSchema = z.object({
  email: z.email(),
})

/** Human-readable booking reference, e.g. VG-8F3K-2610. */
export function bookingCode(prefix = 'VG') {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let block = ''
  for (let index = 0; index < 4; index += 1) {
    block += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  const now = new Date()
  const stamp = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}`
  return `${prefix}-${block}-${stamp}`
}

export const todayInput = () => toDateInput(new Date())
