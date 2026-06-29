import type { Locale } from "./config"
import { uz } from "./dictionaries/uz"
import { ru } from "./dictionaries/ru"

/** The Uzbek dictionary defines the canonical translation shape. */
export type Dictionary = typeof uz

const DICTIONARIES: Record<Locale, Dictionary> = { uz, ru }

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? uz
}

export * from "./config"
