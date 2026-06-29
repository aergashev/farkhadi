"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDict, useI18n } from "@/providers/lib/i18n/client"
import { deleteProductAction } from "@/entities/product/data/server/actions"
import { formatPrice, pickLocale } from "@/shared/lib/format"
import type { Product } from "@/entities/product/data/shared/types"
import { ProductFormDialog } from "./product-form-dialog"

export function ProductsManager({ products }: { products: Product[] }) {
  const dict = useDict()
  const { locale } = useI18n()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const onDelete = (product: Product) => {
    if (!confirm(`${dict.admin.confirmDelete} (${pickLocale(product.name, locale)})`))
      return
    startTransition(async () => {
      const result = await deleteProductAction(product.id)
      if (result.ok) {
        toast.success(dict.admin.deleted)
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl">{dict.admin.productsTitle}</h2>
        <ProductFormDialog
          trigger={
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="size-4" />
              {dict.admin.addProduct}
            </Button>
          }
        />
      </div>

      <div className="grid gap-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-3"
          >
            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-brand-green-deep">
              <Image
                src={product.image}
                alt={pickLocale(product.name, locale)}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-serif text-lg">
                  {pickLocale(product.name, locale)}
                </p>
                {product.featured && (
                  <Badge className="border-0 bg-accent text-[10px] text-primary">
                    ★
                  </Badge>
                )}
                {!product.active && (
                  <Badge variant="outline" className="text-[10px]">
                    {dict.common.soldOut}
                  </Badge>
                )}
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {pickLocale(product.tagline, locale)}
              </p>
              <p className="text-sm text-primary tabular-nums">
                {formatPrice(product.price)} {dict.common.currency}
              </p>
            </div>
            <div className="flex gap-2">
              <ProductFormDialog
                product={product}
                trigger={
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-border hover:bg-accent hover:text-primary"
                  >
                    <Pencil className="size-4" />
                  </Button>
                }
              />
              <Button
                size="icon"
                variant="outline"
                disabled={pending}
                onClick={() => onDelete(product)}
                className="border-border text-muted-foreground hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
