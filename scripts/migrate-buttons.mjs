/**
 * Migrates Button/ButtonLink call sites to the rebuilt API.
 *
 *   variant="gold"|"outline"|"onLight"  ->  "primary"|"secondary"|"onDark"
 *   icon={...}                          ->  trailing={...}
 *   magnetic={false} / magnetic         ->  removed (no longer a prop)
 *
 * Word-boundary safe: only these exact prop spellings are touched.
 *
 *   node scripts/migrate-buttons.mjs
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

let changed = 0

for (const file of walk('src')) {
  if (file.endsWith(path.join('ui', 'Button.tsx'))) continue

  const original = readFileSync(file, 'utf8')
  let text = original

  text = text.replace(/variant="gold"/g, 'variant="primary"')
  text = text.replace(/variant="outline"/g, 'variant="secondary"')
  text = text.replace(/variant="onLight"/g, 'variant="onDark"')
  text = text.replace(/variant="ivory"/g, 'variant="secondary"')

  text = text.replace(/(\s)icon=\{/g, '$1trailing={')

  text = text.replace(/\s*magnetic=\{(?:false|true)\}/g, '')
  text = text.replace(/\n\s*magnetic\n/g, '\n')

  if (text !== original) {
    writeFileSync(file, text, 'utf8')
    changed += 1
    console.log('migrated', path.relative('src', file))
  }
}

console.log(`${changed} file(s) migrated`)
