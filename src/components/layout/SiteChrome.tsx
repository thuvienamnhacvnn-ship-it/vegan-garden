'use client'

import type { ReactNode } from 'react'
import { CartProvider } from '@/components/cart/CartProvider'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Header } from './Header'
import { Footer } from './Footer'
import { PageTransition } from './PageTransition'
import { SmoothScroll } from './SmoothScroll'
import { LoadingScreen } from './LoadingScreen'
import { CustomCursor } from './CustomCursor'
import { BottomNav } from './BottomNav'
import { ServiceWorker } from './ServiceWorker'

/**
 * Header, footer, cart and momentum scrolling. Only the public site uses this -
 * /admin renders on the bare root layout so the owner's inbox is not wrapped
 * in guest chrome (or in smooth scrolling it does not want).
 *
 * The intro screen and the pointer cursor belong here for the same reason: they
 * are guest polish, and each already opts itself out for reduced motion.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <ServiceWorker />
      <LoadingScreen />
      <CustomCursor />
      <SmoothScroll />
      <Header />
      {/* The padding matches the tab bar's height plus the iOS safe area, so
          the last section of any page clears it instead of hiding beneath. */}
      <main id="main" className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <BottomNav />
      <CartDrawer />
    </CartProvider>
  )
}
