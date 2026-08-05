import { NextResponse } from 'next/server'
import { createReservationSchema, bookingCode } from '@/lib/validation'
import { appendRecord } from '@/lib/store'
import { serverTranslate, localeFromBody } from '@/lib/serverTranslate'
import { notifyOwner, reservationText } from '@/lib/whatsapp'
import { formatDate } from '@/lib/format'

/**
 * Reservation endpoint. Re-validates everything the client validated - opening
 * hours, booking window and party size included - so the rules cannot be
 * skipped by posting to the API directly. On success the owner is notified over
 * WhatsApp and the delivery result is stored with the booking.
 */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const locale = localeFromBody(body)
  const schema = createReservationSchema(serverTranslate(locale))
  const result = schema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'validation_failed',
        issues: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 422 }
    )
  }

  const code = bookingCode('VG')
  const data = result.data

  const notification = await notifyOwner(
    reservationText({
      code,
      date: formatDate(data.date, 'de'),
      time: data.time,
      guests: data.guests,
      name: data.name,
      phone: data.phone,
      email: data.email,
      allergies: data.allergies || undefined,
      notes: data.notes || undefined,
    })
  )

  await appendRecord('reservations', {
    id: code,
    createdAt: new Date().toISOString(),
    status: 'new',
    locale,
    ...data,
    notification,
  })

  return NextResponse.json({ ok: true, code }, { status: 201 })
}
