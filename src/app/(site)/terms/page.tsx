import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { terms } from '@/data/legal'
import { LegalPageView } from '@/components/sections/LegalPageView'

export const metadata: Metadata = pageMetadata('terms', '/terms')

export default function TermsPage() {
  return <LegalPageView page={terms} />
}
