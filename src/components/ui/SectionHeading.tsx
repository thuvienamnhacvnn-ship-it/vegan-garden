import { cn } from '@/lib/format'
import { Reveal } from './Reveal'

/**
 * The editorial heading block from the mock-ups: a letterspaced gold eyebrow,
 * a large display heading where one word can be highlighted in gold, and an
 * optional lotus rule underneath.
 */
export function SectionHeading({
  eyebrow,
  parts,
  highlight,
  className,
  headingClassName,
  align = 'left',
  as: Tag = 'h2',
  tone = 'dark',
}: {
  eyebrow?: string
  /** Heading words/lines; the entry matching `highlight` is rendered in gold. */
  parts: string[]
  highlight?: string
  className?: string
  headingClassName?: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2' | 'h3'
  /** "dark" = on night green, "light" = on the cream-dim panels. */
  tone?: 'dark' | 'light'
}) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow ? (
        <Reveal>
          <span className={cn('eyebrow', align === 'center' && 'justify-center')}>{eyebrow}</span>
        </Reveal>
      ) : null}

      <Reveal delay={0.08}>
        <Tag
          className={cn(
            'mt-5 text-[2.15rem] leading-[1.12] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.6rem]',
            tone === 'dark' ? 'text-cream' : 'text-cream',
            headingClassName
          )}
        >
          {parts.map((part, index) => (
            <span
              key={`${part}-${index}`}
              className={cn(
                'block',
                highlight && part.trim() === highlight.trim() && 'inline text-gold-soft'
              )}
            >
              {part}
              {highlight && part.trim() === highlight.trim() ? ' ' : null}
            </span>
          ))}
        </Tag>
      </Reveal>
    </div>
  )
}

/**
 * Variant that renders the heading as a single flowing line, highlighting one
 * word in gold - used where the mock-up wraps naturally instead of by line.
 */
export function InlineHeading({
  parts,
  highlight,
  className,
  as: Tag = 'h2',
  tone = 'dark',
}: {
  parts: string[]
  highlight?: string
  className?: string
  as?: 'h1' | 'h2' | 'h3'
  tone?: 'dark' | 'light'
}) {
  return (
    <Tag
      className={cn(
        'text-[2.15rem] leading-[1.14] sm:text-[2.6rem] md:text-[3.1rem] lg:text-[3.5rem]',
        tone === 'dark' ? 'text-cream' : 'text-cream',
        className
      )}
    >
      {parts.map((part, index) => (
        <span
          key={`${part}-${index}`}
          className={cn(highlight && part.trim() === highlight.trim() && 'text-gold-soft')}
        >
          {part}
          {index < parts.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}
