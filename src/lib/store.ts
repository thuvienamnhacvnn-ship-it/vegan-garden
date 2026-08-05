import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { NotificationResult } from './whatsapp'

/**
 * Demo persistence for reservations and orders.
 *
 * RESERVATION_STORAGE=file    -> ./data-store/<name>.json (default)
 * RESERVATION_STORAGE=console -> logs only
 *
 * Swap the two functions below for a database when the real system arrives;
 * nothing else in the app touches storage.
 */
const STORE_DIR = path.join(process.cwd(), 'data-store')

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

function fileFor(name: StoreName) {
  return path.join(STORE_DIR, `${name}.json`)
}

export async function readRecords(name: StoreName): Promise<StoredRecord[]> {
  try {
    const raw = await readFile(fileFor(name), 'utf8')
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as StoredRecord[]) : []
  } catch {
    return []
  }
}

export async function appendRecord(name: StoreName, record: StoredRecord) {
  const mode = process.env.RESERVATION_STORAGE ?? 'file'

  if (mode === 'console') {
    console.info(`[${name}]`, JSON.stringify(record))
    return
  }

  try {
    await mkdir(STORE_DIR, { recursive: true })
    const existing = await readRecords(name)
    existing.push(record)
    await writeFile(fileFor(name), JSON.stringify(existing, null, 2), 'utf8')
  } catch (error) {
    // Never fail the guest's request because the demo store is unwritable
    // (read-only filesystems on some hosts).
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
  try {
    const records = await readRecords(name)
    const index = records.findIndex((record) => record.id === id)
    if (index === -1) return null

    records[index] = { ...records[index], ...patch, updatedAt: new Date().toISOString() }
    await mkdir(STORE_DIR, { recursive: true })
    await writeFile(fileFor(name), JSON.stringify(records, null, 2), 'utf8')
    return records[index]
  } catch (error) {
    console.warn(`[${name}] could not update ${id}`, error)
    return null
  }
}
