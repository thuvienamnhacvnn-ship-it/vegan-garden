import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { GalleryPageContent } from './GalleryPageContent'

export const metadata: Metadata = pageMetadata('gallery', '/gallery')

export default function GalleryPage() {
  return <GalleryPageContent />
}
