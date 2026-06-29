"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ImagePlus } from "lucide-react"
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
import { ImageCropper, type CroppedImage } from "./image-cropper"

export function ProductFormDialog({
  product,
  trigger,
}: {
  product?: Product
  trigger: React.ReactNode
}) {
  const dict = useDict()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  // Image cropping state.
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropped, setCropped] = useState<CroppedImage | null>(null)

  const join = (arr?: string[]) => (arr ?? []).join(", ")

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setCropSrc(URL.createObjectURL(file))
    e.target.value = "" // allow re-picking the same file
  }

  const onCropDone = (result: CroppedImage) => {
    if (cropped) URL.revokeObjectURL(cropped.url)
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropped(result)
    setCropSrc(null)
  }

  const previewUrl = cropped?.url ?? product?.image ?? null

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    // Submit the cropped image (if any) under the `image` field.
    if (cropped) {
      formData.set(
        "image",
        new File([cropped.blob], "product.jpg", { type: "image/jpeg" }),
      )
    }
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

        <form onSubmit={onSubmit} className="space-y-5">
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

          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          {/* Image with crop */}
          <div className={field}>
            <Label>{dict.admin.image}</Label>
            <div className="flex items-start gap-4">
              <div className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-brand-green-deep">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="preview"
                    fill
                    sizes="112px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <ImagePlus className="size-6" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={onPickFile}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  className="gap-2 border-border hover:bg-accent hover:text-primary"
                >
                  <ImagePlus className="size-4" />
                  {previewUrl ? dict.admin.changeImage : dict.admin.uploadImage}
                </Button>
                {cropped && (
                  <p className="text-xs text-muted-foreground">
                    {dict.admin.imageSize}: {cropped.width}×{cropped.height} ·{" "}
                    {(cropped.blob.size / 1024).toFixed(0)} KB
                  </p>
                )}
                <p className="text-xs text-muted-foreground">3:4 · JPEG/PNG/WebP</p>
              </div>
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

      {cropSrc && (
        <ImageCropper
          src={cropSrc}
          open
          onCancel={() => {
            URL.revokeObjectURL(cropSrc)
            setCropSrc(null)
          }}
          onDone={onCropDone}
        />
      )}
    </Dialog>
  )
}
