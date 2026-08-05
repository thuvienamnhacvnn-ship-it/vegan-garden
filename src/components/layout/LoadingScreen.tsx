'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Logo } from '@/components/ui/Logo'

const SESSION_KEY = 'vegan-garden.introShown'

/**
 * Brief lotus intro. Shown once per browser session, skipped entirely for
 * visitors who prefer reduced motion.
 */
export function LoadingScreen() {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (reduced) return
    let seen = false
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      seen = false
    }
    if (seen) return

    setVisible(true)
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* session storage unavailable - the intro simply repeats */
    }

    const timer = window.setTimeout(() => setVisible(false), 1500)
    return () => window.clearTimeout(timer)
  }, [reduced])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="intro"
          role="status"
          aria-live="polite"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-6 bg-night"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Logo variant="lockup" priority alt="Vegan Garden" className="h-28 w-auto" />
          </motion.div>

          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.3, ease: 'easeInOut' }}
            className="h-px w-40 origin-left bg-gradient-to-r from-transparent via-gold to-transparent"
          />
          <span className="sr-only">Vegan Garden</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
