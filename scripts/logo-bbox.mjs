/**
 * Computes the bounding box of the lotus mark inside the supplied brand logo SVG
 * so we can derive a mark-only viewBox without touching a single path point.
 */
import { readFileSync } from 'node:fs'

const svg = readFileSync(process.argv[2], 'utf8')

// The lotus mark is the last <path>, class "st5".
const match = [...svg.matchAll(/<path class="(st\d+)" d="([^"]+)"/g)]
const lotus = match.find((m) => m[1] === 'st5')
if (!lotus) throw new Error('lotus path (st5) not found')

const d = lotus[2]
const tokens = d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []

let i = 0
let cx = 0
let cy = 0
let sx = 0
let sy = 0
let cmd = ''
const bbox = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }

const hit = (x, y) => {
  bbox.minX = Math.min(bbox.minX, x)
  bbox.minY = Math.min(bbox.minY, y)
  bbox.maxX = Math.max(bbox.maxX, x)
  bbox.maxY = Math.max(bbox.maxY, y)
}
const num = () => parseFloat(tokens[i++])

while (i < tokens.length) {
  const t = tokens[i]
  if (/[MmLlHhVvCcSsQqTtAaZz]/.test(t)) {
    cmd = t
    i++
  } else if (cmd === 'M') cmd = 'L'
  else if (cmd === 'm') cmd = 'l'

  const rel = cmd === cmd.toLowerCase()
  const bx = rel ? cx : 0
  const by = rel ? cy : 0

  switch (cmd.toUpperCase()) {
    case 'M': {
      cx = bx + num()
      cy = by + num()
      sx = cx
      sy = cy
      hit(cx, cy)
      break
    }
    case 'L': {
      cx = bx + num()
      cy = by + num()
      hit(cx, cy)
      break
    }
    case 'H': {
      cx = bx + num()
      hit(cx, cy)
      break
    }
    case 'V': {
      cy = by + num()
      hit(cx, cy)
      break
    }
    case 'C': {
      const x1 = bx + num()
      const y1 = by + num()
      const x2 = bx + num()
      const y2 = by + num()
      cx = bx + num()
      cy = by + num()
      // control points bound the curve (superset, never clips the shape)
      hit(x1, y1)
      hit(x2, y2)
      hit(cx, cy)
      break
    }
    case 'S':
    case 'Q': {
      const x1 = bx + num()
      const y1 = by + num()
      cx = bx + num()
      cy = by + num()
      hit(x1, y1)
      hit(cx, cy)
      break
    }
    case 'T': {
      cx = bx + num()
      cy = by + num()
      hit(cx, cy)
      break
    }
    case 'A': {
      num()
      num()
      num()
      num()
      num()
      cx = bx + num()
      cy = by + num()
      hit(cx, cy)
      break
    }
    case 'Z': {
      cx = sx
      cy = sy
      break
    }
    default:
      i++
  }
}

const round = (n) => Math.round(n * 100) / 100
console.log(
  JSON.stringify({
    minX: round(bbox.minX),
    minY: round(bbox.minY),
    maxX: round(bbox.maxX),
    maxY: round(bbox.maxY),
    width: round(bbox.maxX - bbox.minX),
    height: round(bbox.maxY - bbox.minY),
  })
)
