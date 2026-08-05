'use client'

import Image from 'next/image'
import { ArrowUpRight, Clock, MapPin, Plus, QrCode } from 'lucide-react'
import { site } from '@/data/site'
import { signatureDishes } from '@/data/menu'
import { brandValues } from '@/data/values'
import { averageRating, reviews } from '@/data/reviews'
import { useLocale } from '@/i18n/LocaleProvider'
import { useCart } from '@/components/cart/CartProvider'
import { formatPrice } from '@/lib/format'
import { groupedOpeningHours } from '@/lib/hours'
import { valueIconMap } from '@/components/ui/Icons'
import { ButtonLink } from '@/components/ui/Button'
import { Tile, TileTitle, TileLabel } from './Tile'

/**
 * The utility half of the home page: everything a guest wants within one
 * screen of each other - order, book, values, the 3D menu, hours and the map.
 * Bigger cells and fewer of them than a typical bento, so nothing feels
 * miniature.
 */
export function BentoBlock() {
  const { t, pick, locale } = useLocale()
  const { add, open } = useCart()
  const hours = groupedOpeningHours()
  const featured = signatureDishes.slice(0, 3)

  return (
    <section className="bg-surface section-tight">
      <div className="container-page grid grid-cols-1 gap-5 md:grid-cols-6 lg:grid-cols-12">
        {/* order ------------------------------------------------------- */}
        <Tile tone="accent" className="md:col-span-3 lg:col-span-5" delay={0}>
          <TileLabel tone="onAccent">{t('orderPage.eyebrow')}</TileLabel>
          <TileTitle tone="onAccent" className="display-md mt-4">
            {t('orderPage.title')}
          </TileTitle>
          <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-gold-ink/85">
            {t('orderPage.intro')}
          </p>
          <ButtonLink
            href="/order"
            variant="onDark"
            size="lg"
            className="mt-auto w-fit border-gold-ink/40 text-gold-ink hover:bg-gold-ink hover:text-gold"
            trailing={<ArrowUpRight className="h-4 w-4" strokeWidth={2} />}
          >
            {t('common.orderOnline')}
          </ButtonLink>
        </Tile>

        {/* quick add --------------------------------------------------- */}
        <Tile className="md:col-span-3 lg:col-span-4" delay={0.05}>
          <div className="flex items-start justify-between gap-4">
            <TileLabel>{t('signature.eyebrow')}</TileLabel>
            <ButtonLink href="/menu" variant="ghost" size="sm">
              {t('common.seeAll')}
            </ButtonLink>
          </div>

          <ul className="mt-5 space-y-3">
            {featured.map((dish) => (
              <li
                key={dish.id}
                className="flex items-center gap-4 rounded-[var(--radius-md)] border border-line p-3 transition-colors duration-300 hover:border-gold/50"
              >
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)]">
                  <Image src={dish.image} alt="" fill sizes="64px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[1.2rem] text-ink">
                    {dish.nameVi}
                  </span>
                  <span className="block truncate text-[0.8rem] text-ink-subtle">
                    {pick(dish.name)}
                  </span>
                </span>
                <span className="shrink-0 text-[0.95rem] tabular-nums text-ink-muted">
                  {formatPrice(dish.price, locale)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    add(dish.id)
                    open()
                  }}
                  aria-label={`${t('common.addToCart')}: ${dish.nameVi}`}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-gold-ink transition-colors duration-300 hover:bg-gold-hover"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.4} />
                </button>
              </li>
            ))}
          </ul>
        </Tile>

        {/* hours ------------------------------------------------------- */}
        <Tile tone="surface" className="md:col-span-6 lg:col-span-3" delay={0.1}>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.8} />
            <TileLabel>{t('common.openingHours')}</TileLabel>
          </div>

          <dl className="mt-6 space-y-5">
            {hours.map((group) => (
              <div key={`${group.opens}-${group.days[0]}`}>
                <dt className="text-[0.76rem] uppercase tracking-[0.14em] text-ink-subtle">
                  {group.days.length > 1
                    ? `${t(`weekdaysShort.${group.days[0]}`)} – ${t(
                        `weekdaysShort.${group.days[group.days.length - 1]}`
                      )}`
                    : t(`weekdays.${group.days[0]}`)}
                </dt>
                <dd className="mt-1 font-display text-3xl tabular-nums text-ink">
                  {group.opens} – {group.closes}
                </dd>
              </div>
            ))}
          </dl>
        </Tile>

        {/* 3D / QR ----------------------------------------------------- */}
        <Tile tone="inverse" className="md:col-span-6 lg:col-span-5" delay={0.15}>
          <TileLabel tone="onDark">{t('experience.eyebrow')}</TileLabel>
          <TileTitle tone="onDark" className="display-md mt-4">
            {t('experience.title')}
          </TileTitle>
          <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed">{t('experience.text')}</p>

          <div className="mt-8 flex flex-wrap items-center gap-7">
            <span className="rounded-[var(--radius-md)] bg-ink-inverse p-4 text-ink">
              <Image
                src="/qr/menu.svg"
                alt={t('experience.qrAlt')}
                width={128}
                height={128}
                className="h-28 w-28"
              />
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-[0.95rem] font-semibold text-ink-inverse">
                <QrCode className="h-4 w-4 shrink-0 text-gold-on-dark" strokeWidth={2} />
                {t('experience.scan')}
              </p>
              <p className="mt-2 max-w-xs text-[0.9rem]">{t('experience.hint')}</p>
            </div>
          </div>
        </Tile>

        {/* values ------------------------------------------------------ */}
        <Tile className="md:col-span-3 lg:col-span-4" delay={0.2}>
          <TileLabel>{t('commitment.title')}</TileLabel>
          <ul className="mt-6 space-y-4">
            {brandValues.map((value, index) => {
              const Icon = valueIconMap[value.icon]
              return (
                <li key={value.id} className="flex items-center gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/45 text-gold">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-[0.98rem] font-medium text-ink">
                    {t(`brandBar.items.${index}.title`)}
                  </span>
                </li>
              )
            })}
          </ul>
        </Tile>

        {/* map --------------------------------------------------------- */}
        <Tile className="md:col-span-3 lg:col-span-3" padded={false} delay={0.25}>
          <div className="p-6">
            <TileLabel>{t('common.findUs')}</TileLabel>
            <p className="mt-4 flex items-start gap-2.5 text-[0.95rem] text-ink-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.8} />
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </p>
          </div>
          <iframe
            src={site.mapsEmbedSrc}
            title={t('contactBlock.mapTitle')}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mt-auto h-52 w-full border-0"
          />
        </Tile>

        {/* reviews ----------------------------------------------------- */}
        <Tile className="md:col-span-6 lg:col-span-12" delay={0.3}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <TileLabel>{t('reviews.eyebrow')}</TileLabel>
              <TileTitle className="display-md mt-3">{t('reviews.title')}</TileTitle>
            </div>
            <p className="text-[0.95rem] text-ink-muted">
              <span className="font-display text-4xl text-gold tabular-nums">{averageRating}</span>
              <span className="ml-2">/ 5 · {reviews.length}</span>
            </p>
          </div>

          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {reviews.slice(0, 3).map((review) => (
              <li key={review.id} className="rounded-[var(--radius-md)] border border-line p-6">
                <p className="text-[0.95rem] leading-relaxed text-ink-muted">{pick(review.text)}</p>
                <p className="mt-5 font-display text-xl text-ink">{review.author}</p>
                <p className="text-[0.8rem] text-ink-subtle">{pick(review.origin)}</p>
              </li>
            ))}
          </ul>
        </Tile>
      </div>
    </section>
  )
}
