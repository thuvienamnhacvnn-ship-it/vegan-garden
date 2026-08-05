import { NextResponse } from 'next/server'
import { createOrderSchema, bookingCode } from '@/lib/validation'
import { appendRecord } from '@/lib/store'
import { serverTranslate, localeFromBody } from '@/lib/serverTranslate'
import { notifyOwner, orderText } from '@/lib/whatsapp'
import { formatDate } from '@/lib/format'
import { getDish } from '@/data/menu'
import { site } from '@/data/site'

/**
 * Order endpoint. Prices are recalculated from the menu on the server - the
 * client's totals are never trusted - and the owner is notified over WhatsApp.
 */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const locale = localeFromBody(body)
  const schema = createOrderSchema(serverTranslate(locale))
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

  const data = result.data

  const lines = data.items.map((item) => {
    const dish = getDish(item.dishId)
    if (!dish) return null
    return {
      dishId: dish.id,
      name: dish.nameVi,
      unitPrice: dish.price,
      quantity: item.quantity,
      note: item.note ?? '',
      lineTotal: Math.round(dish.price * item.quantity * 100) / 100,
    }
  })

  if (lines.some((line) => line === null)) {
    return NextResponse.json({ ok: false, error: 'unknown_dish' }, { status: 422 })
  }

  const confirmed = lines as NonNullable<(typeof lines)[number]>[]
  const subtotal = Math.round(confirmed.reduce((sum, line) => sum + line.lineTotal, 0) * 100) / 100

  if (data.method === 'delivery' && subtotal < site.delivery.minimumOrder) {
    return NextResponse.json({ ok: false, error: 'below_minimum' }, { status: 422 })
  }

  const deliveryFee =
    data.method === 'delivery' && subtotal < site.delivery.freeFrom ? site.delivery.fee : 0
  const total = Math.round((subtotal + deliveryFee) * 100) / 100

  const code = bookingCode('VGO')
  const address =
    data.method === 'delivery'
      ? {
          street: data.street,
          postalCode: data.postalCode,
          city: data.city,
          floor: data.floor,
        }
      : null

  const notification = await notifyOwner(
    orderText({
      code,
      method: data.method,
      date: formatDate(data.date, 'de'),
      time: data.time,
      name: data.name,
      phone: data.phone,
      email: data.email,
      address,
      lines: confirmed,
      subtotal,
      deliveryFee,
      total,
      notes: data.notes || undefined,
    })
  )

  await appendRecord('orders', {
    id: code,
    createdAt: new Date().toISOString(),
    status: 'new',
    locale,
    method: data.method,
    date: data.date,
    time: data.time,
    customer: { name: data.name, email: data.email, phone: data.phone },
    address,
    notes: data.notes ?? '',
    lines: confirmed,
    subtotal,
    deliveryFee,
    total,
    // Payment is collected on pickup / delivery in this version. When Stripe or
    // PayPal is added, create the intent here and return its client secret.
    payment: { provider: null, status: 'on_site' },
    notification,
  })

  return NextResponse.json({ ok: true, code, total }, { status: 201 })
}
