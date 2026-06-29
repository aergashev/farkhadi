"use server"

import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"

import { getActiveProducts } from "@/entities/product/data/server/store"
import { isAdmin } from "@/providers/services/admin-auth/server"
import { sendOrderNotification } from "@/providers/services/telegram/server"
import type { Order, OrderItem, OrderStatus } from "../shared/types"
import { checkoutSchema } from "../shared/schema"
import { appendOrder, updateOrderStatus } from "./store"

export type PlaceOrderInput = {
  customer: { name: string; phone: string; address: string; comment?: string }
  items: { productId: string; quantity: number }[]
}

export type PlaceOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string }

function makeOrderNumber(): string {
  // 6 random base36 chars from a UUID — collision-resistant, unlike a
  // truncated timestamp which wraps every ~16.8h.
  const token = randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()
  return `FK-${token}`
}

export async function placeOrderAction(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  // Validate customer data with the shared zod schema (defense in depth).
  const parsed = checkoutSchema.safeParse(input.customer ?? {})
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "phone" }
  }
  const { name, phone, address, comment } = parsed.data

  if (!input.items?.length) return { ok: false, error: "empty" }

  // Re-resolve prices and product data server-side (never trust the client).
  const products = await getActiveProducts()
  const items: OrderItem[] = []
  for (const line of input.items) {
    const product = products.find((p) => p.id === line.productId)
    const qty = Math.max(1, Math.min(99, Math.floor(line.quantity)))
    if (!product) continue
    items.push({
      productId: product.id,
      slug: product.slug,
      name: product.name.uz,
      price: product.price,
      quantity: qty,
      image: product.image,
    })
  }

  if (!items.length) return { ok: false, error: "empty" }

  // If any requested line could not be resolved (product went inactive or was
  // deleted after it was added to the cart), don't silently place a partial
  // order with a different total — ask the customer to review the cart.
  if (items.length !== input.items.length) {
    return { ok: false, error: "unavailable" }
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const order: Order = {
    id: randomUUID(),
    number: makeOrderNumber(),
    customer: { name, phone, address, comment: comment || undefined },
    items,
    total,
    status: "new",
    createdAt: new Date().toISOString(),
  }

  await appendOrder(order)

  // Notify the shop's Telegram chat (best-effort — never blocks the order).
  await sendOrderNotification(order)

  revalidatePath("/admin")
  return { ok: true, orderNumber: order.number }
}

export async function updateOrderStatusAction(
  id: string,
  status: OrderStatus,
): Promise<{ ok: boolean }> {
  if (!(await isAdmin())) return { ok: false }
  await updateOrderStatus(id, status)
  revalidatePath("/admin")
  return { ok: true }
}
