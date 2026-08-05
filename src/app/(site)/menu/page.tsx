import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { MenuPageContent } from './MenuPageContent'

export const metadata: Metadata = pageMetadata('menu', '/menu')

export default function MenuPage() {
  return <MenuPageContent />
}
