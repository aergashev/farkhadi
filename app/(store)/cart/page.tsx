"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
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
import { useCheckout } from "@/processes/checkout/client/use-checkout"
import {
  firstCheckoutError,
  formatUzPhoneInput,
  UZ_PHONE_PREFIX,
} from "@/entities/order/data/shared/schema"
import { formatPrice } from "@/shared/lib/format"

export default function CartPage() {
  const cart = useCart()
  const dict = useDict()
  const { isCheckingOut, checkout } = useCheckout()

  const [form, setForm] = useState({
    name: "",
    phone: UZ_PHONE_PREFIX,
    address: "",
    comment: "",
  })
  const [success, setSuccess] = useState<string | null>(null)

  const onChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, phone: formatUzPhoneInput(e.target.value) }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errorCode = firstCheckoutError(form)
    if (errorCode) {
      const message =
        errorCode === "name"
          ? dict.checkout.errorName
          : errorCode === "address"
            ? dict.checkout.errorAddress
            : dict.checkout.errorPhone
      return toast.error(message)
    }

    const result = await checkout({
      name: form.name,
      phone: form.phone,
      address: form.address,
      comment: form.comment,
    })

    if (result.ok) {
      setSuccess(result.orderNumber)
    } else {
      const message =
        result.error === "empty"
          ? dict.checkout.errorEmpty
          : result.error === "unavailable"
            ? dict.checkout.errorUnavailable
            : dict.checkout.errorPhone
      toast.error(message)
    }
  }

  // Success screen
  if (success) {
    return (
      <div className="container-px flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-accent">
          <CheckCircle2 className="size-10 text-primary" />
        </div>
        <h1 className="mt-6 font-serif text-3xl sm:text-4xl">
          {dict.checkout.successTitle}
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          {dict.checkout.successText}
        </p>
        <p className="mt-4 rounded-full border border-primary/30 bg-card px-5 py-2 font-serif text-primary">
          {dict.checkout.successOrder}: {success}
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/">{dict.checkout.backHome}</Link>
        </Button>
      </div>
    )
  }

  // Empty cart
  if (cart.hydrated && cart.lines.length === 0) {
    return (
      <Empty className="container-px min-h-[60vh] justify-center">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-16 bg-accent text-primary/70">
            <ShoppingBag className="size-7" />
          </EmptyMedia>
          <EmptyTitle className="font-serif text-3xl">{dict.cart.empty}</EmptyTitle>
          <EmptyDescription>{dict.cart.emptyHint}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/catalog">{dict.featured.viewAll}</Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="container-px py-12 lg:py-16">
      <h1 className="font-serif text-4xl sm:text-5xl">{dict.cart.title}</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Items + form */}
        <div className="space-y-8">
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {cart.lines.map((line) => (
              <li key={line.productId} className="flex gap-4 p-4 sm:p-5">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-brand-green-deep">
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/product/${line.slug}`}
                        className="font-serif text-lg transition hover:text-primary"
                      >
                        {line.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {dict.common.volume}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => cart.remove(line.productId)}
                      className="text-muted-foreground hover:bg-transparent hover:text-destructive"
                      aria-label={dict.common.remove}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-border">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          cart.setQuantity(line.productId, line.quantity - 1)
                        }
                        aria-label={dict.common.remove}
                        className="rounded-full text-muted-foreground hover:bg-transparent hover:text-primary"
                      >
                        <Minus />
                      </Button>
                      <span className="w-9 text-center text-sm tabular-nums">
                        {line.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          cart.setQuantity(line.productId, line.quantity + 1)
                        }
                        aria-label={dict.common.addToCart}
                        className="rounded-full text-muted-foreground hover:bg-transparent hover:text-primary"
                      >
                        <Plus />
                      </Button>
                    </div>
                    <span className="font-serif text-lg text-primary tabular-nums">
                      {formatPrice(line.price * line.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <form
            id="checkout-form"
            onSubmit={submit}
            className="space-y-5 rounded-2xl border border-border bg-card p-6"
          >
            <div>
              <h2 className="font-serif text-2xl">{dict.checkout.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {dict.checkout.subtitle}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{dict.checkout.name}</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={onChange("name")}
                  placeholder={dict.checkout.namePlaceholder}
                  className="bg-brand-green-deep/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{dict.checkout.phone}</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={onPhoneChange}
                  placeholder={dict.checkout.phonePlaceholder}
                  className="bg-brand-green-deep/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{dict.checkout.address}</Label>
              <Input
                id="address"
                value={form.address}
                onChange={onChange("address")}
                placeholder={dict.checkout.addressPlaceholder}
                className="bg-brand-green-deep/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">{dict.checkout.comment}</Label>
              <Textarea
                id="comment"
                value={form.comment}
                onChange={onChange("comment")}
                placeholder={dict.checkout.commentPlaceholder}
                className="min-h-20 bg-brand-green-deep/40"
              />
            </div>
          </form>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-2xl border border-primary/20 bg-card p-6">
            <h2 className="font-serif text-xl">{dict.cart.summary}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{dict.cart.items}</span>
                <span className="tabular-nums">{cart.count}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{dict.cart.delivery}</span>
                <span className="text-right text-xs">
                  {dict.cart.deliveryNote}
                </span>
              </div>
            </div>
            <Separator className="bg-border" />
            <div className="flex items-end justify-between">
              <span className="text-muted-foreground">{dict.common.total}</span>
              <span className="font-serif text-2xl text-primary tabular-nums">
                {formatPrice(cart.total)}{" "}
                <span className="text-sm">{dict.common.currency}</span>
              </span>
            </div>
            <Button
              type="submit"
              form="checkout-form"
              size="lg"
              disabled={isCheckingOut}
              className="w-full bg-primary font-medium text-primary-foreground hover:bg-primary/90"
            >
              {isCheckingOut
                ? dict.checkout.submitting
                : dict.checkout.submit}
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Link href="/catalog">{dict.common.continue}</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
