import type { SVGProps } from 'react'

/**
 * Hand-drawn, thin-stroke icon set in the style of the design mock-ups.
 * Everything uses `currentColor` so a parent can simply set `text-gold`.
 * Brand marks are drawn locally rather than imported, so the site never
 * depends on an icon library shipping (or keeping) brand glyphs.
 */
type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.1,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/* ------------------------------------------------------------------ values */

export function LeafIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 40V20" />
      <path d="M24 26c0-5 3.6-9.4 9.6-10.2C33 22 29.6 26.8 24 27.4" />
      <path d="M24 33c0-4.4-3.2-8.2-8.4-8.9.5 5.5 3.5 9.7 8.4 10.2" />
      <path d="M24 20c0-4.4 2.2-7.6 6-9.6-.4 4-2.2 7.2-6 9.6Z" />
    </svg>
  )
}

export function BowlIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 25h28c0 7.2-6.3 12.4-14 12.4S10 32.2 10 25Z" />
      <path d="M7 25h34" />
      <path d="M24 21c0-4 2.6-6.8 7-7.6-.4 4.4-3 7.2-7 7.6Z" />
      <path d="M24 21c0-3.6-2.4-6.2-6.4-7 .4 4 2.8 6.6 6.4 7Z" />
      <path d="M24 21v-5.4" />
    </svg>
  )
}

/** Vietnamese conical hat - "nón lá". */
export function ConicalHatIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 12 39 31H9L24 12Z" />
      <path d="M7 31h34" />
      <path d="M24 12v19" />
      <path d="M17.5 31 24 12l6.5 19" />
      <path d="M20.5 36c1.6 1.4 5.4 1.4 7 0" />
    </svg>
  )
}

export function GlobeLeafIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="13.5" />
      <path d="M10.5 24h27" />
      <path d="M24 10.5c3.6 4 5.4 8.5 5.4 13.5S27.6 33.5 24 37.5c-3.6-4-5.4-8.5-5.4-13.5S20.4 14.5 24 10.5Z" />
      <path d="M24 24c1.4-3.4 4.2-5.2 8.4-5.4-.4 4.2-3 6.8-6.6 7.2" />
    </svg>
  )
}

/** Seated, meditating figure - "mindful dining". */
export function LotusPoseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="13.5" r="3.6" />
      <path d="M24 18.6c4 0 6.6 2.6 7.4 6.4l.8 3.8" />
      <path d="M24 18.6c-4 0-6.6 2.6-7.4 6.4L15.8 28.8" />
      <path d="M15.8 28.8c-2.4.8-3.8 2.2-3.8 3.6 0 1.6 2 2.4 4.4 1.6l3.6-1.2" />
      <path d="M32.2 28.8c2.4.8 3.8 2.2 3.8 3.6 0 1.6-2 2.4-4.4 1.6l-3.6-1.2" />
      <path d="M17.4 35.4c1.6 1.8 4 2.6 6.6 2.6s5-.8 6.6-2.6" />
    </svg>
  )
}

/* --------------------------------------------------------------- why we do */

export function FlameIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 9c1.6 5.6 7 7.6 7 14.4 0 4.2-3.1 7.6-7 7.6s-7-3.4-7-7.6c0-3.4 1.6-5 3-7.6.6 2.4 1.8 3.4 3.2 3.8-.4-3.6.2-7 .8-10.6Z" />
      <path d="M14 34.5c5.8 3.4 14.2 3.4 20 0" />
      <path d="M17 39c4 1.8 10 1.8 14 0" />
    </svg>
  )
}

export function SproutIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 39V21" />
      <path d="M24 24c-5.4 0-9.6-3.6-10-9.4 5.8-.4 10 3.4 10 9.4Z" />
      <path d="M24 21c5 0 9-3.4 9.4-8.8-5.4-.4-9.4 3.2-9.4 8.8Z" />
      <path d="M15 39h18" />
    </svg>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M31.5 30.4A13.2 13.2 0 0 1 20.6 12a13.5 13.5 0 1 0 14.6 21 13.4 13.4 0 0 1-3.7-2.6Z" />
      <path d="M33 13.5 34 16l2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" />
    </svg>
  )
}

export function HeartHandIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 21.5c-1.6-3-6.6-3-6.6 1.2 0 3 3.8 6 6.6 8 2.8-2 6.6-5 6.6-8 0-4.2-5-4.2-6.6-1.2Z" />
      <path d="M11 27c0-8.2 5.6-14 13-14s13 5.8 13 14" />
      <path d="M13 33c3 3.4 6.6 5 11 5s8-1.6 11-5" />
    </svg>
  )
}

/* ------------------------------------------------------------- decorative */

export function LotusMarkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="1.1" {...props}>
      <path d="M32 6c3.2 4 4.8 8.2 4.8 12.4 0 4.4-1.8 8.2-4.8 11.6-3-3.4-4.8-7.2-4.8-11.6C27.2 14.2 28.8 10 32 6Z" />
      <path d="M32 30c-3.6-1.4-6.6-4-8.4-7.6-1.8-3.6-2-7.4-1-11.2 3.6 1.6 6.4 4.2 8.2 7.6" />
      <path d="M32 30c3.6-1.4 6.6-4 8.4-7.6 1.8-3.6 2-7.4 1-11.2-3.6 1.6-6.4 4.2-8.2 7.6" />
      <path d="M32 30c-4-.4-7.6-2-10.6-4.6-2.8-2.6-4.6-5.8-5.4-9.4 4 .4 7.4 2 10.2 4.6" />
      <path d="M32 30c4-.4 7.6-2 10.6-4.6 2.8-2.6 4.6-5.8 5.4-9.4-4 .4-7.4 2-10.2 4.6" />
    </svg>
  )
}

/** The thin lotus + rule divider that sits under headings in the mock-up. */
export function LotusDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/45" />
      <LotusMarkIcon className="h-5 w-8 shrink-0 text-gold/80" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/45" />
    </div>
  )
}

/** Botanical corner flourish, mirrored via CSS by the caller. */
export function BotanicalCorner({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 220"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 216C34 190 58 158 72 120c14-38 16-74 10-110" />
      <path d="M78 34c14 6 24 18 27 33 3 16-2 31-13 42-12-8-19-21-20-36-1-14 2-27 6-39Z" />
      <path d="M60 96c16 2 29 11 36 25 6 14 5 29-2 42-13-6-23-17-27-31-4-13-4-25-7-36Z" />
      <path d="M42 152c15 4 26 14 31 28 5 13 3 27-4 39-12-7-20-19-23-33-3-13-2-24-4-34Z" />
      <path d="M84 44c1 12 1 24 0 36M66 106c4 11 7 22 9 34M48 162c5 10 9 21 12 32" />
    </svg>
  )
}

/* ------------------------------------------------------------------ social */

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3-.04-1.3-.13-2.47-.13-2.44 0-4.11 1.49-4.11 4.23V9.9H7.4V13h2.72v8h3.38Z" />
    </svg>
  )
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Tripadvisor's owl, simplified to a thin-line mark. */
export function TripadvisorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="7.4" cy="13" r="4.2" />
      <circle cx="16.6" cy="13" r="4.2" />
      <circle cx="7.4" cy="13" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16.6" cy="13" r="1.5" fill="currentColor" stroke="none" />
      <path d="M8.6 8.2A9.6 9.6 0 0 1 12 7.6c1.2 0 2.3.2 3.4.6" />
      <path d="M3.2 9.4 5 7.6M20.8 9.4 19 7.6" />
    </svg>
  )
}

/** HappyCow-style leaf badge. */
export function LeafBadgeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M5.5 18.5C4 14 6.5 7.5 14 6c1.7-.35 3.2-.3 4.5.2.5 1.4.5 3 .1 4.8-1.6 7-8 9.2-12.2 8" />
      <path d="M6 19c2.2-3.6 5-6.4 8.6-8.4" />
    </svg>
  )
}

export const socialIconMap = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tripadvisor: TripadvisorIcon,
  happycow: LeafBadgeIcon,
} as const

export const valueIconMap = {
  leaf: LeafIcon,
  bowl: BowlIcon,
  hat: ConicalHatIcon,
  globe: GlobeLeafIcon,
  lotus: LotusPoseIcon,
} as const

export const whyIconMap = {
  flame: FlameIcon,
  sprout: SproutIcon,
  moon: MoonIcon,
  heart: HeartHandIcon,
} as const

/** Chili glyph used for the spice level on dish cards. */
export function ChiliIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <path d="M12.5 6.5c3.2 0 5.5 2.6 5.5 6 0 4-3 6.9-6.8 6.9-3 0-5.2-2-5.2-4.6 0-2.4 1.9-4.1 4.2-4.1" />
      <path d="M12.5 6.5c0-1.6 1-2.9 2.6-3.2M12.5 6.5c.9-.7 2.1-.9 3.3-.5" />
    </svg>
  )
}
