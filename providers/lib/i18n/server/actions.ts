"use server"

import { cookies } from "next/headers"

import { LOCALE_COOKIE, isLocale } from "../shared/config"

/** Persists the chosen locale in a cookie (1 year). */
export async function setLocaleAction(locale: string) {
  if (!isLocale(locale)) return
  const store = await cookies()
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })
}
