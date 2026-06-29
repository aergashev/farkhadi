"use client"

import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import { Download, Loader2, Share2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/providers/lib/i18n/client"
import { pickLocale } from "@/shared/lib/format"
import type { Product } from "@/entities/product/data/shared/types"
import { QUIZ_UI, type Archetype } from "../shared"

export function ShareCard({
  product,
  archetype,
  onShared,
}: {
  product: Product
  archetype: Archetype
  onShared?: () => void
}) {
  const { locale } = useI18n()
  const L = <T,>(v: Record<"uz" | "ru", T>) => pickLocale(v, locale)
  const name = pickLocale(product.name, locale)
  const cardRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)

  // This card renders only client-side (reached via in-app quiz state).
  const host =
    typeof window !== "undefined"
      ? `${window.location.host}/quiz`
      : "farkhadi.vercel.app/quiz"

  async function renderPng(): Promise<{ dataUrl: string; file: File } | null> {
    if (!cardRef.current) return null
    const dataUrl = await toPng(cardRef.current, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#0c2c18",
    })
    const blob = await (await fetch(dataUrl)).blob()
    return {
      dataUrl,
      file: new File([blob], "farkhadi-natija.png", { type: "image/png" }),
    }
  }

  function download(dataUrl: string) {
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = "farkhadi-natija.png"
    a.click()
  }

  const shareToInstagram = async () => {
    setBusy(true)
    try {
      const gen = await renderPng()
      if (!gen) return
      onShared?.()
      const nav = navigator as Navigator & {
        canShare?: (data?: { files?: File[] }) => boolean
      }
      const canShareFiles =
        typeof nav.canShare === "function" && nav.canShare({ files: [gen.file] })
      if (canShareFiles && typeof nav.share === "function") {
        try {
          await nav.share({ files: [gen.file], title: L(QUIZ_UI.shareTitle) })
          return
        } catch {
          return // user cancelled the native sheet
        }
      }
      // Desktop / unsupported: save the image so they can upload it manually.
      download(gen.dataUrl)
      toast(L(QUIZ_UI.shareError))
    } catch {
      toast.error(L(QUIZ_UI.shareError))
    } finally {
      setBusy(false)
    }
  }

  const savePhoto = async () => {
    setBusy(true)
    try {
      const gen = await renderPng()
      if (!gen) return
      onShared?.()
      download(gen.dataUrl)
      toast.success(L(QUIZ_UI.photoSaved))
    } catch {
      toast.error(L(QUIZ_UI.shareError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {/* 9:16 story-ready card (this exact node is exported to PNG) */}
      <div
        ref={cardRef}
        className="relative aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-[1.75rem] px-5 py-5 text-center"
        style={{
          background: "linear-gradient(160deg, #0e3a20 0%, #0c2c18 50%, #0a2113 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(72% 40% at 50% 16%, rgba(244,199,120,0.20), transparent 60%)",
          }}
        />
        <div className="relative flex h-full flex-col">
          {/* Top */}
          <div className="flex flex-col items-center gap-1">
            <span className="font-serif text-lg tracking-wide text-primary">
              FarKhadi
            </span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-primary/70">
              {L(QUIZ_UI.shareLabel)}
            </span>
          </div>

          {/* Main */}
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-cream/60">
              {L(QUIZ_UI.shareMyResult)}
            </span>
            <span className="text-[2.6rem] leading-none">{archetype.emoji}</span>
            <span className="font-serif text-xl font-semibold uppercase leading-tight tracking-wide text-primary">
              {L(archetype.name)}
            </span>
            <div className="mt-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-brand-cream/60">
                {L(QUIZ_UI.shareMatch)}
              </p>
              <p className="font-serif text-lg text-brand-cream">{name}</p>
            </div>
            <p className="mt-1.5 max-w-[14rem] text-[13px] italic leading-snug text-brand-cream/85">
              “{L(archetype.personality)}”
            </p>
          </div>

          {/* Bottom */}
          <div className="flex flex-col items-center gap-0.5 border-t border-primary/20 pt-3">
            <span className="font-serif text-sm text-primary">
              {L(QUIZ_UI.shareCtaTitle)}
            </span>
            <span className="text-[11px] text-brand-cream/70">
              {L(QUIZ_UI.shareCtaSub)}
            </span>
            <span className="mt-0.5 font-mono text-[10px] tracking-wide text-brand-cream/70">
              {host}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex w-full max-w-[340px] flex-col gap-3">
        <Button
          onClick={shareToInstagram}
          disabled={busy}
          size="lg"
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Share2 className="size-4" />
          )}
          {busy ? L(QUIZ_UI.preparing) : L(QUIZ_UI.shareToInstagram)}
        </Button>
        <Button
          onClick={savePhoto}
          disabled={busy}
          variant="outline"
          className="gap-2 border-primary/40 bg-transparent text-primary hover:bg-accent hover:text-primary"
        >
          <Download className="size-4" />
          {L(QUIZ_UI.savePhoto)}
        </Button>
      </div>
    </div>
  )
}
