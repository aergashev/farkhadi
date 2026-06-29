"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, Gift, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useI18n } from "@/providers/lib/i18n/client"
import { useAddToCart } from "@/features/cart/add-to-cart/client"
import { formatPrice, pickLocale } from "@/shared/lib/format"
import type { Product } from "@/entities/product/data/shared/types"
import { QUIZ_UI, TELEGRAM_URL, type Archetype } from "../shared"

type Match = { product: Product; archetype: Archetype }

export function ResultCard({
  match,
  runnerUp,
  onRetake,
}: {
  match: Match
  runnerUp: Match | null
  onRetake: () => void
}) {
  const { locale } = useI18n()
  const router = useRouter()
  const L = <T,>(v: Record<"uz" | "ru", T>) => pickLocale(v, locale)
  const { addToCart } = useAddToCart(match.product)

  const { product, archetype } = match
  const name = pickLocale(product.name, locale)

  const noteRows = [
    pickLocale(product.notes.top, locale),
    pickLocale(product.notes.heart, locale),
    pickLocale(product.notes.base, locale),
  ].flat()

  const buyNow = () => {
    addToCart(1)
    router.push("/cart")
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Photo */}
      <div
        className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl border border-primary/25"
        style={{
          backgroundImage: `radial-gradient(120% 90% at 50% 0%, ${product.accent}44, transparent 70%)`,
        }}
      >
        <Image
          src={product.image}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 24rem, 90vw"
          className="object-cover"
        />
      </div>

      {/* Result */}
      <div className="flex flex-col">
        <span className="text-sm uppercase tracking-[0.2em] text-primary">
          {L(QUIZ_UI.resultYouAre)} {archetype.emoji} {L(archetype.name)}
        </span>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">{name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{L(QUIZ_UI.resultMatch)}</p>

        <p className="mt-5 font-serif text-xl italic leading-relaxed text-brand-cream">
          “{L(archetype.personality)}”
        </p>

        {noteRows.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {noteRows.map((note) => (
              <span
                key={note}
                className="rounded-full bg-accent px-3 py-1 text-sm text-brand-cream"
              >
                {note}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-end gap-3">
          <span className="font-serif text-3xl text-primary tabular-nums">
            {formatPrice(product.price)}
          </span>
          <span className="pb-1 text-sm text-muted-foreground">
            so‘m · {product.volumeMl} ml
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={buyNow}
            className="gap-2 bg-primary font-medium text-primary-foreground hover:bg-primary/90"
          >
            {L(QUIZ_UI.addToCart)}
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary/40 bg-transparent text-primary hover:bg-accent hover:text-primary"
          >
            <Link href={`/product/${product.slug}`}>{L(QUIZ_UI.viewProduct)}</Link>
          </Button>
        </div>

        {runnerUp && (
          <Link
            href={`/product/${runnerUp.product.slug}`}
            className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-primary"
          >
            {L(QUIZ_UI.runnerUp)}{" "}
            <span className="text-brand-cream">
              {pickLocale(runnerUp.product.name, locale)} {runnerUp.archetype.emoji}
            </span>
            <ArrowRight className="size-3.5" />
          </Link>
        )}

        <Separator className="my-6 bg-border" />

        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="ghost"
            onClick={onRetake}
            className="gap-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <RotateCcw className="size-4" />
            {L(QUIZ_UI.retake)}
          </Button>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary/80 transition hover:text-primary"
          >
            <Gift className="size-4" />
            {L(QUIZ_UI.giftCta)}
          </a>
        </div>
      </div>
    </div>
  )
}
