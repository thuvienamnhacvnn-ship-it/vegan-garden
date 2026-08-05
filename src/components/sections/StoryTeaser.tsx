'use client'

import Image from 'next/image'
import { ArrowRight, Quote } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'
import { Rise, Eyebrow } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'

/**
 * Split story block: copy on the milk-coffee surface, the room photograph at
 * full brightness beside it, and the pull quote as its own card underneath the
 * copy rather than laid over the picture.
 */
export function StoryTeaser({ withCta = true }: { withCta?: boolean }) {
  const { t, tx } = useLocale()
  const titleLines = tx<string[]>('storyTeaser.titleLines') ?? []
  const paragraphs = tx<string[]>('storyTeaser.paragraphs') ?? []

  return (
    <section className="grid border-y border-line lg:grid-cols-2">
      <div className="flex items-center bg-surface-2 px-6 py-14 sm:px-10 md:py-20 lg:pl-[max(2rem,calc((100vw-82rem)/2+3rem))] lg:pr-14">
        <div className="max-w-xl">
          <Rise>
            <Eyebrow>{t('storyTeaser.eyebrow')}</Eyebrow>
          </Rise>

          <Rise delay={0.06}>
            <h2 className="mt-4 text-[2rem] leading-[1.06] sm:text-[2.5rem] lg:text-[2.9rem]">
              {titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </Rise>

          <div className="prose-page mt-6 text-[0.95rem] text-ink-muted">
            {paragraphs.map((paragraph, index) => (
              <Rise key={index} delay={0.12 + index * 0.06}>
                <p>{paragraph}</p>
              </Rise>
            ))}
          </div>

          <Rise delay={0.26}>
            <p className="mt-7 font-script text-[1.6rem] leading-tight text-gold">
              {t('storyTeaser.script')}
            </p>
          </Rise>

          <Rise delay={0.32}>
            <blockquote className="mt-7 rounded-[var(--radius-lg)] border border-line bg-card p-6 shadow-[var(--shadow-sm)]">
              <Quote className="h-6 w-6 text-gold" strokeWidth={1.4} />
              <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted">
                {t('storyTeaser.quote')}
              </p>
            </blockquote>
          </Rise>

          {withCta ? (
            <Rise delay={0.38}>
              <ButtonLink
                href="/our-story"
                variant="secondary"
                className="mt-8"
                trailing={<ArrowRight className="h-4 w-4" strokeWidth={1.8} />}
              >
                {t('common.readMore')}
              </ButtonLink>
            </Rise>
          ) : null}
        </div>
      </div>

      <div className="relative min-h-[18rem] lg:min-h-[38rem]">
        <Image
          src="/images/story/story-interior-wide.jpg"
          alt={t('storyTeaser.imageAlt')}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          quality={88}
          className="object-cover"
        />
      </div>
    </section>
  )
}
