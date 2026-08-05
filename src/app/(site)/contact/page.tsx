import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { ContactPageContent } from './ContactPageContent'

export const metadata: Metadata = pageMetadata('contact', '/contact')

export default function ContactPage() {
  return <ContactPageContent />
}
