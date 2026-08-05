'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { setSmoothScroll } from '@/lib/smoothScroll'

/**
 * Momentum scrolling. This is what makes long editorial pages feel considered
 * rather than jumpy - it also smooths every scroll-linked animation on the
 * page, because they all read the same scroll position.
 *
 * Skipped entirely for visitors who ask for reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices already have native momentum; overriding it feels wrong.
      syncTouch: false,
    })

    setSmoothScroll(lenis)

    let frame = 0
    const loop = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      setSmoothScroll(null)
      lenis.destroy()
    }
  }, [])

  return null
}
