/**
 * Keeps the intrinsic sizes recorded in src/data/gallery.ts in step with the
 * files actually produced by scripts/extract-images.ps1. Run it after
 * re-rendering the imagery.
 *
 *   node scripts/sync-image-dims.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'

const file = 'src/data/gallery.ts'
let text = readFileSync(file, 'utf8')

// Pull "src: '/images/...'" + the width/height that follow it.
const pattern = /src: '(\/images\/[^']+\.jpg)',(\s*\n\s*)width: (\d+),(\s*\n\s*)height: (\d+)/g

let updated = 0
text = text.replace(pattern, (match, src, gap1, width, gap2, height) => {
  const file = path.join('public', src)
  let probe
  try {
    probe = execFileSync(
      'ffprobe',
      ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
       '-of', 'csv=s=x:p=0', file],
      { encoding: 'utf8' }
    ).trim()
  } catch {
    return match
  }

  const [w, h] = probe.split('x')
  if (!w || !h) return match
  if (w === width && h === height) return match

  updated += 1
  return `src: '${src}',${gap1}width: ${w},${gap2}height: ${h}`
})

writeFileSync(file, text, 'utf8')
console.log(`${updated} image dimension(s) updated in ${file}`)
