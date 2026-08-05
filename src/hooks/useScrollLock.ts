'use client'

import { useEffect } from 'react'
import { pauseSmoothScroll, resumeSmoothScroll } from '@/lib/smoothScroll'

let lockCount = 0

/**
 * Locks page scrolling while a modal, drawer or full-screen menu is open.
 * Also parks Lenis, otherwise momentum keeps moving the page behind the panel.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return

    const body = document.body
    if (lockCount === 0) {
      const scrollbar = window.innerWidth - document.documentElement.clientWidth
      body.dataset.scrollLocked = 'true'
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    }
    lockCount += 1
    pauseSmoothScroll()

    return () => {
      lockCount = Math.max(0, lockCount - 1)
      resumeSmoothScroll()
      if (lockCount === 0) {
        delete body.dataset.scrollLocked
        body.style.paddingRight = ''
      }
    }
  }, [active])
}
