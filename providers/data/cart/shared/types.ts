export type CartLine = {
  productId: string
  slug: string
  name: string
  price: number
  image: string
  quantity: number
}

export type CartState = {
  lines: CartLine[]
}
