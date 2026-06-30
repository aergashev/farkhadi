import type { Metadata } from "next"

import { getActiveProducts } from "@/entities/product/data/server/store"
import { QuizFlow } from "@/features/quiz/client"

export const dynamic = "force-dynamic"

const QUIZ_DESCRIPTION =
  "4 ta savol — va FarKhadi sizning kayfiyatingizga mos iforni topadi. Тест ароматов FarKhadi."

export const metadata: Metadata = {
  title: "Ifor testi",
  description: QUIZ_DESCRIPTION,
  alternates: { canonical: "/quiz" },
  openGraph: {
    type: "website",
    url: "/quiz",
    title: "Ifor testi — FarKhadi",
    description: QUIZ_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ifor testi — FarKhadi",
    description: QUIZ_DESCRIPTION,
    images: ["/opengraph-image"],
  },
}

export default async function QuizPage() {
  const products = await getActiveProducts()
  return <QuizFlow products={products} />
}
