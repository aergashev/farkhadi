"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Droplet, FlaskConical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { NotesPyramid } from "@/entities/product/components/notes-pyramid/client"
import { AddToCartButton, useAddToCart } from "@/features/cart/add-to-cart/client"
import { useDict, useI18n } from "@/providers/lib/i18n/client"
import { formatPrice, pickLocale } from "@/shared/lib/format"
import type { Product } from "@/entities/product/data/shared/types"
import { ProductGrid } from "./product-grid"

export function ProductDetail({
  product,
  related,
}: {
  product: Product
  related: Product[]
}) {
  const { locale } = useI18n()
  const dict = useDict()
  const router = useRouter()
  const { addToCart } = useAddToCart(product)

  const name = pickLocale(product.name, locale)

  const buyNow = () => {
    addToCart(1)
    router.push("/cart")
  }

  return (
    <div className="container-px py-8 lg:py-12">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        {dict.common.backToCatalog}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-primary/20"
          style={{
            backgroundImage: `radial-gradient(120% 90% at 50% 0%, ${product.accent}40, transparent 70%)`,
          }}
        >
          <Image
            src={product.image}
            alt={name}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.22em] text-primary">
            {dict.product.edp}
          </span>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl">{name}</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {pickLocale(product.tagline, locale)}
          </p>

          <div className="mt-6 flex items-end gap-3">
            <span className="font-serif text-3xl text-primary tabular-nums">
              {formatPrice(product.price)}
            </span>
            <span className="pb-1 text-sm text-muted-foreground">
              {dict.common.currency} · {dict.common.volume}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton product={product} size="lg" />
            <Button
              size="lg"
              variant="outline"
              onClick={buyNow}
              className="border-primary/40 bg-transparent text-primary hover:bg-accent hover:text-primary"
            >
              {dict.common.buyNow}
            </Button>
          </div>

          <Separator className="my-7 bg-border" />

          <div className="space-y-3">
            <h2 className="font-serif text-xl">{dict.product.aboutTitle}</h2>
            <p className="leading-relaxed text-muted-foreground">
              {pickLocale(product.description, locale)}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <Droplet className="size-5 text-primary" />
              <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                {dict.product.volume}
              </p>
              <p className="font-serif text-lg">{dict.common.volume}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <FlaskConical className="size-5 text-primary" />
              <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                {dict.product.concentration}
              </p>
              <p className="font-serif text-lg">{dict.product.edp}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-14 max-w-3xl">
        <NotesPyramid notes={product.notes} />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 font-serif text-2xl sm:text-3xl">
            {dict.product.related}
          </h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  )
}
