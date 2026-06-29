import type { Metadata } from "next"

import { getActiveProducts } from "@/entities/product/data/server/store"
import { QuizFlow } from "@/features/quiz/client"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Ifor testi — FarKhadi",
  description:
    "4 ta savol — va FarKhadi sizning kayfiyatingizga mos iforni topadi. Тест ароматов FarKhadi.",
}

export default async function QuizPage() {
  const products = await getActiveProducts()
  return <QuizFlow products={products} />
}
