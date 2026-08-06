export type Locale = 'de' | 'en' | 'vi'

export const LOCALES: Locale[] = ['de', 'en', 'vi']
export const DEFAULT_LOCALE: Locale = 'de'

/**
 * A piece of content that exists in every site language. Because this is a
 * `Record` over `Locale`, adding a language above turns every incomplete
 * content entry into a TypeScript error - the compiler is the checklist.
 */
export type Localized<T = string> = Record<Locale, T>

export type MenuCategory =
  | 'starters'
  | 'soups'
  | 'noodles'
  | 'rice'
  | 'mains'
  | 'desserts'
  | 'drinks'

export type SpiceLevel = 'mild' | 'medium' | 'hot'

export type DishTag = 'vegan' | 'glutenFree' | 'spicy' | 'bestseller' | 'new' | 'nutFree'

export interface Dish {
  id: string
  /** Vietnamese dish name - always shown, it is the dish's real name. */
  nameVi: string
  /** Localised secondary name / German rendering of the dish. */
  name: Localized
  description: Localized
  price: number
  category: MenuCategory
  spice: SpiceLevel
  tags: DishTag[]
  image: string
  /** Ingredient list shown inside the detail modal. */
  ingredients: Localized<string[]>
  allergens?: Localized<string[]>
}

export type GalleryCategory = 'space' | 'food' | 'details' | 'ingredients'

export interface GalleryImage {
  id: string
  src: string
  width: number
  height: number
  category: GalleryCategory
  alt: Localized
  caption: Localized
}

export interface Review {
  id: string
  author: string
  origin: Localized
  rating: number
  text: Localized
  source: 'google' | 'tripadvisor' | 'guest'
}

export interface OpeningHour {
  /** 0 = Sunday, matching Date.prototype.getDay() */
  day: number
  opens: string
  closes: string
}

export interface CartLine {
  dishId: string
  quantity: number
  note: string
}

export type FulfilmentMethod = 'pickup' | 'delivery'
