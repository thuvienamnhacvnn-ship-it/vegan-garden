/**
 * The button migration renamed every `icon={` to `trailing={`, including the
 * leading-icon prop on the form fields. This puts the field prop back, scoped
 * to the field elements only.
 *
 *   node scripts/fix-field-icon.mjs
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

// Matches a whole <TextField ... /> element, non-greedy up to its self-close.
const FIELD = /<(TextField|SelectField|TextareaField)\b[\s\S]*?(?:\/>|<\/\1>)/g

let changed = 0

for (const file of walk('src')) {
  const original = readFileSync(file, 'utf8')
  const text = original.replace(FIELD, (element) => element.replace(/\btrailing=\{/g, 'icon={'))

  if (text !== original) {
    writeFileSync(file, text, 'utf8')
    changed += 1
    console.log('fixed', path.relative('src', file))
  }
}

console.log(`${changed} file(s) fixed`)
