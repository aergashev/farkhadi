import type { Gender, ProductSlug, Weights } from "./types"
import { GENDER_REDIRECT, QUESTION_WEIGHTS, eligibleFor } from "./config"

const ALL_SLUGS: ProductSlug[] = [
  "gucci-gardena",
  "symphoniya",
  "imagination",
  "afternoon-swim",
  "creation",
]

export type QuizResult = { winner: ProductSlug; runnerUp: ProductSlug }

/** The perfume an answer leans to most (its +2), for tie-breaking. */
function primaryOf(weights: Weights): ProductSlug | null {
  let best: ProductSlug | null = null
  let bestVal = -Infinity
  for (const slug of ALL_SLUGS) {
    const v = weights[slug] ?? 0
    if (v > bestVal) {
      bestVal = v
      best = slug
    }
  }
  return bestVal > 0 ? best : null
}

/**
 * Weighted, gender-aware scoring.
 *
 * 1. Sum each answer's weighted points across all five perfumes — the first
 *    and last questions count more (QUESTION_WEIGHTS).
 * 2. Build the eligible pool (men/undecided → unisex only; women → all),
 *    intersected with what's actually in the catalogue.
 * 3. Fold any *ineligible* perfume's score into its unisex twin
 *    (GENDER_REDIRECT) so a man who answers "romantic" still lands on the
 *    closest scent he can receive, rather than an arbitrary default.
 * 4. Rank the pool by that effective score; ties break by the mood (Q1) lean,
 *    then the self-image (Q4) lean, then catalogue priority.
 */
export function scoreQuiz(
  answers: Weights[],
  gender: Gender,
  available: ProductSlug[] = ALL_SLUGS,
  priority: ProductSlug[] = ALL_SLUGS,
): QuizResult {
  // 1. Weighted totals over every perfume.
  const totals = new Map<ProductSlug, number>(ALL_SLUGS.map((s) => [s, 0]))
  answers.forEach((w, i) => {
    const qWeight = QUESTION_WEIGHTS[i] ?? 1
    for (const slug of ALL_SLUGS) {
      const v = w[slug]
      if (v) totals.set(slug, (totals.get(slug) ?? 0) + v * qWeight)
    }
  })

  // 2. Eligible pool, gated by gender and what the catalogue actually has.
  const eligible = eligibleFor(gender).filter((s) => available.includes(s))
  const pool = eligible.length
    ? eligible
    : available.length
      ? available
      : ALL_SLUGS

  // 3. Effective score = own total + any ineligible twin folded in.
  const effective = new Map<ProductSlug, number>(
    pool.map((s) => [s, totals.get(s) ?? 0]),
  )
  for (const slug of ALL_SLUGS) {
    if (effective.has(slug)) continue // eligible — already counted
    const twin = GENDER_REDIRECT[slug]
    if (twin && effective.has(twin)) {
      effective.set(twin, (effective.get(twin) ?? 0) + (totals.get(slug) ?? 0))
    }
  }

  // 4. Tie-breaks. Anchor the Q1/Q4 leans through the redirect so they point
  //    at a perfume that's actually in the pool.
  const anchor = (s: ProductSlug | null): ProductSlug | null => {
    if (!s) return null
    if (effective.has(s)) return s
    const twin = GENDER_REDIRECT[s]
    return twin && effective.has(twin) ? twin : null
  }
  const moodLean = anchor(answers[0] ? primaryOf(answers[0]) : null)
  const selfLean = anchor(answers[3] ? primaryOf(answers[3]) : null)
  const prio = (s: ProductSlug) => {
    const i = priority.indexOf(s)
    return i === -1 ? ALL_SLUGS.length : i
  }
  const tieRank = (s: ProductSlug) =>
    s === moodLean ? -2 : s === selfLean ? -1 : prio(s)

  const sorted = [...effective.keys()].sort((a, b) => {
    const byScore = (effective.get(b) ?? 0) - (effective.get(a) ?? 0)
    return byScore !== 0 ? byScore : tieRank(a) - tieRank(b)
  })

  const winner = sorted[0]
  const runnerUp = sorted[1] ?? winner
  return { winner, runnerUp }
}
