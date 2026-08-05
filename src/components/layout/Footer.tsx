'use client'

import Link from 'next/link'
import { ArrowUpRight, MapPin, Phone, Mail } from 'lucide-react'
import { legalNavigation, navigation, site } from '@/data/site'
import { useLocale } from '@/i18n/LocaleProvider'
import { groupedOpeningHours } from '@/lib/hours'
import { Logo } from '@/components/ui/Logo'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { ButtonLink } from '@/components/ui/Button'

/**
 * Three bands, each with one job:
 *   1. a large closing call to action + newsletter
 *   2. four equal information columns
 *   3. a thin legal bar
 *
 * Opening hours are collapsed into day ranges (Mo–Do / Fr–Sa / So) so the
 * column stays the same height as its neighbours instead of running twice as
 * long with seven near-identical rows.
 */
export function Footer() {
  const { t, pick } = useLocale()
  const hours = groupedOpeningHours()
  const year = 2026

  return (
    <footer className="border-t border-line bg-inverse text-ink-inverse-muted">
      {/* ---------------------------------------------------- closing band */}
      <div className="border-b border-line-inverse/15">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20 lg:py-24">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-gold-on-dark">
              {t('reservationCta.eyebrow')}
            </p>
            <h2 className="mt-5 text-[2.6rem] leading-[1.02] text-ink-inverse sm:text-[3.4rem] lg:text-[4.2rem]">
              {t('reservationCta.title')}
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href="/reservation"
                size="lg"
                trailing={<ArrowUpRight className="h-4 w-4" strokeWidth={2} />}
              >
                {t('common.reserveNow')}
              </ButtonLink>
              <ButtonLink href="/order" variant="onDark" size="lg">
                {t('common.orderOnline')}
              </ButtonLink>
            </div>
          </div>

          <div className="lg:pb-2">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-gold-on-dark">
              {t('newsletter.title')}
            </p>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed">{t('newsletter.text')}</p>
            <NewsletterForm className="mt-6" tone="onDark" />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------- information band */}
      <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {/* brand ------------------------------------------------------- */}
        <div>
          <Link href="/" aria-label={t('a11y.logoHome')} className="inline-flex items-center gap-3">
            <Logo variant="mark" alt="" className="h-10 w-auto" />
            <span className="font-display text-lg font-light tracking-[0.18em] text-ink-inverse">
              VEGAN GARDEN
            </span>
          </Link>

          <p className="mt-5 font-script text-2xl leading-snug text-gold-on-dark">
            {pick(site.tagline)}
          </p>

          <SocialLinks className="mt-7" tone="onDark" size="sm" />
        </div>

        {/* navigation --------------------------------------------------- */}
        <nav aria-labelledby="footer-nav">
          <h2
            id="footer-nav"
            className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-on-dark"
          >
            {t('footer.quickLinks')}
          </h2>
          <ul className="mt-6 space-y-3">
            {navigation.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-1.5 text-[0.95rem] transition-colors duration-300 hover:text-ink-inverse"
                >
                  {t(`nav.${item.key}`)}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-60"
                    strokeWidth={2}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* contact ------------------------------------------------------ */}
        <div>
          <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-on-dark">
            {t('footer.contact')}
          </h2>

          <address className="mt-6 space-y-4 not-italic text-[0.95rem]">
            <p className="flex gap-3">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold-on-dark" strokeWidth={1.8} />
              <span>
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </span>
            </p>
            <p className="flex gap-3">
              <Phone className="mt-1 h-4 w-4 shrink-0 text-gold-on-dark" strokeWidth={1.8} />
              <a
                href={`tel:${site.phoneHref}`}
                className="transition-colors duration-300 hover:text-ink-inverse"
              >
                {site.phone}
              </a>
            </p>
            <p className="flex gap-3">
              <Mail className="mt-1 h-4 w-4 shrink-0 text-gold-on-dark" strokeWidth={1.8} />
              <a
                href={`mailto:${site.email}`}
                className="break-words transition-colors duration-300 hover:text-ink-inverse"
              >
                {site.email}
              </a>
            </p>
          </address>
        </div>

        {/* hours -------------------------------------------------------- */}
        <div>
          <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-on-dark">
            {t('common.openingHours')}
          </h2>

          <dl className="mt-6 space-y-4">
            {hours.map((group) => (
              <div key={`${group.opens}-${group.days[0]}`}>
                <dt className="text-[0.78rem] uppercase tracking-[0.14em] text-ink-inverse-muted">
                  {group.days.length > 1
                    ? `${t(`weekdaysShort.${group.days[0]}`)} – ${t(
                        `weekdaysShort.${group.days[group.days.length - 1]}`
                      )}`
                    : t(`weekdays.${group.days[0]}`)}
                </dt>
                <dd className="mt-1 font-display text-2xl tabular-nums text-ink-inverse">
                  {group.opens} – {group.closes}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ------------------------------------------------------ legal bar */}
      <div className="border-t border-line-inverse/15">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-[0.82rem] md:flex-row">
          <p>
            © {year} {site.legalName}. {t('footer.rights')}
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            {legalNavigation.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="transition-colors duration-300 hover:text-ink-inverse"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
