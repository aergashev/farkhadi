import "server-only"

import type { Prisma } from "@prisma/client"
import { getPrisma } from "@/providers/services/prisma/server"
import type { Product } from "../shared/types"
import { SEED_PRODUCTS } from "../shared/seed"

type ProductRow = Prisma.ProductGetPayload<object>

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name as unknown as Product["name"],
    tagline: row.tagline as unknown as Product["tagline"],
    description: row.description as unknown as Product["description"],
    notes: row.notes as unknown as Product["notes"],
    price: row.price,
    volumeMl: row.volumeMl,
    image: row.image,
    accent: row.accent,
    active: row.active,
    featured: row.featured,
    createdAt: row.createdAt.toISOString(),
  }
}

function toRow(product: Product) {
  return {
    slug: product.slug,
    name: product.name as unknown as Prisma.InputJsonValue,
    tagline: product.tagline as unknown as Prisma.InputJsonValue,
    description: product.description as unknown as Prisma.InputJsonValue,
    notes: product.notes as unknown as Prisma.InputJsonValue,
    price: product.price,
    volumeMl: product.volumeMl,
    image: product.image,
    accent: product.accent,
    active: product.active,
    featured: product.featured,
    createdAt: new Date(product.createdAt),
  }
}

// Seed the catalogue once per warm instance if the table is empty.
let seeded = false
async function ensureSeeded() {
  if (seeded) return
  const prisma = getPrisma()
  const count = await prisma.product.count()
  if (count === 0) {
    await prisma.product.createMany({
      data: SEED_PRODUCTS.map((p) => ({ id: p.id, ...toRow(p) })),
      skipDuplicates: true,
    })
  }
  seeded = true
}

export async function getAllProducts(): Promise<Product[]> {
  await ensureSeeded()
  const rows = await getPrisma().product.findMany({ orderBy: { createdAt: "asc" } })
  return rows.map(toProduct)
}

export async function getActiveProducts(): Promise<Product[]> {
  await ensureSeeded()
  const rows = await getPrisma().product.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  })
  return rows.map(toProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await ensureSeeded()
  const row = await getPrisma().product.findUnique({ where: { slug } })
  return row ? toProduct(row) : null
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await getPrisma().product.findUnique({ where: { id } })
  return row ? toProduct(row) : null
}

/** Create or update a single product (keyed by id). */
export async function upsertProduct(product: Product): Promise<void> {
  const data = toRow(product)
  await getPrisma().product.upsert({
    where: { id: product.id },
    create: { id: product.id, ...data },
    update: data,
  })
}

export async function deleteProductById(id: string): Promise<void> {
  await getPrisma()
    .product.delete({ where: { id } })
    .catch(() => {
      /* already gone — ignore */
    })
}
