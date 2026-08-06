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
  responsive = false,
}: {
  className?: string
  compact?: boolean
  tone?: 'default' | 'onDark'
  /**
   * Tightens the lockup on small screens. The header needs it: at 390px the
   * full-size wordmark is 226px wide and pushes the controls off the viewport.
   */
  responsive?: boolean
}) {
  return (
    <span className={cn('flex items-center', responsive ? 'gap-2 sm:gap-3' : 'gap-3', className)}>
      <Logo
        variant="mark"
        priority
        alt=""
        className={cn(
          'w-auto transition-all duration-500',
          compact ? 'h-8' : responsive ? 'h-8 sm:h-9 md:h-10' : 'h-9 md:h-10'
        )}
      />
      <span
        className={cn(
          'whitespace-nowrap font-display font-light transition-all duration-500',
          tone === 'onDark' ? 'text-ink-inverse' : 'text-ink',
          // Below `sm` the wordmark is dropped and the lotus carries the brand.
          // The header has to fit language, theme and menu at 360px, and the
          // name is on screen anyway - the hero states it in full.
          responsive ? 'hidden tracking-[0.12em] sm:inline sm:tracking-[0.18em]' : 'tracking-[0.18em]',
          compact
            ? 'text-base md:text-lg'
            : responsive
              ? 'text-[0.95rem] sm:text-lg md:text-xl'
              : 'text-lg md:text-xl'
        )}
      >
        VEGAN GARDEN
      </span>
    </span>
  )
}
