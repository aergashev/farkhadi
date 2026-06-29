export type OrderStatus = "new" | "confirmed" | "done" | "cancelled"

export type OrderItem = {
  productId: string
  slug: string
  /** Display name captured at order time (Uzbek). */
  name: string
  price: number
  quantity: number
  image: string
}

export type Order = {
  id: string
  /** Human-friendly sequential-ish number, e.g. FK-2A1B. */
  number: string
  customer: {
    name: string
    phone: string
    address: string
    comment?: string
  }
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
}

export type NewOrderInput = {
  customer: Order["customer"]
  items: OrderItem[]
}
