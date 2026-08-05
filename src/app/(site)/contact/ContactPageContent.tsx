'use client'

import { Info } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'
import { PageHero } from '@/components/sections/PageHero'
import { ContactSection } from '@/components/sections/ContactSection'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { Reveal } from '@/components/ui/Reveal'

export function ContactPageContent() {
  const { t } = useLocale()

  return (
    <>
      <PageHero
        eyebrow={t('contactPage.eyebrow')}
        title={t('contactPage.title')}
        intro={t('contactPage.intro')}
        image="/images/gallery/tea-and-plants.jpg"
        imageAlt={t('storyTeaser.imageAlt')}
        imagePosition="50% 50%"
      />

      <ContactSection />

      <section className="bg-charcoal section-pad">
        <div className="container-luxe grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="font-display text-2xl uppercase tracking-[0.14em] text-gold-soft">
              {t('newsletter.title')}
            </h2>
            <p className="mt-4 max-w-md text-[0.92rem] leading-relaxed text-cream-dim/75">
              {t('newsletter.text')}
            </p>
            <NewsletterForm className="mt-6 max-w-lg" />
          </Reveal>

          <Reveal delay={0.12}>
            <h2 className="font-display text-2xl uppercase tracking-[0.14em] text-gold-soft">
              {t('footer.connect')}
            </h2>
            <p className="mt-4 max-w-md text-[0.92rem] leading-relaxed text-cream-dim/75">
              {t('footer.connectText')}
            </p>
            <SocialLinks className="mt-6" />

            <p className="mt-10 flex gap-3 rounded-sm border border-gold/25 bg-night/40 p-4 text-xs leading-relaxed text-cream-dim/60">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
              {t('contactPage.placeholderNote')}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
