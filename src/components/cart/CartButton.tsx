'use client'

import { ShoppingBag } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from './CartProvider'
import { useT } from '@/i18n/LocaleProvider'
import { cn } from '@/lib/format'

export function CartButton({
  className,
  tone = 'default',
}: {
  className?: string
  tone?: 'default' | 'onDark'
}) {
  const { count, open, hydrated } = useCart()
  const t = useT()

  return (
    <button
      type="button"
      onClick={open}
      aria-label={t('a11y.openCart')}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300',
        tone === 'onDark'
          ? 'border-ink-inverse/40 text-ink-inverse hover:border-gold hover:bg-gold hover:text-gold-ink'
          : 'border-line-strong text-ink hover:border-gold hover:bg-gold hover:text-gold-ink',
        className
      )}
    >
      <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.6} />
      <AnimatePresence>
        {hydrated && count > 0 ? (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-gold px-1 text-[0.62rem] font-bold text-gold-ink"
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </button>
  )
}
