'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Very light magnetic hover. Only runs on devices with a real pointer and only
 * when the visitor has not asked for reduced motion.
 */
export function useMagnetic(ref: RefObject<HTMLElement | null>, enabled = true, strength = 0.22) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    if (typeof window === 'undefined') return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reduced.matches) return

    let frame = 0

    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const x = (event.clientX - (rect.left + rect.width / 2)) * strength
        const y = (event.clientY - (rect.top + rect.height / 2)) * strength
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
      })
    }

    const reset = () => {
      cancelAnimationFrame(frame)
      el.style.transform = ''
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', reset)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', reset)
      el.style.transform = ''
    }
  }, [ref, enabled, strength])
}
