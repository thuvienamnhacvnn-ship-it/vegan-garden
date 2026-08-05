import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

/**
 * eslint-config-next 16 ships real flat configs, so they are imported directly.
 * Going through `FlatCompat` instead makes eslintrc try to JSON.stringify a
 * config whose plugin objects reference each other, and the whole run dies with
 * "Converting circular structure to JSON" before a single file is linted.
 */
const eslintConfig = [
  { ignores: ['.next/**', 'node_modules/**', 'scripts/**', 'next-env.d.ts'] },
  ...coreWebVitals,
  ...typescript,
]

export default eslintConfig
