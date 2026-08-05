'use client'

import Image from 'next/image'
import { MapPin, Phone, Mail, Globe, Navigation, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { site } from '@/data/site'
import { useLocale } from '@/i18n/LocaleProvider'
import { Reveal } from '@/components/ui/Reveal'
import { InlineHeading } from '@/components/ui/SectionHeading'
import { ReservationForm } from '@/components/forms/ReservationForm'
import { OpeningHoursTable } from '@/components/ui/OpeningHoursTable'
import { BotanicalCorner, LotusMarkIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/format'

/** Mock-up v5: copy, reservation card, contact + hours, then map / photo band. */
export function ContactSection({ withForm = true }: { withForm?: boolean }) {
  const { t, tx } = useLocale()
  const titleParts = tx<string[]>('contactBlock.titleParts') ?? []
  const paragraphs = tx<string[]>('contactBlock.paragraphs') ?? []

  const actions = [
    {
      id: 'directions',
      label: t('common.directions'),
      href: site.mapsDirectionsUrl,
      Icon: Navigation,
      external: true,
    },
    {
      id: 'call',
      label: t('common.callUs'),
      href: `tel:${site.phoneHref}`,
      Icon: Phone,
      external: true,
    },
    {
      id: 'order',
      label: t('common.orderOnline'),
      href: '/order',
      Icon: ShoppingBag,
      external: false,
    },
  ]

  return (
    <section className="relative overflow-hidden bg-night">
      <BotanicalCorner className="pointer-events-none absolute -left-8 top-10 h-[26rem] w-56 text-gold/12" />
      <BotanicalCorner className="pointer-events-none absolute -right-8 top-20 h-[26rem] w-56 -scale-x-100 text-gold/12" />

      <div className="container-luxe relative grid gap-12 py-16 md:py-24 xl:grid-cols-12 xl:gap-10">
        {/* --------------------------------------------------------- copy */}
        <div className="xl:col-span-3 xl:pt-6">
          <Reveal>
            <span className="eyebrow">{t('contactBlock.eyebrow')}</span>
          </Reveal>

          <Reveal delay={0.08}>
            <InlineHeading
              parts={titleParts}
              highlight={t('contactBlock.highlight')}
              className="mt-6 text-balance font-display !text-[1.85rem] sm:!text-[2.2rem] xl:!text-[2.1rem] 2xl:!text-[2.4rem]"
            />
          </Reveal>

          <Reveal delay={0.14}>
            <LotusMarkIcon className="mt-5 h-6 w-11 text-gold/80" />
          </Reveal>

          <div className="prose-luxe mt-6 max-w-md text-[0.92rem] text-cream-dim/75">
            {paragraphs.map((paragraph, index) => (
              <Reveal key={index} delay={0.18 + index * 0.08}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------- reservation card */}
        {withForm ? (
          <Reveal delay={0.12} direction="up" className="xl:col-span-4">
            <ReservationForm variant="compact" />
          </Reveal>
        ) : null}

        {/* ------------------------------------------- find us + hours */}
        <Reveal
          delay={0.2}
          className={cn('grid gap-10 sm:grid-cols-2 xl:gap-8', withForm ? 'xl:col-span-5' : 'xl:col-span-9')}
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/45 text-gold">
                <MapPin className="h-4 w-4" strokeWidth={1.5} />
              </span>
              <h3 className="font-display text-xl uppercase tracking-[0.14em] text-gold-soft">
                {t('common.findUs')}
              </h3>
            </div>

            <address className="mt-6 space-y-4 not-italic text-sm text-cream-dim/80">
              <p>
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}, {site.address.country}
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                <a href={`tel:${site.phoneHref}`} className="transition-colors hover:text-gold">
                  {site.phone}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                <a
                  href={`mailto:${site.email}`}
                  className="break-words transition-colors hover:text-gold"
                >
                  {site.email}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Globe className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                <span className="break-words">{site.website}</span>
              </p>
            </address>

            <ul className="mt-8 flex flex-wrap gap-6">
              {actions.map(({ id, label, href, Icon, external }) => {
                const inner = (
                  <>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/45 text-gold transition-all duration-500 ease-luxe group-hover:scale-105 group-hover:border-gold group-hover:bg-gold group-hover:text-charcoal">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <span className="mt-2.5 block text-[0.6rem] uppercase tracking-[0.14em] text-gold/85">
                      {label}
                    </span>
                  </>
                )
                return (
                  <li key={id}>
                    {external ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="group flex flex-col items-center text-center"
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link href={href} className="group flex flex-col items-center text-center">
                        {inner}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="sm:border-l sm:border-gold/15 sm:pl-8">
            <h3 className="font-display text-xl uppercase tracking-[0.14em] text-gold-soft">
              {t('common.openingHours')}
            </h3>
            <OpeningHoursTable className="mt-6" />
            <p className="mt-6 font-script text-2xl leading-snug text-gold">
              {t('contactBlock.script')}
            </p>
          </div>
        </Reveal>
      </div>

      {/* ------------------------------------------------- map + photo band */}
      <div className="grid border-t border-gold/25 lg:grid-cols-2">
        <div className="relative h-72 lg:h-[24rem]">
          <iframe
            src={site.mapsEmbedSrc}
            title={t('contactBlock.mapTitle')}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-full w-full border-0 grayscale-[35%] sepia-[15%]"
          />
        </div>
        <div className="relative h-56 lg:h-[24rem]">
          <Image
            src="/images/contact/restaurant-evening.jpg"
            alt={t('storyTeaser.imageAlt')}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
