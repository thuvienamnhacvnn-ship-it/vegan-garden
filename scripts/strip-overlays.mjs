/**
 * Removes every layer that sits on top of photography and dims it: gradient
 * washes, flat colour veils and image opacity. The site shows its food and its
 * room at full brightness; type sits on solid panels instead.
 *
 *   node scripts/strip-overlays.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, files)
    else if (/\.tsx$/.test(entry)) files.push(full)
  }
  return files
}

// Whole JSX elements whose only job is to tint the image underneath.
const OVERLAY_ELEMENT =
  /^[ \t]*<(?:div|span)\b[^>]*className="(?=[^"]*absolute)(?=[^"]*inset-)(?=[^"]*(?:bg-gradient-to|bg-(?:night|ink|charcoal|ember|wood|mocha)\/))[^"]*"[^>]*\/>\r?\n/gm

// The same tint, but on a tag that wraps content (a caption, a button). Those
// cannot be deleted automatically without taking the content with them, so they
// are only reported - move the content onto a solid panel by hand.
const OVERLAY_WRAPPER =
  /^[ \t]*<(?:div|span|figcaption)\b[^>]*className="(?=[^"]*absolute)(?=[^"]*inset-)(?=[^"]*(?:bg-gradient-to|bg-(?:night|ink|charcoal|ember|wood|mocha)\/))[^"]*"[^>]*>(?!\s*<\/)/gm

let changed = 0
const warnings = []

for (const file of walk('src')) {
  const original = readFileSync(file, 'utf8')
  let text = original

  text = text.replace(OVERLAY_ELEMENT, '')
  // photos that were deliberately faded back
  text = text.replace(/\s*opacity-45\b/g, '')

  for (const match of text.matchAll(OVERLAY_WRAPPER)) {
    const line = text.slice(0, match.index).split('\n').length
    warnings.push(`${path.relative('src', file)}:${line}`)
  }

  if (text !== original) {
    writeFileSync(file, text, 'utf8')
    changed += 1
    console.log('stripped', path.relative('src', file))
  }
}

console.log(`${changed} file(s) cleaned`)

if (warnings.length) {
  console.log(`\n${warnings.length} overlay(s) wrap content and need a manual fix:`)
  for (const where of warnings) console.log('  ', where)
}
