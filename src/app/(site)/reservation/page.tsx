import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { ReservationPageContent } from './ReservationPageContent'

export const metadata: Metadata = pageMetadata('reservation', '/reservation')

export default function ReservationPage() {
  return <ReservationPageContent />
}
