/**
 * Points the sub-pages at the rebuilt sections after the retired ones
 * (BrandBar, CommitmentBand, QuoteBand, WhyUs) were removed.
 *
 *   node scripts/rewire-sections.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

function edit(file, fn) {
  const original = readFileSync(file, 'utf8')
  const text = fn(original)
  if (text !== original) {
    writeFileSync(file, text, 'utf8')
    console.log('rewired', file)
  }
}

edit('src/app/gallery/GalleryPageContent.tsx', (t) =>
  t
    .replace(
      "import { BrandBar } from '@/components/sections/BrandBar'",
      "import { ValueStrip } from '@/components/sections/ValueStrip'"
    )
    .replace('<BrandBar />', '<ValueStrip />')
)

edit('src/app/menu/MenuPageContent.tsx', (t) =>
  t
    .replace(/import \{ QuoteBand \} from '@\/components\/sections\/QuoteBand'\r?\n/, '')
    .replace(/[ \t]*<QuoteBand \/>\r?\n/, '')
)

edit('src/app/our-story/StoryPageContent.tsx', (t) =>
  t
    .replace(
      /import \{ CommitmentBand \} from '@\/components\/sections\/CommitmentBand'/,
      "import { ValueStrip } from '@/components/sections/ValueStrip'"
    )
    .replace(/import \{ WhyUs \} from '@\/components\/sections\/WhyUs'\r?\n/, '')
    .replace(/<CommitmentBand \/>/, '<ValueStrip />')
    .replace(/[ \t]*<WhyUs \/>\r?\n/, '')
)
