import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { privacy } from '@/data/legal'
import { LegalPageView } from '@/components/sections/LegalPageView'

export const metadata: Metadata = pageMetadata('privacy', '/privacy')

export default function PrivacyPage() {
  return <LegalPageView page={privacy} />
}
