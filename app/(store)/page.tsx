import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getActiveProducts } from "@/entities/product/data/server/store"
import { getT } from "@/providers/lib/i18n/server"
import { ProductGrid } from "./_components/product-grid"
import {
  Hero,
  HowItWorks,
  Marquee,
  QuizTeaser,
  SectionHeading,
  StoryTeaser,
  Values,
} from "./_components/home-sections"

// Always render fresh from the database (admin can change products anytime).
export const dynamic = "force-dynamic"

export default async function HomePage() {
  const products = await getActiveProducts()
  const { dict } = await getT()
  const featured = products.filter((p) => p.featured)
  const showcase = featured.length ? featured : products.slice(0, 3)

  return (
    <>
      <Hero />
      <Marquee />

      <section className="container-px py-16 lg:py-20">
        <SectionHeading
          eyebrow={dict.featured.eyebrow}
          title={dict.featured.title}
          subtitle={dict.featured.subtitle}
        />
        <ProductGrid products={showcase} />
        <div className="mt-10 flex justify-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="gap-2 border-primary/40 bg-transparent text-primary hover:bg-accent hover:text-primary"
          >
            <Link href="/catalog">
              {dict.featured.viewAll}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <QuizTeaser />
      <Values />
      <StoryTeaser />
      <HowItWorks />
    </>
  )
}
