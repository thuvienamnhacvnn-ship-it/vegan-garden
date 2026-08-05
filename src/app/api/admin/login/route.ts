import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, adminEnabled, passwordMatches, sessionToken } from '@/lib/adminAuth'

export async function POST(request: Request) {
  if (!adminEnabled()) {
    return NextResponse.json({ ok: false, error: 'admin_disabled' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const password =
    body && typeof body === 'object' ? String((body as { password?: string }).password ?? '') : ''

  if (!passwordMatches(password)) {
    // Constant-ish delay so a wrong password is not obviously faster.
    await new Promise((resolve) => setTimeout(resolve, 400))
    return NextResponse.json({ ok: false, error: 'invalid_password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 })
  return response
}
