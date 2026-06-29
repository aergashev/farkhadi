"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useCart } from "@/providers/data/cart/client"
import { useDict } from "@/providers/lib/i18n/client"
import { formatPrice } from "@/shared/lib/format"

export function CartSheet() {
  const cart = useCart()
  const dict = useDict()
  const [open, setOpen] = useState(false)
  const count = cart.hydrated ? cart.count : 0

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={dict.cart.openCart}
          className="relative text-brand-cream hover:bg-accent hover:text-primary"
        >
          <ShoppingBag className="size-5" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4.5 min-w-[1.125rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 border-border bg-card p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="flex items-center gap-2 font-serif text-xl">
            <ShoppingBag className="size-5 text-primary" />
            {dict.cart.title}
          </SheetTitle>
        </SheetHeader>

        {cart.lines.length === 0 ? (
          <Empty className="flex-1">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-accent text-primary/70">
                <ShoppingBag />
              </EmptyMedia>
              <EmptyTitle className="font-serif text-lg">
                {dict.cart.empty}
              </EmptyTitle>
              <EmptyDescription>{dict.cart.emptyHint}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                asChild
                variant="outline"
                className="border-primary/40 text-primary hover:bg-accent hover:text-primary"
              >
                <Link href="/catalog" onClick={() => setOpen(false)}>
                  {dict.featured.viewAll}
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="divide-y divide-border">
                {cart.lines.map((line) => (
                  <li key={line.productId} className="flex gap-4 py-4">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-brand-green-deep">
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-serif text-base">{line.name}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => cart.remove(line.productId)}
                          aria-label={dict.common.remove}
                          className="text-muted-foreground hover:bg-transparent hover:text-destructive"
                        >
                          <X />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dict.common.volume}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-border">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() =>
                              cart.setQuantity(line.productId, line.quantity - 1)
                            }
                            aria-label={dict.common.remove}
                            className="rounded-full text-muted-foreground hover:bg-transparent hover:text-primary"
                          >
                            <Minus />
                          </Button>
                          <span className="w-7 text-center text-sm tabular-nums">
                            {line.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() =>
                              cart.setQuantity(line.productId, line.quantity + 1)
                            }
                            aria-label={dict.common.addToCart}
                            className="rounded-full text-muted-foreground hover:bg-transparent hover:text-primary"
                          >
                            <Plus />
                          </Button>
                        </div>
                        <span className="font-medium text-primary tabular-nums">
                          {formatPrice(line.price * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="gap-3 border-t border-border bg-card px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {dict.common.total}
                </span>
                <span className="font-serif text-xl text-primary tabular-nums">
                  {formatPrice(cart.total)}{" "}
                  <span className="text-sm">{dict.common.currency}</span>
                </span>
              </div>
              <Button
                asChild
                size="lg"
                className="w-full bg-primary font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/cart" onClick={() => setOpen(false)}>
                  {dict.cart.checkout}
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={() => cart.clear()}
              >
                <Trash2 className="size-4" /> {dict.common.remove}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
