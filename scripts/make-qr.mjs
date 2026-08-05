/**
 * Renders the QR codes used by the "3D food experience" tile and the table
 * cards. Output is plain SVG that inherits the page colours, so it works in
 * both the day and night theme.
 *
 *   node scripts/make-qr.mjs [baseUrl]
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import QRCode from 'qrcode'

const base = (process.argv[2] ?? 'https://www.vegangarden-berlin.de').replace(/\/$/, '')
const out = 'public/qr'
mkdirSync(out, { recursive: true })

const targets = [
  { file: 'menu.svg', url: `${base}/menu` },
  { file: 'order.svg', url: `${base}/order` },
  { file: 'reservation.svg', url: `${base}/reservation` },
]

for (const target of targets) {
  const svg = await QRCode.toString(target.url, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 1,
    color: { dark: '#000000', light: '#00000000' },
  })

  // Strip the fixed fill so the mark takes `currentColor` from the page.
  const themed = svg
    .replace(/fill="#000000"/g, 'fill="currentColor"')
    .replace(/shape-rendering="crispEdges"/, 'shape-rendering="crispEdges" role="img"')

  writeFileSync(path.join(out, target.file), themed, 'utf8')
  console.log('wrote', path.join(out, target.file), '->', target.url)
}
