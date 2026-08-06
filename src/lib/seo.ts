import type { Metadata } from 'next'
import { site, siteUrl } from '@/data/site'
import { openingHoursSpecification } from './hours'
import { dishes } from '@/data/menu'
import { averageRating, reviews } from '@/data/reviews'
import de from '@/messages/de.json'
import en from '@/messages/en.json'
import vi from '@/messages/vi.json'

type MetaKey = keyof typeof de.meta

/**
 * Builds trilingual metadata for a page. German is the primary language; the
 * English and Vietnamese versions ride along in `alternates` and Open Graph so
 * all three are discoverable.
 *
 * Every language answers on the same URL - the switch is client-side, not a
 * routed prefix - so each `hreflang` points at that one canonical address.
 */
export function pageMetadata(key: MetaKey, path: string): Metadata {
  const deMeta = de.meta[key]
  const enMeta = en.meta[key]
  const url = `${siteUrl}${path}`

  return {
    title: deMeta.title,
    description: deMeta.description,
    keywords: [
      'Veganes Restaurant Berlin',
      'Vegan Vietnamese Berlin',
      'Veganes Restaurant Friedrichshain',
      'Vegan Pho Berlin',
      'Vietnamese Vegan Food Berlin',
      'Nhà hàng thuần chay Berlin',
      'Ẩm thực Việt thuần chay Berlin',
    ],
    alternates: {
      canonical: url,
      languages: {
        'de-DE': url,
        'en-GB': url,
        'vi-VN': url,
        'x-default': url,
      },
    },
    openGraph: {
      type: 'website',
      url,
      siteName: site.name,
      title: deMeta.title,
      description: deMeta.description,
      locale: 'de_DE',
      alternateLocale: ['en_GB', 'vi_VN'],
      images: [
        {
          url: `${siteUrl}/images/hero/hero-signature-bowl.jpg`,
          width: 1378,
          height: 2200,
          alt: enMeta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: deMeta.title,
      description: deMeta.description,
      images: [`${siteUrl}/images/hero/hero-signature-bowl.jpg`],
    },
  }
}

/** schema.org Restaurant graph, injected once in the root layout. */
export function restaurantJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${siteUrl}#restaurant`,
    name: site.name,
    legalName: site.legalName,
    description: de.meta.home.description,
    url: siteUrl,
    telephone: site.phone,
    email: site.email,
    image: [
      `${siteUrl}/images/hero/hero-signature-bowl.jpg`,
      `${siteUrl}/images/gallery/dining-hall-green-wall.jpg`,
    ],
    logo: `${siteUrl}/logo/vegan-garden-logo.svg`,
    servesCuisine: ['Vietnamese', 'Vegan', 'Asian'],
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    acceptsReservations: 'True',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.district,
      addressCountry: site.address.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHoursSpecification: openingHoursSpecification(),
    sameAs: site.social.map((network) => network.href),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount: reviews.length,
      bestRating: 5,
    },
    hasMenu: {
      '@type': 'Menu',
      '@id': `${siteUrl}/menu#menu`,
      name: 'Vegan Garden Speisekarte',
      inLanguage: ['de', 'vi'],
      hasMenuSection: buildMenuSections(),
    },
  }
}

const sectionNames: Record<string, string> = {
  starters: 'Vorspeisen',
  soups: 'Suppen',
  noodles: 'Nudeln',
  rice: 'Reis',
  mains: 'Hauptgerichte',
  desserts: 'Desserts',
  drinks: 'Getränke',
}

function buildMenuSections() {
  const sections = new Map<string, typeof dishes>()
  for (const dish of dishes) {
    sections.set(dish.category, [...(sections.get(dish.category) ?? []), dish])
  }

  return [...sections.entries()].map(([category, items]) => ({
    '@type': 'MenuSection' as const,
    name: sectionNames[category] ?? category,
    hasMenuItem: items.map((dish) => ({
      '@type': 'MenuItem' as const,
      name: `${dish.nameVi} – ${dish.name.de}`,
      description: dish.description.de,
      suitableForDiet: 'https://schema.org/VeganDiet',
      offers: {
        '@type': 'Offer' as const,
        price: dish.price.toFixed(2),
        priceCurrency: 'EUR',
      },
    })),
  }))
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  }
}
