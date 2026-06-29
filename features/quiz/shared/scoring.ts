import type { Gender, ProductSlug, Weights } from "./types"
import { eligibleFor } from "./config"

const ALL_SLUGS: ProductSlug[] = [
  "gucci-gardena",
  "symphoniya",
  "imagination",
  "afternoon-swim",
  "creation",
]

export type QuizResult = { winner: ProductSlug; runnerUp: ProductSlug }

/** The perfume an answer leans to most (for tie-breaking). */
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
 * Weighted, gender-gated scoring.
 * - Each answer adds its weighted points (primary +2, secondary +1).
 * - Only perfumes eligible for the chosen gender AND present in the catalogue
 *   can win (men → unisex only; women → all).
 * - Ties break by the Q1 lean (personality anchor), then Q4 lean, then the
 *   product priority order (admin/data order).
 */
export function scoreQuiz(
  answers: Weights[],
  gender: Gender,
  available: ProductSlug[] = ALL_SLUGS,
  priority: ProductSlug[] = ALL_SLUGS,
): QuizResult {
  const totals = new Map<ProductSlug, number>(ALL_SLUGS.map((s) => [s, 0]))
  for (const w of answers) {
    for (const slug of ALL_SLUGS) {
      if (w[slug]) totals.set(slug, (totals.get(slug) ?? 0) + (w[slug] ?? 0))
    }
  }

  const eligible = eligibleFor(gender).filter((s) => available.includes(s))
  const pool = eligible.length ? eligible : available.length ? available : ALL_SLUGS

  const q1 = answers[0] ? primaryOf(answers[0]) : null
  const q4 = answers[3] ? primaryOf(answers[3]) : null
  const prio = (s: ProductSlug) => {
    const i = priority.indexOf(s)
    return i === -1 ? ALL_SLUGS.length : i
  }
  const tieRank = (s: ProductSlug) => (s === q1 ? -2 : s === q4 ? -1 : prio(s))

  const sorted = [...pool].sort((a, b) => {
    const byTotal = (totals.get(b) ?? 0) - (totals.get(a) ?? 0)
    return byTotal !== 0 ? byTotal : tieRank(a) - tieRank(b)
  })

  const winner = sorted[0]
  const runnerUp = sorted[1] ?? winner
  return { winner, runnerUp }
}
