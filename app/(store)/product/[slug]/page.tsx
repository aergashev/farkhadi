import { notFound } from "next/navigation"
import type { Metadata } from "next"

import {
  getActiveProducts,
  getProductBySlug,
} from "@/entities/product/data/server/store"
import { ProductDetail } from "../../_components/product-detail"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "FarKhadi" }
  return {
    title: `${product.name.uz} — FarKhadi`,
    description: product.tagline.uz,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || !product.active) notFound()

  const all = await getActiveProducts()
  const related = all.filter((p) => p.id !== product.id).slice(0, 4)

  return <ProductDetail product={product} related={related} />
}
