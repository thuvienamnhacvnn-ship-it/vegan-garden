import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { impressum } from '@/data/legal'
import { LegalPageView } from '@/components/sections/LegalPageView'

export const metadata: Metadata = pageMetadata('impressum', '/impressum')

export default function ImpressumPage() {
  return <LegalPageView page={impressum} />
}
