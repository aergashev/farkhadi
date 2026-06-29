import { getActiveProducts } from "@/entities/product/data/server/store"
import { getT } from "@/providers/lib/i18n/server"
import { ProductGrid } from "../_components/product-grid"

export const dynamic = "force-dynamic"

export default async function CatalogPage() {
  const products = await getActiveProducts()
  const { dict } = await getT()

  return (
    <div className="container-px py-12 lg:py-16">
      <header className="mb-10 border-b border-border/60 pb-8">
        <span className="text-xs uppercase tracking-[0.22em] text-primary">
          FarKhadi
        </span>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">
          {dict.catalog.title}
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {dict.catalog.subtitle}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          {products.length} {dict.catalog.count}
        </p>
      </header>

      <ProductGrid products={products} />
    </div>
  )
}
