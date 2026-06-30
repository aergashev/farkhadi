import type { MetadataRoute } from "next"

import { getActiveProducts } from "@/entities/product/data/server/store"
import { SITE_URL } from "@/shared/lib/seo"

// Products are DB-driven, so the sitemap is generated per request.
export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/catalog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/quiz`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ]

  // Never let a DB hiccup break the sitemap — fall back to static routes only.
  let products: Awaited<ReturnType<typeof getActiveProducts>> = []
  try {
    products = await getActiveProducts()
  } catch {
    products = []
  }

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...productRoutes]
}
