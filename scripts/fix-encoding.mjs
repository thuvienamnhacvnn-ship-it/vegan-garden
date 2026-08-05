/**
 * Repairs UTF-8 text that was round-tripped through Windows-1252 by a careless
 * bulk edit. Reverses the mis-decode and rewrites the file as UTF-8.
 *
 * Files that were never mangled are left alone: pure-ASCII files round-trip
 * unchanged, and genuinely-encoded files decode to invalid UTF-8 (U+FFFD),
 * which is the guard below.
 *
 *   node scripts/fix-encoding.mjs ./src
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

// Windows-1252 code points that are NOT Latin-1, mapped back to their byte.
const CP1252 = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85,
  0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a,
  0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92,
  0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c,
  0x017e: 0x9e, 0x0178: 0x9f,
}

const REPLACEMENT = String.fromCharCode(0xfffd)

function toOriginalBytes(text) {
  const out = []
  for (const ch of text) {
    const cp = ch.codePointAt(0)
    if (cp <= 0xff) out.push(cp)
    else if (CP1252[cp] !== undefined) out.push(CP1252[cp])
    else return null // real character outside CP1252 -> file is fine
  }
  return Buffer.from(out)
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, files)
    else if (/\.(ts|tsx|json|css|md)$/.test(entry)) files.push(full)
  }
  return files
}

const root = process.argv[2] ?? './src'
let fixed = 0

for (const file of walk(root)) {
  // PowerShell's `Set-Content -Encoding utf8` prepends a BOM; drop it here so
  // it neither blocks the conversion nor survives into the repaired file.
  const text = readFileSync(file, 'utf8').replace(/^﻿/, '')

  const bytes = toOriginalBytes(text)
  if (!bytes) continue

  const decoded = bytes.toString('utf8')
  if (decoded.includes(REPLACEMENT) || decoded === text) continue

  writeFileSync(file, decoded, 'utf8')
  console.log('fixed', path.relative(root, file))
  fixed += 1
}

console.log(`${fixed} file(s) repaired`)
