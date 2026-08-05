/**
 * Remaps colour tokens across src/ when the palette changes.
 * Reads and writes UTF-8 without a BOM so Vietnamese/German text survives.
 *
 *   node scripts/retoken.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

// Ordered: longer / more specific keys first so they win.
const MAP = [
  ['mocha-light', 'ember'],
  ['gold-ink', 'gold'],
  ['ink-soft', '__BODY__'],
  ['cream', 'night'],
  ['latte', 'charcoal'],
  ['sand', 'wood-light'],
  ['espresso', 'night'],
  ['coffee', 'charcoal'],
  ['mocha', 'ember'],
  ['ink', 'cream'],
  ['__BODY__', 'cream-dim'],
  ['card-luxe', 'tile'],
  ['card-dark', 'glass-strong'],
]

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, files)
    else if (/\.(ts|tsx)$/.test(entry)) files.push(full)
  }
  return files
}

const root = path.resolve(process.argv[2] ?? './src')
let changed = 0

for (const file of walk(root)) {
  const original = readFileSync(file, 'utf8')
  let text = original
  for (const [from, to] of MAP) {
    text = text.split(from).join(to)
  }
  if (text !== original) {
    writeFileSync(file, text, { encoding: 'utf8' })
    changed += 1
  }
}

console.log(`${changed} file(s) retokenised`)
