import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/adminAuth'
import { updateRecord, type StoreName } from '@/lib/store'

const ALLOWED: Record<StoreName, string[]> = {
  reservations: ['new', 'confirmed', 'seated', 'cancelled'],
  orders: ['new', 'preparing', 'ready', 'completed', 'cancelled'],
  newsletter: [],
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'unauthorised' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const { store, id, status } = (body ?? {}) as {
    store?: StoreName
    id?: string
    status?: string
  }

  if (!store || !id || !status || !(store in ALLOWED)) {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 })
  }

  if (!ALLOWED[store].includes(status)) {
    return NextResponse.json({ ok: false, error: 'bad_status' }, { status: 400 })
  }

  const updated = await updateRecord(store, id, { status })
  if (!updated) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, record: updated })
}
