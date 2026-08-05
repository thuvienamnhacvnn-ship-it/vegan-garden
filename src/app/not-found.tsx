'use client'

import { useT } from '@/i18n/LocaleProvider'
import { ButtonLink } from '@/components/ui/Button'
import { LotusMarkIcon } from '@/components/ui/Icons'

export default function NotFound() {
  const t = useT()

  return (
    <section className="flex min-h-screen items-center justify-center bg-night px-6 py-32 text-center">
      <div className="max-w-lg">
        <LotusMarkIcon className="mx-auto h-14 w-24 text-gold/60" />
        <p className="mt-8 font-display text-7xl text-gold-soft">404</p>
        <h1 className="mt-4 font-display text-3xl text-cream md:text-4xl">
          {t('notFound.title')}
        </h1>
        <p className="mt-4 text-cream-dim/70">{t('notFound.text')}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">{t('common.goHome')}</ButtonLink>
          <ButtonLink href="/menu" variant="secondary">
            {t('common.viewMenu')}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
