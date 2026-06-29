"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useDict } from "@/providers/lib/i18n/client"
import { upsertProductAction } from "@/entities/product/data/server/actions"
import type { Product } from "@/entities/product/data/shared/types"
import { DEFAULT_PRICE } from "@/entities/product/data/shared/types"

export function ProductFormDialog({
  product,
  trigger,
}: {
  product?: Product
  trigger: React.ReactNode
}) {
  const dict = useDict()
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const join = (arr?: string[]) => (arr ?? []).join(", ")

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await upsertProductAction(formData)
      if (result.ok) {
        toast.success(dict.admin.saved)
        setOpen(false)
        router.refresh()
      } else {
        toast.error(dict.admin.wrongPassword)
      }
    })
  }

  const field = "space-y-1.5"
  const inputCls = "bg-brand-green-deep/40"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto border-border bg-card sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {product ? dict.admin.editProduct : dict.admin.newProduct}
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-5">
          {product && <input type="hidden" name="id" value={product.id} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className={field}>
              <Label>{dict.admin.nameUz}</Label>
              <Input
                name="nameUz"
                required
                defaultValue={product?.name.uz}
                className={inputCls}
              />
            </div>
            <div className={field}>
              <Label>{dict.admin.nameRu}</Label>
              <Input
                name="nameRu"
                required
                defaultValue={product?.name.ru}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className={field}>
              <Label>{dict.admin.descUz} — qisqa</Label>
              <Input
                name="taglineUz"
                defaultValue={product?.tagline.uz}
                className={inputCls}
              />
            </div>
            <div className={field}>
              <Label>{dict.admin.descRu} — кратко</Label>
              <Input
                name="taglineRu"
                defaultValue={product?.tagline.ru}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className={field}>
              <Label>{dict.admin.descUz}</Label>
              <Textarea
                name="descUz"
                defaultValue={product?.description.uz}
                className={`min-h-20 ${inputCls}`}
              />
            </div>
            <div className={field}>
              <Label>{dict.admin.descRu}</Label>
              <Textarea
                name="descRu"
                defaultValue={product?.description.ru}
                className={`min-h-20 ${inputCls}`}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3 rounded-xl border border-border p-4">
            <p className="text-sm font-medium text-primary">
              {dict.product.notesTitle}
            </p>
            {(
              [
                ["top", dict.admin.topNotes],
                ["heart", dict.admin.heartNotes],
                ["base", dict.admin.baseNotes],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="grid gap-3 sm:grid-cols-2">
                <div className={field}>
                  <Label className="text-xs text-muted-foreground">
                    {label} — UZ
                  </Label>
                  <Input
                    name={`${key}Uz`}
                    defaultValue={join(product?.notes[key].uz)}
                    placeholder={dict.admin.notesUz}
                    className={inputCls}
                  />
                </div>
                <div className={field}>
                  <Label className="text-xs text-muted-foreground">
                    {label} — RU
                  </Label>
                  <Input
                    name={`${key}Ru`}
                    defaultValue={join(product?.notes[key].ru)}
                    placeholder={dict.admin.notesRu}
                    className={inputCls}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className={field}>
              <Label>{dict.admin.price}</Label>
              <Input
                name="price"
                type="number"
                defaultValue={product?.price ?? DEFAULT_PRICE}
                className={inputCls}
              />
            </div>
            <div className={field}>
              <Label>Accent</Label>
              <Input
                name="accent"
                type="text"
                defaultValue={product?.accent ?? "#c9a24b"}
                className={inputCls}
              />
            </div>
            <div className={field}>
              <Label>{dict.admin.image}</Label>
              <Input
                name="image"
                type="file"
                accept="image/*"
                className={`${inputCls} file:mr-2 file:text-primary`}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-8">
            <Label className="flex items-center gap-2.5 text-sm font-normal">
              <Switch name="active" defaultChecked={product?.active ?? true} />
              {dict.admin.active}
            </Label>
            <Label className="flex items-center gap-2.5 text-sm font-normal">
              <Switch
                name="featured"
                defaultChecked={product?.featured ?? false}
              />
              {dict.featured.eyebrow}
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="hover:bg-accent"
            >
              {dict.admin.cancel}
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {pending ? dict.admin.saving : dict.admin.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
