import "server-only"
import { cookies } from "next/headers"

import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "../shared/config"
import { getDictionary } from "../shared"

/** Reads the active locale from the cookie (server-side). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : DEFAULT_LOCALE
}

/** Server-side translations for RSC pages. */
export async function getT() {
  const locale = await getLocale()
  return { locale, dict: getDictionary(locale) }
}
