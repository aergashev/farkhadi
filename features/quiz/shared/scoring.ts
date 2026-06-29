import type { ProductSlug } from "./types"

const ALL_SLUGS: ProductSlug[] = [
  "gucci-gardena",
  "symphoniya",
  "imagination",
  "afternoon-swim",
  "creation",
]

export type QuizResult = { winner: ProductSlug; runnerUp: ProductSlug }

/**
 * Scores the four answers. Each answer is +1 to its perfume.
 * Ties are broken by: (1) the Q1 pick (main personality anchor),
 * then (2) the Q4 pick (strongest identity question), then
 * (3) product priority (order in `priority`, e.g. admin/featured order).
 * Only perfumes present in `available` can be returned.
 */
export function scoreQuiz(
  answers: ProductSlug[],
  priority: ProductSlug[] = ALL_SLUGS,
  available: ProductSlug[] = ALL_SLUGS,
): QuizResult {
  const counts = new Map<ProductSlug, number>(ALL_SLUGS.map((s) => [s, 0]))
  for (const a of answers) counts.set(a, (counts.get(a) ?? 0) + 1)

  const q1 = answers[0]
  const q4 = answers[3]
  const prio = (s: ProductSlug) => {
    const i = priority.indexOf(s)
    return i === -1 ? ALL_SLUGS.length : i
  }
  // Lower tie-rank wins: Q1 pick first, then Q4 pick, then product priority.
  const tieRank = (s: ProductSlug) => (s === q1 ? -2 : s === q4 ? -1 : prio(s))

  const sorted = [...ALL_SLUGS].sort((a, b) => {
    const byCount = (counts.get(b) ?? 0) - (counts.get(a) ?? 0)
    return byCount !== 0 ? byCount : tieRank(a) - tieRank(b)
  })

  const inStock = sorted.filter((s) => available.includes(s))
  const winner = inStock[0] ?? sorted[0]
  const runnerUp =
    inStock.find((s) => s !== winner) ?? sorted.find((s) => s !== winner) ?? winner

  return { winner, runnerUp }
}
