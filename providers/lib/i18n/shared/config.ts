/**
 * i18n configuration — isomorphic.
 * Main language is Uzbek (uz); Russian (ru) is fully switchable.
 */
export const LOCALES = ["uz", "ru"] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "uz"

export const LOCALE_COOKIE = "farkhadi_locale"

export const LOCALE_LABELS: Record<Locale, string> = {
  uz: "O‘zbekcha",
  ru: "Русский",
}

export const LOCALE_SHORT: Record<Locale, string> = {
  uz: "UZ",
  ru: "RU",
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value)
}
