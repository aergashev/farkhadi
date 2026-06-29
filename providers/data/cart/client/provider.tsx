"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import type { CartLine } from "../shared/types"

const STORAGE_KEY = "farkhadi_cart_v1"

type AddInput = Omit<CartLine, "quantity"> & { quantity?: number }

type CartContextValue = {
  lines: CartLine[]
  count: number
  total: number
  hydrated: boolean
  add: (item: AddInput) => void
  setQuantity: (productId: string, quantity: number) => void
  remove: (productId: string) => void
  clear: () => void
  has: (productId: string) => boolean
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [hydrated, setHydrated] = useState(false)

  // One-time hydration from localStorage after mount. This must run in an
  // effect (not a lazy initializer) so the first client render matches the
  // server's empty cart and avoids a hydration mismatch.
  useEffect(() => {
    let initial: CartLine[] = []
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) initial = JSON.parse(raw) as CartLine[]
    } catch {
      // ignore corrupted storage
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time storage hydration
    setLines(initial)
    setHydrated(true)
  }, [])

  // Persist on change (after hydration).
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // ignore quota errors
    }
  }, [lines, hydrated])

  const add = useCallback((item: AddInput) => {
    const qty = item.quantity ?? 1
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === item.productId)
      if (existing) {
        return prev.map((l) =>
          l.productId === item.productId
            ? { ...l, quantity: Math.min(99, l.quantity + qty) }
            : l,
        )
      }
      return [...prev, { ...item, quantity: qty }]
    })
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) =>
            l.productId === productId
              ? { ...l, quantity: Math.min(99, Math.floor(quantity)) }
              : l,
          ),
    )
  }, [])

  const remove = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0)
    const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0)
    return {
      lines,
      count,
      total,
      hydrated,
      add,
      setQuantity,
      remove,
      clear,
      has: (productId) => lines.some((l) => l.productId === productId),
    }
  }, [lines, hydrated, add, setQuantity, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within <CartProvider>")
  return ctx
}
