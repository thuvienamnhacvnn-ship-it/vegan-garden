import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

/**
 * Single-operator gate for /admin.
 *
 * One shared password (ADMIN_PASSWORD) exchanged for an HMAC cookie. This is
 * deliberately simple: it suits one restaurant owner checking their inbox, and
 * it is NOT multi-user auth - there are no accounts, roles or audit trail. Put
 * the site behind HTTPS and use a long password.
 *
 * Env:
 *   ADMIN_PASSWORD    required; the admin area is disabled when unset
 *   ADMIN_SECRET      optional; extra salt for the cookie signature
 */
export const ADMIN_COOKIE = 'vg_admin'

function secret() {
  return process.env.ADMIN_SECRET ?? 'vegan-garden-admin'
}

export function adminEnabled() {
  return Boolean(process.env.ADMIN_PASSWORD)
}

/** The value we expect the cookie to carry for the configured password. */
export function sessionToken() {
  const password = process.env.ADMIN_PASSWORD ?? ''
  return createHmac('sha256', secret()).update(password).digest('hex')
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export function passwordMatches(candidate: string) {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  return safeEqual(candidate, password)
}

export async function isAuthenticated() {
  if (!adminEnabled()) return false
  const store = await cookies()
  const value = store.get(ADMIN_COOKIE)?.value
  if (!value) return false
  return safeEqual(value, sessionToken())
}
