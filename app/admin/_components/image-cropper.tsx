"use client"

import { useCallback, useState } from "react"
import Cropper, { type Area } from "react-easy-crop"
import "react-easy-crop/react-easy-crop.css"
import { RotateCw, ZoomIn } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useDict } from "@/providers/lib/i18n/client"

/** Output: longest product image edge, keeps files small (3:4 → 900×1200). */
const OUTPUT_WIDTH = 900
const ASPECT = 3 / 4

export type CroppedImage = { blob: Blob; url: string; width: number; height: number }

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener("load", () => resolve(img))
    img.addEventListener("error", reject)
    img.src = src
  })
}

/** Render the selected crop (with rotation) to a downscaled JPEG blob. */
async function getCroppedImage(
  src: string,
  area: Area,
  rotation: number,
): Promise<CroppedImage> {
  const image = await loadImage(src)
  const rad = (rotation * Math.PI) / 180

  // 1. Draw the full (rotated) image onto a working canvas.
  const safe = Math.max(image.width, image.height) * 2
  const work = document.createElement("canvas")
  work.width = safe
  work.height = safe
  const wctx = work.getContext("2d")!
  wctx.translate(safe / 2, safe / 2)
  wctx.rotate(rad)
  wctx.drawImage(image, -image.width / 2, -image.height / 2)

  // 2. Extract the crop region.
  const out = document.createElement("canvas")
  const scale = Math.min(1, OUTPUT_WIDTH / area.width)
  out.width = Math.round(area.width * scale)
  out.height = Math.round(area.height * scale)
  const octx = out.getContext("2d")!
  octx.drawImage(
    work,
    safe / 2 - image.width / 2 + area.x,
    safe / 2 - image.height / 2 + area.y,
    area.width,
    area.height,
    0,
    0,
    out.width,
    out.height,
  )

  const blob = await new Promise<Blob>((resolve, reject) =>
    out.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/jpeg", 0.9),
  )
  return { blob, url: URL.createObjectURL(blob), width: out.width, height: out.height }
}

export function ImageCropper({
  src,
  open,
  onCancel,
  onDone,
}: {
  src: string
  open: boolean
  onCancel: () => void
  onDone: (result: CroppedImage) => void
}) {
  const dict = useDict()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [area, setArea] = useState<Area | null>(null)
  const [busy, setBusy] = useState(false)

  const onComplete = useCallback((_: Area, pixels: Area) => setArea(pixels), [])

  const apply = async () => {
    if (!area) return
    setBusy(true)
    try {
      onDone(await getCroppedImage(src, area, rotation))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="gap-0 overflow-hidden border-border bg-card p-0 sm:max-w-lg">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="font-serif text-xl">
            {dict.admin.cropTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="relative mt-4 h-[55vh] w-full bg-brand-green-deep">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={ASPECT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onComplete}
            showGrid
          />
        </div>

        <div className="space-y-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <ZoomIn className="size-4 shrink-0 text-muted-foreground" />
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.01}
              onValueChange={([v]) => setZoom(v)}
            />
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              aria-label={dict.admin.rotate}
              className="shrink-0 border-border hover:bg-accent hover:text-primary"
            >
              <RotateCw />
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-3 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="hover:bg-accent"
          >
            {dict.admin.cancel}
          </Button>
          <Button
            type="button"
            onClick={apply}
            disabled={busy || !area}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {busy ? dict.admin.saving : dict.admin.cropDone}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
