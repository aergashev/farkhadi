import { notFound } from "next/navigation"
import type { Metadata } from "next"

import {
  getActiveProducts,
  getProductBySlug,
} from "@/entities/product/data/server/store"
import { getLocale } from "@/providers/lib/i18n/server"
import { JsonLd } from "@/shared/seo/json-ld"
import { absoluteUrl, breadcrumbLd, productLd } from "@/shared/lib/seo"
import { ProductDetail } from "../../_components/product-detail"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: { absolute: "FarKhadi" } }

  const name = product.name.uz
  const description = product.tagline.uz
  const canonical = `/product/${product.slug}`

  return {
    title: name,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: absoluteUrl(canonical),
      title: `${name} — FarKhadi`,
      description,
      // og:image is supplied by the sibling opengraph-image.tsx route.
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — FarKhadi`,
      description,
    },
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

  const [all, locale] = await Promise.all([getActiveProducts(), getLocale()])
  const related = all.filter((p) => p.id !== product.id).slice(0, 4)

  const breadcrumb = breadcrumbLd([
    { name: "Bosh sahifa", path: "/" },
    { name: "Katalog", path: "/catalog" },
    { name: product.name.uz, path: `/product/${product.slug}` },
  ])

  return (
    <>
      <JsonLd data={[productLd(product, locale), breadcrumb]} />
      <ProductDetail product={product} related={related} />
    </>
  )
}
