"use client"

import { useCallback, useState } from "react"

import { useCart } from "@/providers/data/cart/client"
import {
  placeOrderAction,
  type PlaceOrderResult,
} from "@/entities/order/data/server/actions"

export type CheckoutCustomer = {
  name: string
  phone: string
  address: string
  comment?: string
}

/**
 * Process: checkout.
 * Composes the cart state with the place-order server action, clears the cart
 * on success, and exposes the uniform `{ isCheckingOut, isCheckoutError, checkout }`.
 */
export function useCheckout() {
  const cart = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isCheckoutError, setIsCheckoutError] = useState(false)

  const checkout = useCallback(
    async (customer: CheckoutCustomer): Promise<PlaceOrderResult> => {
      setIsCheckingOut(true)
      setIsCheckoutError(false)
      try {
        const result = await placeOrderAction({
          customer,
          items: cart.lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
          })),
        })
        if (result.ok) {
          cart.clear()
        } else {
          setIsCheckoutError(true)
        }
        return result
      } catch {
        setIsCheckoutError(true)
        return { ok: false, error: "unknown" }
      } finally {
        setIsCheckingOut(false)
      }
    },
    [cart],
  )

  return { isCheckingOut, isCheckoutError, checkout }
}
