import type { Locale } from "@/providers/lib/i18n/shared/config"

/** A bilingual string. */
export type Localized = Record<Locale, string>

/** A bilingual list of fragrance notes. */
export type LocalizedList = Record<Locale, string[]>

export type FragranceNotes = {
  top: LocalizedList
  heart: LocalizedList
  base: LocalizedList
}

export type Product = {
  id: string
  slug: string
  name: Localized
  /** Short tagline shown on cards. */
  tagline: Localized
  /** Long description shown on the product page. */
  description: Localized
  notes: FragranceNotes
  price: number
  volumeMl: number
  image: string
  /** Accent color (hex) sampled from the bottle, used for tinted UI. */
  accent: string
  active: boolean
  featured: boolean
  createdAt: string
}

export const DEFAULT_PRICE = 350000
export const DEFAULT_VOLUME_ML = 30
