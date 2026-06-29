import type { Locale } from "@/providers/lib/i18n/shared/config"

/** Formats a UZS amount with spaced thousands, e.g. 350000 -> "350 000". */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("ru-RU").format(Math.round(amount))
}

/** Picks the value for the active locale from a bilingual record. */
export function pickLocale<T>(value: Record<Locale, T>, locale: Locale): T {
  return value[locale] ?? value.uz
}

export function formatDate(iso: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "uz-UZ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}
