"use client"

import { createContext, useContext, useMemo, useTransition } from "react"
import { useRouter } from "next/navigation"

import { type Locale } from "../shared/config"
import { getDictionary, type Dictionary } from "../shared"
import { setLocaleAction } from "../server/actions"

type I18nContextValue = {
  locale: Locale
  dict: Dictionary
  setLocale: (locale: Locale) => void
  isPending: boolean
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      dict: getDictionary(locale),
      isPending,
      setLocale: (next) => {
        startTransition(async () => {
          await setLocaleAction(next)
          router.refresh()
        })
      },
    }
  }, [locale, isPending, router])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>")
  return ctx
}

/** Convenience hook: returns the active dictionary. */
export function useDict() {
  return useI18n().dict
}
