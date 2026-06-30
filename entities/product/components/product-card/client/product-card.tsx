"use client"

import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useDict, useI18n } from "@/providers/lib/i18n/client"
import { formatPrice, pickLocale } from "@/shared/lib/format"
import type { Product } from "../../../data/shared/types"
import { PRODUCT_TAGS } from "../../../data/shared/tags"

type Props = {
  product: Product
  /** CTA node (e.g. an add-to-cart button) supplied by the composing layer. */
  action?: React.ReactNode
  className?: string
}

/** Presentational product card. Receives data + an action slot. */
export function ProductCard({ product, action, className }: Props) {
  const { locale } = useI18n()
  const dict = useDict()
  const name = pickLocale(product.name, locale)
  const tag = PRODUCT_TAGS[product.slug]

  return (
    <Card
      className={cn(
        "group/card gap-0 py-0 ring-border transition-all duration-300 hover:ring-primary/40 hover:shadow-[0_18px_50px_-24px_rgba(244,199,120,0.45)]",
        className,
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-t-4xl"
        style={{
          backgroundImage: `radial-gradient(120% 90% at 50% 0%, ${product.accent}33, transparent 70%)`,
        }}
      >
        <Image
          src={product.image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover/card:scale-[1.04]"
        />
        <Badge className="absolute left-3 top-3 border-0 bg-brand-green-deep/80 text-[10px] font-medium tracking-wider text-primary backdrop-blur">
          {dict.product.edp}
        </Badge>
      </Link>

      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1.5">
          {tag && (
            <span className="inline-block rounded-full border border-primary/30 bg-accent/40 px-2.5 py-0.5 text-[11px] tracking-wide text-primary">
              {pickLocale(tag, locale)}
            </span>
          )}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-serif text-xl leading-tight transition-colors group-hover/card:text-primary">
              {name}
            </h3>
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {pickLocale(product.tagline, locale)}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="font-serif text-lg text-primary tabular-nums">
              {formatPrice(product.price)}{" "}
              <span className="text-xs text-muted-foreground">
                {dict.common.currency}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">{dict.common.volume}</p>
          </div>
          {action}
        </div>
      </CardContent>
    </Card>
  )
}
