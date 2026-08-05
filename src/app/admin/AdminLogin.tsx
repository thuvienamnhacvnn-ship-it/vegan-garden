'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'

export function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        setError('Passwort stimmt nicht.')
        setBusy(false)
        return
      }

      router.refresh()
    } catch {
      setError('Anmeldung fehlgeschlagen.')
      setBusy(false)
    }
  }

  return (
    <main className="container-page flex min-h-screen items-center justify-center py-24">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-[var(--radius-lg)] border border-line bg-card p-8 shadow-[var(--shadow-md)]"
      >
        <Logo variant="mark" alt="" className="mx-auto h-12 w-auto" />

        <h1 className="mt-6 text-center text-2xl">Admin</h1>
        <p className="mt-2 text-center text-[0.85rem] text-ink-muted">
          Reservierungen und Bestellungen
        </p>

        <label
          htmlFor="admin-password"
          className="mt-8 block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-muted"
        >
          Passwort
        </label>
        <div className="relative mt-2">
          <Lock
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold"
            strokeWidth={1.7}
          />
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="h-12 w-full rounded-[var(--radius-sm)] border border-line bg-well pl-11 pr-4 text-[0.95rem] text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25"
          />
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-[var(--radius-sm)] border border-danger/40 p-3 text-[0.82rem] text-danger"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={busy} className="mt-6 w-full">
          {busy ? 'Wird geprüft …' : 'Anmelden'}
        </Button>
      </form>
    </main>
  )
}
