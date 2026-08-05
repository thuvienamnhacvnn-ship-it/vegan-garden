/**
 * The five brand values from the mock-up. Copy lives in messages under
 * `brandBar.items[i]`; this file only fixes the order and the icon.
 */
export type ValueIcon = 'leaf' | 'bowl' | 'hat' | 'globe' | 'lotus'

export interface BrandValue {
  id: string
  icon: ValueIcon
}

export const brandValues: BrandValue[] = [
  { id: 'vegan', icon: 'leaf' },
  { id: 'fresh', icon: 'bowl' },
  { id: 'heritage', icon: 'hat' },
  { id: 'sustainable', icon: 'globe' },
  { id: 'mindful', icon: 'lotus' },
]

export type WhyIcon = 'flame' | 'sprout' | 'moon' | 'heart'

export const whyUsItems: { id: string; icon: WhyIcon }[] = [
  { id: 'handcrafted', icon: 'flame' },
  { id: 'honest', icon: 'sprout' },
  { id: 'calm', icon: 'moon' },
  { id: 'everyone', icon: 'heart' },
]
