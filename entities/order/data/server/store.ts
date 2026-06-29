import "server-only"

import type { Prisma } from "@prisma/client"
import { getPrisma } from "@/providers/services/prisma/server"
import type { Order, OrderItem, OrderStatus } from "../shared/types"

type OrderRow = Prisma.OrderGetPayload<object>

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    number: row.number,
    customer: {
      name: row.customerName,
      phone: row.customerPhone,
      address: row.customerAddress,
      comment: row.customerComment ?? undefined,
    },
    items: row.items as unknown as OrderItem[],
    total: row.total,
    status: row.status as OrderStatus,
    createdAt: row.createdAt.toISOString(),
  }
}

export async function getAllOrders(): Promise<Order[]> {
  const rows = await getPrisma().order.findMany({ orderBy: { createdAt: "desc" } })
  return rows.map(toOrder)
}

export async function appendOrder(order: Order): Promise<void> {
  await getPrisma().order.create({
    data: {
      id: order.id,
      number: order.number,
      customerName: order.customer.name,
      customerPhone: order.customer.phone,
      customerAddress: order.customer.address,
      customerComment: order.customer.comment ?? null,
      items: order.items as unknown as Prisma.InputJsonValue,
      total: order.total,
      status: order.status,
      createdAt: new Date(order.createdAt),
    },
  })
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<void> {
  await getPrisma().order.update({ where: { id }, data: { status } })
}
