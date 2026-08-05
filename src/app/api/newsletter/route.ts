import { NextResponse } from 'next/server'
import { newsletterSchema } from '@/lib/validation'
import { appendRecord } from '@/lib/store'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const result = newsletterSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 422 })
  }

  await appendRecord('newsletter', {
    id: result.data.email,
    createdAt: new Date().toISOString(),
    email: result.data.email,
    // A real integration would send a double-opt-in confirmation here.
    confirmed: false,
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
