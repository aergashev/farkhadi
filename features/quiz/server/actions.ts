"use server"

import { getPrisma } from "@/providers/services/prisma/server"
import { QUIZ_EVENT_TYPES, type Gender, type QuizEventType } from "../shared/types"

/**
 * Records a quiz funnel event (started / finished / added_to_cart / shared).
 * Public + fire-and-forget — never throws to the caller, so analytics can
 * never break the quiz experience.
 */
export async function recordQuizEvent(input: {
  type: QuizEventType
  gender?: Gender
  productSlug?: string
}): Promise<void> {
  if (!QUIZ_EVENT_TYPES.includes(input.type)) return
  try {
    await getPrisma().quizEvent.create({
      data: {
        type: input.type,
        gender: input.gender ?? null,
        productSlug: input.productSlug ?? null,
      },
    })
  } catch {
    // analytics is best-effort
  }
}
