import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { StoryPageContent } from './StoryPageContent'

export const metadata: Metadata = pageMetadata('story', '/our-story')

export default function OurStoryPage() {
  return <StoryPageContent />
}
