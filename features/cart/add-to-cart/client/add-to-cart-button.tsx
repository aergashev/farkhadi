"use client"

import { Check, Plus, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDict } from "@/providers/lib/i18n/client"
import type { Product } from "@/entities/product/data/shared/types"
import { useAddToCart } from "./use-add-to-cart"

type Props = {
  product: Product
  quantity?: number
  size?: "default" | "lg" | "sm" | "icon"
  variant?: "solid" | "outline"
  iconOnly?: boolean
  className?: string
}

export function AddToCartButton({
  product,
  quantity = 1,
  size = "default",
  variant = "solid",
  iconOnly = false,
  className,
}: Props) {
  const { isInCart, addToCart } = useAddToCart(product)
  const dict = useDict()

  if (iconOnly) {
    return (
      <Button
        size="icon"
        aria-label={dict.common.addToCart}
        onClick={() => addToCart(quantity)}
        className={cn(
          "rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
          className,
        )}
      >
        {isInCart ? <Check className="size-4" /> : <Plus className="size-4" />}
      </Button>
    )
  }

  return (
    <Button
      size={size}
      onClick={() => addToCart(quantity)}
      className={cn(
        "gap-2 font-medium",
        variant === "solid"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-primary/40 bg-transparent text-primary hover:bg-accent",
        className,
      )}
    >
      {isInCart ? (
        <>
          <Check className="size-4" /> {dict.common.inCart}
        </>
      ) : (
        <>
          <ShoppingBag className="size-4" /> {dict.common.addToCart}
        </>
      )}
    </Button>
  )
}
