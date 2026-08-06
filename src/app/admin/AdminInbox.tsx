'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CalendarDays,
  Clock,
  Users,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  MessageCircle,
  ExternalLink,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import type { StoredRecord } from '@/lib/store'
import { formatPrice, formatDate, cn } from '@/lib/format'
import { Badge } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'

type Tab = 'reservations' | 'orders'

const RESERVATION_STATUSES = ['new', 'confirmed', 'seated', 'cancelled'] as const
const ORDER_STATUSES = ['new', 'preparing', 'ready', 'completed', 'cancelled'] as const

const STATUS_LABEL: Record<string, string> = {
  new: 'Neu',
  confirmed: 'Bestätigt',
  seated: 'Am Tisch',
  preparing: 'In der Küche',
  ready: 'Fertig',
  completed: 'Abgeschlossen',
  cancelled: 'Storniert',
}

function statusTone(status: string) {
  if (status === 'cancelled') return 'danger' as const
  if (status === 'new') return 'gold' as const
  if (status === 'completed' || status === 'seated' || status === 'ready') return 'success' as const
  return 'neutral' as const
}

interface OrderLine {
  name: string
  quantity: number
  lineTotal: number
  note?: string
}

/**
 * The owner's inbox: every reservation and order with its full detail, the
 * WhatsApp delivery result, and a status control.
 */
export function AdminInbox({
  reservations,
  orders,
  backend,
}: {
  reservations: StoredRecord[]
  orders: StoredRecord[]
  /** Where submissions are actually being written. See the warning below. */
  backend: 'supabase' | 'file' | 'console'
}) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('reservations')
  const [busyId, setBusyId] = useState<string | null>(null)

  const records = tab === 'reservations' ? reservations : orders

  const newCount = useMemo(
    () => ({
      reservations: reservations.filter((r) => (r.status ?? 'new') === 'new').length,
      orders: orders.filter((o) => (o.status ?? 'new') === 'new').length,
    }),
    [reservations, orders]
  )

  async function setStatus(id: string, status: string) {
    setBusyId(id)
    try {
      await fetch('/api/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store: tab, id, status }),
      })
      router.refresh()
    } finally {
      setBusyId(null)
    }
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-surface">
      <header className="border-b border-line bg-card">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3">
            <Logo variant="mark" alt="" className="h-9 w-auto" />
            <div>
              <h1 className="font-display text-xl leading-none text-ink">Admin</h1>
              <p className="mt-1 text-[0.75rem] text-ink-subtle">
                Vegan Garden Berlin
                {backend === 'supabase' ? ' · Datenbank verbunden' : null}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.refresh()}
              leading={<RefreshCw className="h-3.5 w-3.5" strokeWidth={1.8} />}
            >
              Aktualisieren
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              leading={<LogOut className="h-3.5 w-3.5" strokeWidth={1.8} />}
            >
              Abmelden
            </Button>
          </div>
        </div>
      </header>

      <div className="container-page py-8">
        {/* The failure this guards against is a silent one: a booking still
            looks accepted to the guest, but nothing is written and this inbox
            stays empty. Better to say so on every visit than to be trusted
            wrongly. */}
        {backend !== 'supabase' ? (
          <div className="mb-6 flex gap-3 rounded-[var(--radius-md)] border border-danger/40 bg-danger/5 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" strokeWidth={1.8} />
            <div className="text-[0.85rem] leading-relaxed text-ink-muted">
              <p className="font-semibold text-ink">
                {backend === 'console'
                  ? 'Bestellungen werden nicht gespeichert (Konsolen-Modus).'
                  : 'Keine Datenbank verbunden — Bestellungen gehen verloren.'}
              </p>
              <p className="mt-1">
                Reservierungen und Bestellungen werden derzeit nicht dauerhaft
                gespeichert. Auf einem Server ohne beschreibbares Dateisystem bleibt
                dieser Posteingang deshalb leer. <code>SUPABASE_URL</code> und{' '}
                <code>SUPABASE_SERVICE_ROLE_KEY</code> setzen und{' '}
                <code>supabase/schema.sql</code> einmal ausführen.
              </p>
            </div>
          </div>
        ) : null}

        {/* tabs -------------------------------------------------------- */}
        <div role="tablist" className="flex gap-2">
          {(['reservations', 'orders'] as const).map((key) => {
            const active = tab === key
            const count = newCount[key]
            return (
              <button
                key={key}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(key)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[0.8rem] font-semibold transition-colors duration-300',
                  active
                    ? 'border-gold bg-gold text-gold-ink'
                    : 'border-line text-ink-muted hover:border-gold/60 hover:text-ink'
                )}
              >
                {key === 'reservations' ? (
                  <CalendarDays className="h-4 w-4" strokeWidth={1.8} />
                ) : (
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.8} />
                )}
                {key === 'reservations' ? 'Reservierungen' : 'Bestellungen'}
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[0.7rem]',
                    active ? 'bg-gold-ink/15' : 'bg-well'
                  )}
                >
                  {key === 'reservations' ? reservations.length : orders.length}
                </span>
                {count > 0 ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-danger" title={`${count} neu`} />
                ) : null}
              </button>
            )
          })}
        </div>

        {/* list -------------------------------------------------------- */}
        {records.length === 0 ? (
          <p className="mt-10 rounded-[var(--radius-lg)] border border-dashed border-line p-10 text-center text-ink-muted">
            Noch nichts eingegangen.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {records.map((record) => {
              const status = String(record.status ?? 'new')
              const statuses = tab === 'reservations' ? RESERVATION_STATUSES : ORDER_STATUSES
              const notification = record.notification as
                | { channel: string; ok: boolean; link: string; error?: string }
                | undefined

              return (
                <li
                  key={record.id}
                  className="rounded-[var(--radius-lg)] border border-line bg-card p-5 shadow-[var(--shadow-sm)] sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-display text-xl text-ink">{record.id}</span>
                        <Badge tone={statusTone(status)}>{STATUS_LABEL[status] ?? status}</Badge>
                      </div>
                      <p className="mt-1 text-[0.78rem] text-ink-subtle">
                        Eingegangen{' '}
                        {new Date(String(record.createdAt)).toLocaleString('de-DE', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>

                    {tab === 'orders' ? (
                      <span className="font-display text-2xl text-ink tabular-nums">
                        {formatPrice(Number(record.total ?? 0), 'de')}
                      </span>
                    ) : null}
                  </div>

                  {/* detail --------------------------------------------- */}
                  {tab === 'reservations' ? (
                    <ReservationDetail record={record} />
                  ) : (
                    <OrderDetail record={record} />
                  )}

                  {/* whatsapp ------------------------------------------- */}
                  {notification ? (
                    <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[var(--radius-sm)] border border-line bg-well px-4 py-3">
                      {notification.ok ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" strokeWidth={1.8} />
                      ) : (
                        <AlertTriangle className="h-4 w-4 shrink-0 text-danger" strokeWidth={1.8} />
                      )}
                      <span className="text-[0.8rem] text-ink-muted">
                        WhatsApp:{' '}
                        {notification.channel === 'cloud-api'
                          ? notification.ok
                            ? 'gesendet'
                            : `Fehler – ${notification.error ?? 'unbekannt'}`
                          : notification.channel === 'link'
                            ? 'nicht verbunden – manuell senden'
                            : 'deaktiviert'}
                      </span>
                      {notification.link ? (
                        <a
                          href={notification.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-gold transition-colors hover:text-gold-hover"
                        >
                          <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
                          In WhatsApp öffnen
                          <ExternalLink className="h-3 w-3" strokeWidth={1.8} />
                        </a>
                      ) : null}
                    </div>
                  ) : null}

                  {/* status control ------------------------------------- */}
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                    <span className="mr-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                      Status
                    </span>
                    {statuses.map((option) => (
                      <button
                        key={option}
                        type="button"
                        disabled={busyId === record.id || option === status}
                        onClick={() => setStatus(String(record.id), option)}
                        className={cn(
                          'rounded-full border px-3.5 py-1.5 text-[0.75rem] font-medium transition-colors duration-300',
                          option === status
                            ? 'border-gold bg-gold text-gold-ink'
                            : 'border-line text-ink-muted hover:border-gold/60 hover:text-ink',
                          busyId === record.id && 'opacity-50'
                        )}
                      >
                        {STATUS_LABEL[option]}
                      </button>
                    ))}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}

/* -------------------------------------------------------------------------- */

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2.5 text-[0.86rem] text-ink-muted">
      <span className="mt-0.5 shrink-0 text-gold">{icon}</span>
      {children}
    </p>
  )
}

function ReservationDetail({ record }: { record: StoredRecord }) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <Row icon={<CalendarDays className="h-4 w-4" strokeWidth={1.8} />}>
        {formatDate(String(record.date), 'de')}
      </Row>
      <Row icon={<Clock className="h-4 w-4" strokeWidth={1.8} />}>
        {String(record.time)} Uhr
      </Row>
      <Row icon={<Users className="h-4 w-4" strokeWidth={1.8} />}>
        {String(record.guests)} Gäste · {String(record.name)}
      </Row>
      <Row icon={<Phone className="h-4 w-4" strokeWidth={1.8} />}>
        <a href={`tel:${record.phone}`} className="hover:text-gold">
          {String(record.phone)}
        </a>
      </Row>
      <Row icon={<Mail className="h-4 w-4" strokeWidth={1.8} />}>
        <a href={`mailto:${record.email}`} className="break-all hover:text-gold">
          {String(record.email)}
        </a>
      </Row>
      {record.allergies ? (
        <Row icon={<AlertTriangle className="h-4 w-4" strokeWidth={1.8} />}>
          Allergien: {String(record.allergies)}
        </Row>
      ) : null}
      {record.notes ? (
        <p className="sm:col-span-2 rounded-[var(--radius-sm)] bg-well px-4 py-3 text-[0.85rem] italic text-ink-muted">
          “{String(record.notes)}”
        </p>
      ) : null}
    </div>
  )
}

function OrderDetail({ record }: { record: StoredRecord }) {
  const customer = record.customer as { name: string; email: string; phone: string } | undefined
  const address = record.address as {
    street?: string
    postalCode?: string
    city?: string
    floor?: string
  } | null
  const lines = (record.lines ?? []) as OrderLine[]

  return (
    <div className="mt-4 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Row icon={<ShoppingBag className="h-4 w-4" strokeWidth={1.8} />}>
          {record.method === 'pickup' ? 'Abholung' : 'Lieferung'} ·{' '}
          {formatDate(String(record.date), 'de')} um {String(record.time)}
        </Row>
        {customer ? (
          <>
            <Row icon={<Users className="h-4 w-4" strokeWidth={1.8} />}>{customer.name}</Row>
            <Row icon={<Phone className="h-4 w-4" strokeWidth={1.8} />}>
              <a href={`tel:${customer.phone}`} className="hover:text-gold">
                {customer.phone}
              </a>
            </Row>
            <Row icon={<Mail className="h-4 w-4" strokeWidth={1.8} />}>
              <a href={`mailto:${customer.email}`} className="break-all hover:text-gold">
                {customer.email}
              </a>
            </Row>
          </>
        ) : null}
        {address ? (
          <Row icon={<MapPin className="h-4 w-4" strokeWidth={1.8} />}>
            {[address.street, address.floor].filter(Boolean).join(', ')}
            {', '}
            {[address.postalCode, address.city].filter(Boolean).join(' ')}
          </Row>
        ) : null}
      </div>

      <ul className="divide-y divide-line rounded-[var(--radius-sm)] border border-line">
        {lines.map((line, index) => (
          <li key={index} className="flex items-start justify-between gap-4 px-4 py-2.5">
            <span className="text-[0.88rem] text-ink">
              <span className="font-semibold text-gold">{line.quantity}×</span> {line.name}
              {line.note ? (
                <span className="mt-0.5 block text-[0.76rem] italic text-ink-subtle">
                  {line.note}
                </span>
              ) : null}
            </span>
            <span className="shrink-0 text-[0.88rem] tabular-nums text-ink-muted">
              {formatPrice(line.lineTotal, 'de')}
            </span>
          </li>
        ))}
      </ul>

      {record.notes ? (
        <p className="rounded-[var(--radius-sm)] bg-well px-4 py-3 text-[0.85rem] italic text-ink-muted">
          “{String(record.notes)}”
        </p>
      ) : null}
    </div>
  )
}
