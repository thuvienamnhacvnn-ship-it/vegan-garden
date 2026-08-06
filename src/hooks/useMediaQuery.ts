'use client'

import { useEffect, useState } from 'react'

/**
 * Subscribes to a media query.
 *
 * Always false on the server and on the first client render, so the markup the
 * server sent and the markup React hydrates agree; the real answer arrives one
 * effect later. Components using this must therefore treat `false` as "not yet
 * known" and render the desktop/default case first.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** The breakpoint below which panels become bottom sheets (Tailwind `md`). */
export function useIsHandset() {
  return useMediaQuery('(max-width: 767px)')
}
