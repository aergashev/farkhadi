import "server-only"

import { getPrisma } from "@/providers/services/prisma/server"
import type { ProductSlug, QuizStats } from "../shared/types"

const EMPTY: QuizStats = {
  started: 0,
  finished: 0,
  addedToCart: 0,
  shared: 0,
  completionRate: 0,
  byGender: { female: 0, male: 0 },
  byProduct: [],
}

/** Aggregated quiz funnel metrics for the admin dashboard. */
export async function getQuizStats(): Promise<QuizStats> {
  const prisma = getPrisma()
  try {
    const [byType, byGender, byProduct] = await Promise.all([
      prisma.quizEvent.groupBy({ by: ["type"], _count: { _all: true } }),
      prisma.quizEvent.groupBy({
        by: ["gender"],
        where: { type: "finished" },
        _count: { _all: true },
      }),
      prisma.quizEvent.groupBy({
        by: ["productSlug"],
        where: { type: "finished" },
        _count: { _all: true },
      }),
    ])

    const typeCount = (t: string) =>
      byType.find((r) => r.type === t)?._count._all ?? 0

    const started = typeCount("started")
    const finished = typeCount("finished")

    return {
      started,
      finished,
      addedToCart: typeCount("added_to_cart"),
      shared: typeCount("shared"),
      completionRate: started > 0 ? finished / started : 0,
      byGender: {
        female: byGender.find((r) => r.gender === "female")?._count._all ?? 0,
        male: byGender.find((r) => r.gender === "male")?._count._all ?? 0,
      },
      byProduct: byProduct
        .filter((r) => r.productSlug)
        .map((r) => ({
          slug: r.productSlug as ProductSlug,
          count: r._count._all,
        }))
        .sort((a, b) => b.count - a.count),
    }
  } catch {
    return EMPTY
  }
}
