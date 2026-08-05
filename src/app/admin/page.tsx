import type { Metadata } from 'next'
import { adminEnabled, isAuthenticated } from '@/lib/adminAuth'
import { readRecords, type StoredRecord } from '@/lib/store'
import { AdminLogin } from './AdminLogin'
import { AdminInbox } from './AdminInbox'

export const metadata: Metadata = {
  title: 'Admin – Vegan Garden Berlin',
  robots: { index: false, follow: false },
}

// Always read the current store on request; this page is never cached.
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  if (!adminEnabled()) {
    return (
      <main className="container-page flex min-h-screen items-center justify-center py-24">
        <div className="max-w-md rounded-[var(--radius-lg)] border border-line bg-card p-8 text-center shadow-[var(--shadow-sm)]">
          <h1 className="text-2xl">Admin ist nicht aktiviert</h1>
          <p className="mt-3 text-[0.9rem] text-ink-muted">
            Setze <code className="rounded bg-well px-1.5 py-0.5">ADMIN_PASSWORD</code> in
            <code className="ml-1 rounded bg-well px-1.5 py-0.5">.env.local</code> und starte den
            Server neu.
          </p>
        </div>
      </main>
    )
  }

  if (!(await isAuthenticated())) {
    return <AdminLogin />
  }

  const [reservations, orders] = await Promise.all([
    readRecords('reservations'),
    readRecords('orders'),
  ])

  const newest = (records: StoredRecord[]) =>
    [...records].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))

  return <AdminInbox reservations={newest(reservations)} orders={newest(orders)} />
}
