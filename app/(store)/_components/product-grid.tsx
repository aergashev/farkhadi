"use client"

import { ProductCard } from "@/entities/product/components/product-card/client"
import { AddToCartButton } from "@/features/cart/add-to-cart/client"
import { cn } from "@/lib/utils"
import type { Product } from "@/entities/product/data/shared/types"

/**
 * App-layer composition: pairs the presentational entity card with the
 * add-to-cart feature button, respecting the layer direction.
 */
export function ProductGrid({
  products,
  className,
}: {
  products: Product[]
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          action={<AddToCartButton product={product} iconOnly />}
        />
      ))}
    </div>
  )
}
