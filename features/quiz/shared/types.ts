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

export type QuizOption = {
  emoji: string
  label: LB
  /** The perfume this option points to. */
  target: ProductSlug
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
