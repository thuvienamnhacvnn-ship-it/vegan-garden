/**
 * Renames the night theme's stored value from "night" to "dark" so it matches
 * the `:root[data-theme='dark']` block in globals.css.
 *
 *   node scripts/rename-theme-value.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const files = [
  'src/components/layout/ThemeProvider.tsx',
  'src/components/layout/ThemeToggle.tsx',
]

for (const file of files) {
  const original = readFileSync(file, 'utf8')
  const text = original.replace(/\bnight\b/g, 'dark').replace(/isNight/g, 'isDark')
  if (text !== original) {
    writeFileSync(file, text, 'utf8')
    console.log('renamed in', file)
  }
}
