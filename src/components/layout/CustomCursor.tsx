'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Small gold dot that follows a fine pointer, with a wider ring that grows over
 * interactive elements. Never rendered on touch devices or with reduced motion,
 * and it never swallows pointer events.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduced.matches) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return

    let raf = 0
    let ringX = 0
    let ringY = 0
    let mouseX = 0
    let mouseY = 0

    const onMove = (event: PointerEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }

      const target = event.target as HTMLElement | null
      const interactive = Boolean(
        target?.closest('a, button, input, select, textarea, [role="button"]')
      )
      if (ringRef.current) {
        ringRef.current.dataset.active = interactive ? 'true' : 'false'
      }
    }

    const loop = () => {
      ringX += (mouseX - ringX) * 0.16
      ringY += (mouseY - ringY) * 0.16
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] hidden xl:block">
      <div
        ref={dotRef}
        className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-gold"
      />
      <div
        ref={ringRef}
        data-active="false"
        className="absolute -ml-[18px] -mt-[18px] h-9 w-9 rounded-full border border-gold/45 transition-[width,height,margin,opacity,border-color] duration-300 ease-luxe data-[active=true]:-ml-7 data-[active=true]:-mt-7 data-[active=true]:h-14 data-[active=true]:w-14 data-[active=true]:border-gold/70"
      />
    </div>
  )
}
