/**
 * Renders the PWA icon set from the supplied lotus mark.
 *
 *   node scripts/make-icons.mjs
 *
 * The mark is only ever scaled and centred on the brand's forest green - no
 * path data is touched. The maskable variant sits inside the 80 % safe zone so
 * Android can crop it to a circle or a squircle without clipping a petal.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const MARK = 'public/logo/vegan-garden-mark.svg'
const OUT = 'public/icons'
const BAND = { r: 0x13, g: 0x22, b: 0x13 } // --c-band

const TARGETS = [
  { size: 192, inset: 0.68, file: 'icon-192.png' },
  { size: 512, inset: 0.68, file: 'icon-512.png' },
  // maskable: the mark must survive an aggressive circular crop
  { size: 512, inset: 0.52, file: 'icon-maskable-512.png' },
  { size: 180, inset: 0.7, file: 'apple-touch-icon.png' },
]

mkdirSync(OUT, { recursive: true })

for (const { size, inset, file } of TARGETS) {
  const markSize = Math.round(size * inset)
  const mark = await sharp(MARK, { density: 600 })
    .resize(markSize, markSize, { fit: 'contain', background: { ...BAND, alpha: 0 } })
    .png()
    .toBuffer()

  const offset = Math.round((size - markSize) / 2)
  const out = path.join(OUT, file)

  await sharp({
    create: { width: size, height: size, channels: 4, background: { ...BAND, alpha: 1 } },
  })
    .composite([{ input: mark, top: offset, left: offset }])
    .png()
    .toFile(out)

  console.log(`${file.padEnd(26)} ${size}x${size}`)
}

// A tiny monochrome-friendly favicon for browser tabs.
const favicon = await sharp(MARK, { density: 600 })
  .resize(48, 48, { fit: 'contain', background: { ...BAND, alpha: 1 } })
  .flatten({ background: BAND })
  .png()
  .toBuffer()
writeFileSync(path.join(OUT, 'favicon-48.png'), favicon)
console.log('favicon-48.png              48x48')

console.log(`\nDone - ${TARGETS.length + 1} icons written to ${OUT}/`)
