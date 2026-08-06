import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { NotificationResult } from './whatsapp'

/**
 * Persistence for reservations, orders and newsletter sign-ups.
 *
 * Supabase when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set, which
 * is what production needs: Vercel's filesystem is read-only and thrown away
 * between invocations, so the file store below silently loses every booking
 * there.
 *
 * Without those variables it falls back to `./data-store/<name>.json`, so a
 * checkout still runs end to end locally with no account to create.
 *
 *   RESERVATION_STORAGE=console   -> log only, never write
 *
 * This module is the app's single storage seam - three functions, five call
 * sites. Swapping the backend does not touch a route or a component.
 */
const STORE_DIR = path.join(process.cwd(), 'data-store')
const TABLE = 'submissions'

export type StoreName = 'reservations' | 'orders' | 'newsletter'

export type ReservationStatus = 'new' | 'confirmed' | 'seated' | 'cancelled'
export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled'

export interface StoredRecord {
  id: string
  createdAt: string
  status?: string
  notification?: NotificationResult
  [key: string]: unknown
}

/* -------------------------------------------------------------- Supabase -- */

interface Row {
  store: string
  id: string
  created_at: string
  updated_at: string | null
  status: string
  data: Record<string, unknown>
}

let cached: SupabaseClient | null | undefined

/** The client, or null when the app is not configured for Supabase. */
function db() {
  if (cached !== undefined) return cached

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  cached =
    url && key
      ? createClient(url, key, {
          // A route handler is not a browser: there is no session to persist
          // and no token to refresh.
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : null

  return cached
}

export function storageBackend(): 'supabase' | 'file' | 'console' {
  if (process.env.RESERVATION_STORAGE === 'console') return 'console'
  return db() ? 'supabase' : 'file'
}

/** A row as the rest of the app expects it: one flat record. */
function fromRow(row: Row): StoredRecord {
  return {
    ...row.data,
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    ...(row.updated_at ? { updatedAt: row.updated_at } : {}),
  } as StoredRecord
}

/** The inverse: pull out the typed columns, keep the rest as `data`. */
function toRow(name: StoreName, record: StoredRecord): Row {
  const { id, createdAt, status, updatedAt, ...rest } = record as StoredRecord & {
    updatedAt?: string
  }

  return {
    store: name,
    id,
    created_at: createdAt,
    updated_at: updatedAt ?? null,
    status: status ?? 'new',
    data: rest,
  }
}

/* ------------------------------------------------------------ file store -- */

function fileFor(name: StoreName) {
  return path.join(STORE_DIR, `${name}.json`)
}

async function readFileRecords(name: StoreName): Promise<StoredRecord[]> {
  try {
    const raw = await readFile(fileFor(name), 'utf8')
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as StoredRecord[]) : []
  } catch {
    return []
  }
}

async function writeFileRecords(name: StoreName, records: StoredRecord[]) {
  await mkdir(STORE_DIR, { recursive: true })
  await writeFile(fileFor(name), JSON.stringify(records, null, 2), 'utf8')
}

/* ------------------------------------------------------------------ api -- */

export async function readRecords(name: StoreName): Promise<StoredRecord[]> {
  const client = db()
  if (!client) return readFileRecords(name)

  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .eq('store', name)
    .order('created_at', { ascending: false })
    .limit(1000)

  if (error) {
    console.error(`[${name}] could not read from Supabase`, error.message)
    return []
  }

  return (data as Row[]).map(fromRow)
}

export async function appendRecord(name: StoreName, record: StoredRecord) {
  if (process.env.RESERVATION_STORAGE === 'console') {
    console.info(`[${name}]`, JSON.stringify(record))
    return
  }

  const client = db()

  try {
    if (client) {
      const { error } = await client.from(TABLE).insert(toRow(name, record))
      if (error) throw new Error(error.message)
      return
    }

    const existing = await readFileRecords(name)
    existing.push(record)
    await writeFileRecords(name, existing)
  } catch (error) {
    // Never fail the guest's request because storage is unavailable - the
    // booking still reaches the owner through the WhatsApp notification, and
    // the full record goes to the server log so nothing is lost silently.
    console.warn(`[${name}] could not persist record`, error)
    console.info(`[${name}]`, JSON.stringify(record))
  }
}

/** Updates one record in place. Returns the updated record, or null. */
export async function updateRecord(
  name: StoreName,
  id: string,
  patch: Partial<StoredRecord>
): Promise<StoredRecord | null> {
  const updatedAt = new Date().toISOString()
  const client = db()

  try {
    if (client) {
      const { data: current, error: readError } = await client
        .from(TABLE)
        .select('*')
        .eq('store', name)
        .eq('id', id)
        .maybeSingle()

      if (readError) throw new Error(readError.message)
      if (!current) return null

      const merged = { ...fromRow(current as Row), ...patch, updatedAt }
      const row = toRow(name, merged as StoredRecord)

      const { error: writeError } = await client
        .from(TABLE)
        .update({ status: row.status, data: row.data, updated_at: updatedAt })
        .eq('store', name)
        .eq('id', id)

      if (writeError) throw new Error(writeError.message)
      return merged as StoredRecord
    }

    const records = await readFileRecords(name)
    const index = records.findIndex((record) => record.id === id)
    if (index === -1) return null

    records[index] = { ...records[index], ...patch, updatedAt }
    await writeFileRecords(name, records)
    return records[index]
  } catch (error) {
    console.warn(`[${name}] could not update ${id}`, error)
    return null
  }
}
