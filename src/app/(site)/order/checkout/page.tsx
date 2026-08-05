import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { CheckoutContent } from './CheckoutContent'

export const metadata: Metadata = {
  ...pageMetadata('order', '/order/checkout'),
  robots: { index: false, follow: true },
}

export default function CheckoutPage() {
  return <CheckoutContent />
}
