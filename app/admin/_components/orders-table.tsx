"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Inbox, Phone } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDict, useI18n } from "@/providers/lib/i18n/client"
import { updateOrderStatusAction } from "@/entities/order/data/server/actions"
import { formatDate, formatPrice } from "@/shared/lib/format"
import type { Order, OrderStatus } from "@/entities/order/data/shared/types"

const STATUS_ORDER: OrderStatus[] = ["new", "confirmed", "done", "cancelled"]

const STATUS_STYLES: Record<OrderStatus, string> = {
  new: "bg-primary/15 text-primary border-primary/30",
  confirmed: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  done: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  const dict = useDict()
  const { locale } = useI18n()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const statusLabel = (s: OrderStatus) =>
    ({
      new: dict.admin.statusNew,
      confirmed: dict.admin.statusConfirmed,
      done: dict.admin.statusDone,
      cancelled: dict.admin.statusCancelled,
    })[s]

  const onStatusChange = (id: string, status: OrderStatus) => {
    startTransition(async () => {
      await updateOrderStatusAction(id, status)
      router.refresh()
    })
  }

  if (orders.length === 0) {
    return (
      <Empty className="rounded-2xl border border-dashed border-border py-20">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-accent text-muted-foreground">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>{dict.admin.noOrders}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl">{dict.admin.ordersTitle}</h2>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-serif text-lg text-primary">
                    {order.number}
                  </span>
                  <Badge
                    variant="outline"
                    className={STATUS_STYLES[order.status]}
                  >
                    {statusLabel(order.status)}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(order.createdAt, locale)}
                </p>
              </div>
              <Select
                value={order.status}
                onValueChange={(v) =>
                  onStatusChange(order.id, v as OrderStatus)
                }
                disabled={pending}
              >
                <SelectTrigger className="w-44 bg-brand-green-deep/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>
                      {statusLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.2fr]">
              {/* Customer */}
              <div className="space-y-1 rounded-xl bg-brand-green-deep/30 p-4 text-sm">
                <p className="font-medium">{order.customer.name}</p>
                <a
                  href={`tel:${order.customer.phone}`}
                  className="flex items-center gap-1.5 text-muted-foreground transition hover:text-primary"
                >
                  <Phone className="size-3.5" />
                  {order.customer.phone}
                </a>
                <p className="text-muted-foreground">{order.customer.address}</p>
                {order.customer.comment && (
                  <p className="text-muted-foreground italic">
                    “{order.customer.comment}”
                  </p>
                )}
              </div>

              {/* Items */}
              <div className="space-y-2">
                <ul className="space-y-1.5 text-sm">
                  {order.items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex justify-between gap-2"
                    >
                      <span className="text-muted-foreground">
                        {item.name}{" "}
                        <span className="text-primary">×{item.quantity}</span>
                      </span>
                      <span className="tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between border-t border-border pt-2 font-serif">
                  <span>{dict.admin.orderTotal}</span>
                  <span className="text-primary tabular-nums">
                    {formatPrice(order.total)} {dict.common.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
