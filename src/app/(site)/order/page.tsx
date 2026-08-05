import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { OrderPageContent } from './OrderPageContent'

export const metadata: Metadata = pageMetadata('order', '/order')

export default function OrderPage() {
  return <OrderPageContent />
}
