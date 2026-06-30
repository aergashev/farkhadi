import type { Localized } from "./types"

/**
 * One emotional, occasion-style tag per perfume — helps shoppers choose faster.
 * Keyed by product slug; bilingual.
 */
export const PRODUCT_TAGS: Record<string, Localized> = {
  imagination: { uz: "Kechki obraz uchun", ru: "Для вечернего образа" },
  "gucci-gardena": { uz: "Romantik sovg‘a uchun", ru: "Для романтичного подарка" },
  "afternoon-swim": { uz: "Yozgi kayfiyat uchun", ru: "Для летнего настроения" },
  symphoniya: { uz: "Ilhomli kunlar uchun", ru: "Для вдохновлённых дней" },
  creation: { uz: "Jasur obraz uchun", ru: "Для смелого образа" },
}
