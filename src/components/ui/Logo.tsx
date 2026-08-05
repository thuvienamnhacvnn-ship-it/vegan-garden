import Image from 'next/image'
import { cn } from '@/lib/format'

/**
 * The brand logo always comes from the supplied SVG in /public/logo - it is
 * only ever scaled, never redrawn or recoloured.
 *   variant="lockup" -> lotus mark + wordmark stacked
 *   variant="mark"   -> lotus mark only (header, badges, favicon)
 */
export function Logo({
  variant = 'mark',
  className,
  priority = false,
  alt = 'Vegan Garden',
}: {
  variant?: 'lockup' | 'mark'
  className?: string
  priority?: boolean
  alt?: string
}) {
  const lockup = variant === 'lockup'
  return (
    <Image
      src={lockup ? '/logo/vegan-garden-logo.svg' : '/logo/vegan-garden-mark.svg'}
      alt={alt}
      width={lockup ? 255 : 184}
      height={lockup ? 217 : 172}
      priority={priority}
      // no default h-/w- here: it would collide with the caller's size class
      className={cn('select-none', className)}
    />
  )
}

/** Horizontal lockup: the supplied mark next to the wordmark in the display face. */
export function LogoWordmark({
  className,
  compact = false,
  tone = 'default',
}: {
  className?: string
  compact?: boolean
  tone?: 'default' | 'onDark'
}) {
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <Logo
        variant="mark"
        priority
        alt=""
        className={cn('w-auto transition-all duration-500', compact ? 'h-8' : 'h-9 md:h-10')}
      />
      <span
        className={cn(
          'whitespace-nowrap font-display font-light tracking-[0.18em] transition-all duration-500',
          tone === 'onDark' ? 'text-ink-inverse' : 'text-ink',
          compact ? 'text-base md:text-lg' : 'text-lg md:text-xl'
        )}
      >
        VEGAN GARDEN
      </span>
    </span>
  )
}
