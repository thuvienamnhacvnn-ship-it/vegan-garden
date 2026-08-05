import { HeroBig } from '@/components/sections/HeroBig'
import { ValueMarquee } from '@/components/sections/ValueMarquee'
import { StoryTeaser } from '@/components/sections/StoryTeaser'
import { CommitmentBand } from '@/components/sections/CommitmentBand'
import { PinnedDishes } from '@/components/sections/PinnedDishes'
import { GalleryStrip } from '@/components/sections/GalleryStrip'
import { BentoBlock } from '@/components/bento/BentoBlock'
import { QuoteBand } from '@/components/sections/QuoteBand'

/**
 * Reading order, and the movement that carries it. The page alternates between
 * the brand's forest green and the cream reading surface, so the colour itself
 * marks the rhythm:
 *
 *   hero        GREEN  gold type beside the signature bowl
 *   value ticker        a beat between two dense blocks
 *   story               stillness, the room and the origin
 *   commitment  GREEN   the five values, the page's dark centre
 *   dishes              the photograph pins while the list moves past it
 *   the room            a strip that slides sideways as the page goes down
 *   bento               everything actionable, gathered in one grid
 *   quote       GREEN   motto, Hippocrates, and the reservation prompt
 */
export default function HomePage() {
  return (
    <>
      <HeroBig />
      <ValueMarquee />
      <StoryTeaser />
      <CommitmentBand />
      <PinnedDishes />
      <GalleryStrip />
      <BentoBlock />
      <QuoteBand />
    </>
  )
}
