import type { Localized, OpeningHour } from '@/types'

/**
 * Single source of truth for every piece of business data on the site.
 *
 * IMPORTANT - the address is confirmed; the phone number, e-mail, website and
 * opening hours below are taken from the design mock-up and are placeholders.
 * Replace them with the restaurant's real details before going live; nothing
 * else in the codebase needs to change.
 */
export const site = {
  name: 'Vegan Garden',
  legalName: 'Vegan Garden Berlin',
  tagline: {
    de: 'Die Kunst der Reinheit und des Friedens',
    vi: 'Nghệ thuật của sự thanh khiết và an yên',
  } satisfies Localized,

  address: {
    street: 'Frankfurter Allee 21',
    postalCode: '10247',
    city: 'Berlin',
    district: 'Friedrichshain',
    country: 'Germany',
    countryCode: 'DE',
  },

  /** Placeholder from the mock-up - verify before launch. */
  phone: '+49 30 120 88 89 2',
  phoneHref: '+493012088892',
  /** Placeholder from the mock-up - verify before launch. */
  email: 'info@vegangarden-berlin.de',
  /** Placeholder from the mock-up - verify before launch. */
  website: 'www.vegangarden-berlin.de',

  geo: { latitude: 52.5152, longitude: 13.4645 },

  mapsEmbedSrc:
    'https://www.google.com/maps?q=Frankfurter+Allee+21,+10247+Berlin,+Germany&output=embed',
  mapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Frankfurter+Allee+21,+10247+Berlin,+Germany',

  social: [
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/' },
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
    { id: 'tripadvisor', label: 'Tripadvisor', href: 'https://www.tripadvisor.com/' },
    { id: 'happycow', label: 'HappyCow', href: 'https://www.happycow.net/' },
  ] as const,

  currency: 'EUR',
  currencySymbol: '€',

  delivery: {
    fee: 3.9,
    freeFrom: 35,
    minimumOrder: 15,
    /** Minutes needed before the first pickup / delivery slot. */
    leadTimeMinutes: 45,
  },

  reservation: {
    maxGuests: 12,
    /** Reservations can be made this many days ahead. */
    horizonDays: 90,
    /** Last seating before closing, in minutes. */
    lastSeatingBufferMinutes: 60,
  },
} as const

/** 0 = Sunday, matching Date.prototype.getDay(). */
export const openingHours: OpeningHour[] = [
  { day: 1, opens: '11:30', closes: '22:00' },
  { day: 2, opens: '11:30', closes: '22:00' },
  { day: 3, opens: '11:30', closes: '22:00' },
  { day: 4, opens: '11:30', closes: '22:00' },
  { day: 5, opens: '11:30', closes: '22:30' },
  { day: 6, opens: '11:30', closes: '22:30' },
  { day: 0, opens: '12:00', closes: '22:00' },
]

/** Order the opening-hours table follows on screen: Monday first. */
export const weekOrder = [1, 2, 3, 4, 5, 6, 0]

export const navigation = [
  { key: 'home', href: '/' },
  { key: 'story', href: '/our-story' },
  { key: 'menu', href: '/menu' },
  { key: 'reservation', href: '/reservation' },
  { key: 'order', href: '/order' },
  { key: 'gallery', href: '/gallery' },
  { key: 'contact', href: '/contact' },
] as const

export const legalNavigation = [
  { key: 'impressum', href: '/impressum' },
  { key: 'privacy', href: '/privacy' },
  { key: 'terms', href: '/terms' },
] as const

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3020'
