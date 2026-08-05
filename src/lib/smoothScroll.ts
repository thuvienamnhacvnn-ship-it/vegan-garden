import type Lenis from 'lenis'

/**
 * Module-level handle on the Lenis instance.
 *
 * Modals and drawers lock the body; Lenis has to be told to stop as well, or
 * it keeps driving the scroll position behind the overlay. `useScrollLock`
 * calls these, so no component has to know Lenis exists.
 */
let instance: Lenis | null = null
let paused = 0

export function setSmoothScroll(next: Lenis | null) {
  instance = next
}

export function pauseSmoothScroll() {
  paused += 1
  instance?.stop()
}

export function resumeSmoothScroll() {
  paused = Math.max(0, paused - 1)
  if (paused === 0) instance?.start()
}
