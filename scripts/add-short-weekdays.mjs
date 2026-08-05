/**
 * Short weekday labels, used where a full name would wrap (footer hours).
 *
 *   node scripts/add-short-weekdays.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const labels = {
  'src/messages/de.json': {
    0: 'So',
    1: 'Mo',
    2: 'Di',
    3: 'Mi',
    4: 'Do',
    5: 'Fr',
    6: 'Sa',
  },
  'src/messages/vi.json': {
    0: 'CN',
    1: 'T2',
    2: 'T3',
    3: 'T4',
    4: 'T5',
    5: 'T6',
    6: 'T7',
  },
}

for (const [file, weekdaysShort] of Object.entries(labels)) {
  const json = JSON.parse(readFileSync(file, 'utf8'))
  json.weekdaysShort = weekdaysShort
  writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`, 'utf8')
  console.log('added weekdaysShort to', file)
}
