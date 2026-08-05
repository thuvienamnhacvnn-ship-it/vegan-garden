import type { MetadataRoute } from 'next'
import { siteUrl, navigation, legalNavigation } from '@/data/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const priorities: Record<string, number> = {
    '/': 1,
    '/menu': 0.9,
    '/reservation': 0.9,
    '/order': 0.85,
    '/our-story': 0.7,
    '/gallery': 0.7,
    '/contact': 0.7,
  }

  return [
    ...navigation.map((item) => ({
      url: `${siteUrl}${item.href}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: priorities[item.href] ?? 0.6,
      alternates: {
        languages: {
          de: `${siteUrl}${item.href}`,
          vi: `${siteUrl}${item.href}`,
        },
      },
    })),
    ...legalNavigation.map((item) => ({
      url: `${siteUrl}${item.href}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    })),
  ]
}
