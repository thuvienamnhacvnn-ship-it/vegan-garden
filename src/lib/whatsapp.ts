import { site } from '@/data/site'
import { formatPrice } from './format'

/**
 * Owner notifications over WhatsApp.
 *
 * Configured  -> sends through the WhatsApp Cloud API (Meta).
 * Unconfigured -> builds a wa.me link and logs it, so the flow is complete and
 *                 testable in development without a Meta account.
 *
 * Required env for live sending:
 *   WHATSAPP_PHONE_NUMBER_ID   the sender number id from Meta
 *   WHATSAPP_TOKEN             a permanent access token
 *   WHATSAPP_OWNER_NUMBER      the owner's number in international format
 *
 * Note: outside the 24-hour customer-service window the Cloud API only
 * delivers approved template messages. For owner alerts you normally reply
 * once from the business number to open the window, or register a template and
 * set WHATSAPP_TEMPLATE_NAME.
 */

export type NotificationChannel = 'cloud-api' | 'link' | 'disabled'

export interface NotificationResult {
  channel: NotificationChannel
  ok: boolean
  /** wa.me link - always produced, so the owner can be reached manually. */
  link: string
  messageId?: string
  error?: string
  sentAt: string
}

const API_VERSION = 'v21.0'

function ownerNumber() {
  return (process.env.WHATSAPP_OWNER_NUMBER ?? '').replace(/[^\d]/g, '')
}

export function waLink(message: string) {
  const number = ownerNumber()
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

/* -------------------------------------------------------------------------- */
/*  Message composition                                                        */
/* -------------------------------------------------------------------------- */

export interface ReservationMessage {
  code: string
  date: string
  time: string
  guests: number
  name: string
  phone: string
  email: string
  allergies?: string
  notes?: string
}

export function reservationText(data: ReservationMessage) {
  const lines = [
    `*${site.name}* – Neue Tischreservierung`,
    '',
    `Code: *${data.code}*`,
    `Datum: ${data.date} um ${data.time}`,
    `Gäste: ${data.guests}`,
    '',
    `Name: ${data.name}`,
    `Telefon: ${data.phone}`,
    `E-Mail: ${data.email}`,
  ]

  if (data.allergies) lines.push(`Allergien: ${data.allergies}`)
  if (data.notes) lines.push(`Wunsch: ${data.notes}`)

  return lines.join('\n')
}

export interface OrderMessage {
  code: string
  method: 'pickup' | 'delivery'
  date: string
  time: string
  name: string
  phone: string
  email: string
  address?: { street?: string; postalCode?: string; city?: string; floor?: string } | null
  lines: { name: string; quantity: number; lineTotal: number; note?: string }[]
  subtotal: number
  deliveryFee: number
  total: number
  notes?: string
}

export function orderText(data: OrderMessage) {
  const money = (value: number) => formatPrice(value, 'de')

  const lines = [
    `*${site.name}* – Neue Bestellung`,
    '',
    `Code: *${data.code}*`,
    `Art: ${data.method === 'pickup' ? 'Abholung' : 'Lieferung'}`,
    `Zeit: ${data.date} um ${data.time}`,
    '',
    '*Bestellung*',
    ...data.lines.map(
      (line) =>
        `• ${line.quantity}× ${line.name} — ${money(line.lineTotal)}${
          line.note ? `\n   (${line.note})` : ''
        }`
    ),
    '',
    `Zwischensumme: ${money(data.subtotal)}`,
  ]

  if (data.deliveryFee > 0) lines.push(`Liefergebühr: ${money(data.deliveryFee)}`)
  lines.push(`*Gesamt: ${money(data.total)}*`, '', '*Kunde*', `Name: ${data.name}`)
  lines.push(`Telefon: ${data.phone}`, `E-Mail: ${data.email}`)

  if (data.method === 'delivery' && data.address) {
    lines.push(
      '',
      '*Lieferadresse*',
      [data.address.street, data.address.floor].filter(Boolean).join(', '),
      [data.address.postalCode, data.address.city].filter(Boolean).join(' ')
    )
  }

  if (data.notes) lines.push('', `Anmerkung: ${data.notes}`)

  return lines.join('\n')
}

/* -------------------------------------------------------------------------- */
/*  Delivery                                                                   */
/* -------------------------------------------------------------------------- */

export async function notifyOwner(message: string): Promise<NotificationResult> {
  const sentAt = new Date().toISOString()
  const link = waLink(message)

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const token = process.env.WHATSAPP_TOKEN
  const to = ownerNumber()

  if (!to) {
    console.info('[whatsapp] no WHATSAPP_OWNER_NUMBER set - notification skipped')
    return { channel: 'disabled', ok: false, link, sentAt, error: 'no_owner_number' }
  }

  if (!phoneNumberId || !token) {
    // Development / not-yet-connected: the message and a click-to-send link are
    // recorded so the owner can still be reached and the admin can show them.
    console.info(`[whatsapp] cloud API not configured - open to send:\n${link}`)
    return { channel: 'link', ok: true, link, sentAt }
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { preview_url: false, body: message },
        }),
      }
    )

    const payload = (await response.json()) as {
      messages?: { id: string }[]
      error?: { message?: string }
    }

    if (!response.ok) {
      const error = payload.error?.message ?? `http_${response.status}`
      console.warn('[whatsapp] send failed:', error)
      return { channel: 'cloud-api', ok: false, link, sentAt, error }
    }

    return {
      channel: 'cloud-api',
      ok: true,
      link,
      sentAt,
      messageId: payload.messages?.[0]?.id,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error'
    console.warn('[whatsapp] send threw:', message)
    return { channel: 'cloud-api', ok: false, link, sentAt, error: message }
  }
}
