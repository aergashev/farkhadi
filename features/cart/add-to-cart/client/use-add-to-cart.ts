"use client"

import { useCallback } from "react"
import { toast } from "sonner"

import { useCart } from "@/providers/data/cart/client"
import { useDict, useI18n } from "@/providers/lib/i18n/client"
import { pickLocale } from "@/shared/lib/format"
import type { Product } from "@/entities/product/data/shared/types"

/**
 * Feature: add a product to the cart.
 * Returns the uniform `{ isInCart, addToCart }` shape consumed by entity UI.
 */
export function useAddToCart(product: Product) {
  const cart = useCart()
  const dict = useDict()
  const { locale } = useI18n()

  const isInCart = cart.hydrated && cart.has(product.id)

  const addToCart = useCallback(
    (quantity = 1) => {
      cart.add({
        productId: product.id,
        slug: product.slug,
        name: pickLocale(product.name, locale),
        price: product.price,
        image: product.image,
        quantity,
      })
      toast.success(`${pickLocale(product.name, locale)} — ${dict.common.inCart}`)
    },
    [cart, product, locale, dict.common.inCart],
  )

  return { isInCart, addToCart }
}
