import type { Locale } from "@/providers/lib/i18n/shared/config"

/** Bilingual string. */
export type LB = Record<Locale, string>

/** Stable product slugs — must match the catalogue. Names never change. */
export type ProductSlug =
  | "gucci-gardena"
  | "symphoniya"
  | "imagination"
  | "afternoon-swim"
  | "creation"

export type Gender = "female" | "male"

/** Weighted contribution of one answer to several perfumes. */
export type Weights = Partial<Record<ProductSlug, number>>

export type QuizOption = {
  emoji: string
  label: LB
  /** Weighted points this option adds (primary + secondary leanings). */
  weights: Weights
}

export type QuizQuestion = {
  id: "mood" | "aura" | "scene" | "style"
  title: LB
  options: QuizOption[]
}

export type Archetype = {
  slug: ProductSlug
  emoji: string
  /** Playful vibe name (archetype layer only). */
  name: LB
  /** One warm personality sentence, shared by the result + share card. */
  personality: LB
}

export type QuizEventType = "started" | "finished" | "added_to_cart" | "shared"

export const QUIZ_EVENT_TYPES: QuizEventType[] = [
  "started",
  "finished",
  "added_to_cart",
  "shared",
]

export type QuizStats = {
  started: number
  finished: number
  addedToCart: number
  shared: number
  completionRate: number // 0..1
  byGender: { female: number; male: number }
  byProduct: { slug: ProductSlug; count: number }[]
}
