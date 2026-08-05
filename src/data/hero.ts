/**
 * Hero imagery. Text for each slide lives in messages/{de,vi}.json under
 * `hero.slides[i]`; only the imagery is configured here.
 *
 * Intrinsic sizes match the files rendered by scripts/extract-images.ps1
 * (2200 px on the long edge) so next/image reserves the right box up front.
 */
export interface HeroSlide {
  id: string
  src: string
  width: number
  height: number
  /** CSS object-position so the subject stays in frame at every aspect ratio. */
  position: string
}

export const heroSlides: HeroSlide[] = [
  {
    // Home banner. Cropped from the largest clean photo region in the mock-ups,
    // so it carries the least upscaling and is the sharpest image on the site.
    id: 'banner',
    src: '/images/hero/hero-banner.jpg',
    width: 2600,
    height: 964,
    position: '58% 50%',
  },
  {
    id: 'dining-room',
    src: '/images/hero/hero-dining-room.jpg',
    width: 2144,
    height: 2200,
    position: '50% 55%',
  },
  {
    id: 'signature-bowl',
    src: '/images/hero/hero-signature-bowl.jpg',
    width: 1378,
    height: 2200,
    position: '62% 65%',
  },
  {
    id: 'garden-window',
    src: '/images/hero/hero-garden-window.jpg',
    width: 2200,
    height: 2158,
    position: '55% 50%',
  },
  {
    id: 'evening-tables',
    src: '/images/hero/hero-evening-tables.jpg',
    width: 2200,
    height: 572,
    position: '50% 50%',
  },
]

export const AUTOPLAY_DELAY_MS = 6000
